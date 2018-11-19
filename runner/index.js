'use strict'

const _ = require('lodash')
const config = require('./config')
const remote = require('./remote.js')
const local = require('./local.js')
const provision = require('./provision')

const runCommand = async test => {
  if (config.stage === 'local') {
    let command = await local.run(test.localShell)
    if (command.stderr) throw Error(command.stderr)
    return command.stdout
  } else {
    return remote.run(test.shell)
  }
}

const parseResults = rawOutput => {
  let arrResults = []
  let addLine = false
  let arrOutput = rawOutput.split(/[\n\r]/g)
  for (let i = 0; i < arrOutput.length; i++) {
    if (addLine) arrResults.push(arrOutput[i])
    if (arrOutput[i].includes('BEGIN RESULTS')) {
      addLine = true
    }
    if (arrOutput[i].includes('END RESULTS')) {
      addLine = false
      arrResults.pop()
    }
  }
  let strResult = arrResults.join('')
  try {
    return JSON.parse(strResult)
  } catch (e) {
    throw e
  }
}

const main = async () => {
  if (config.stage !== 'local') {
    await provision.ensure()
  }
  _.each(config.benchmarks.tests, async test => {
    try {
      let output = await runCommand(test)
      let results = parseResults(output)
      config.log.info({ results: results })
    } catch (e) {
      config.log.error(e)
    }
  })
};

main()
