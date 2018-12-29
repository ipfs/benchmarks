'use strict'

const config = require('./config')
const remote = require('./remote.js')
const local = require('./local.js')
const provision = require('./provision')
const persistence = require('./persistence')
const retrieve = require('./retrieve')
const ipfs = require('./ipfs')
const os = require('os')
const util = require('util')
const fs = require('fs')
const writeFile = util.promisify(fs.writeFile)
const mkDir = util.promisify(fs.mkdir)
const runCommand = (command, name) => {
  if (config.stage === 'local') {
    return local.run(command, name)
  } else {
    return remote.run(command, name)
  }
}

const run = async (commit) => {
  let results = []
  const now = Date.now()
  const targetDir = `${os.tmpdir()}/${now}`
  await mkDir(targetDir, { recursive: true })
  if (config.stage !== 'local') {
    try {
      await provision.ensure(commit)
    } catch (e) {
      config.log.error(e)
    }
  }
  for (let test of config.benchmarks.tests) {
    // first run the benchmark straight up
    try {
      let result = await runCommand(test.benchmark, test.name)
      config.log.debug(result)
      config.log.debug(`Creating ${targetDir}/${test.name}`)
      await mkDir(`${targetDir}/${test.name}`, { recursive: true })
      config.log.debug(`Writing results ${targetDir}/${test.name}/results.json`)
      await writeFile(`${targetDir}/${test.name}/results.json`, JSON.stringify(result))
      results.push(result)
    } catch (e) {
      throw e
    }
    if (process.env.DOCTOR !== 'off') { // then run it with each of the clinic tools
      config.log.debug('running Doctor')
      try {
        for (let op of ['doctor', 'flame', 'bubbleProf']) {
          for (let run of test[op]) {
            config.log.debug(`${run.benchmarkName}`)
            await runCommand(run.command)
            // just log it for now, but TODO to relate this to datapoints written for a specific commit
            config.log.info({
              benchmark: {
                name: run.benchmarkName,
                fileSet: run.fileSet
              },
              clinic: {
                operation: op
              },
              ipfs: {
                commit: commit || 'tbd'
              }
            })
            // retrieve the clinic files
            await retrieve(config, run, targetDir)
          }
        }
        // cleanup clinic files
        await runCommand(config.benchmarks.cleanup)
      } catch (e) {
        config.log.error(e)
      }
    } else {
      config.log.info(`not running doctor: ${process.env.DOCTOR}`)
    }
  }
  try {
    config.log.info(`Uploading ${targetDir} to IPFS network`)
    const storeOutput = await ipfs.store(targetDir)
    config.log.debug(storeOutput)
    const sha = ipfs.parse(storeOutput, now)
    config.log.info(`sha: ${sha}`)
    config.log.debug(`Persisting results in DB`)
    for (let result of results) {
      result.meta.sha = sha
      await persistence.store(result)
    }
  } catch (e) {
    config.log.error(`Error storing on IPFS network: ${e.message}`)
  }
}

module.exports = run
