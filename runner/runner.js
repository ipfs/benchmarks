'use strict'

const config = require('./config')
const remote = require('./remote.js')
const local = require('./local.js')
const provision = require('./provision')
const persistence = require('./persistence')
const os = require('os')
const util = require('util')
const writeFile = util.promisify(require('fs').writeFile)
const mkDir = util.promisify(require('fs').mkdir)
const runCommand = (command, name) => {
  if (config.stage === 'local') {
    return local.run(command, name)
  } else {
    return remote.run(command, name)
  }
}

const run = async (commit) => {
  const targetDir = `${os.tmpdir()}/${Date.now()}`
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
      await writeFile(`${targetDir}/${test.name}/results.json`, JSON.stringify(result))
      await persistence.store(result)
    } catch (e) {
      config.log.error(e)
    }
    if (process.env.DOCTOR !== 'off') { // then run it with each of the clinic tools
      try {
        for (let op of ['doctor']) { //, 'flame', 'bubbleProf']) {
          for (let run of test[op]) {
            let sha = await runCommand(run.command, test.name)
            // just log it for now, but TODO to relate this to datapoints written for a specific commit
            config.log.info({
              benchmark: {
                name: run.benchmarkName,
                fileSet: run.fileSet
              },
              clinic: {
                operation: op,
                sha: sha
              },
              ipfs: {
                commit: commit || 'tbd'
              }
            })
          }
        }
        // cleanup clinic files
        await runCommand(config.benchmarks.cleanup)
      } catch (e) {
        config.log.error(e)
      }
    }
  }
}

module.exports = run
