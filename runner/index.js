'use strict'

require('make-promises-safe') // installs an 'unhandledRejection' handler
const config = require('./config')
const remote = require('./remote.js')
const local = require('./local.js')
const provision = require('./provision')
const persistence = require('./persistence')

const runCommand = (test) => {
  if (config.stage === 'local') {
    return local.run(test.localShell)
  } else {
    return remote.run(test.shell)
  }
}

// should be replaced by reading a remote jso file that holds the test output
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
  for (let test of config.benchmarks.tests) {
    try {
      let output = await runCommand(test)
      let result = parseResults(output)
      persistence.store(result)
    } catch (e) {
      config.log.error(e)
    }
  }
}

main()
