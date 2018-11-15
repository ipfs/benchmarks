'use strict'

const remoteExec = require('ssh-exec-plus')
const { exec } = require('child_process')
const _ = require('lodash')
const config = require('./config')

const runCommand = (test) => {
  if (config.stage === 'local') {
    return runLocal(test.localShell)
  } else {
    return runRemote(test.shell)
  }
}

const runRemote = (shell) => {
  config.log.info(`Running [${shell}] on host [${config.benchmarks.host}]`)
  return new Promise((resolve, reject) => {
    remoteExec(shell, {
      user: config.benchmarks.user,
      host: config.benchmarks.host
    }, (err, stdout, stderr) => {
      if (err) {
        reject(Error(err, stderr))
        return
      }
      resolve(stdout)
    })
  })
}

const runLocal = shell => {
  config.log.info(`Running [${shell}] locally`)
  return new Promise((resolve, reject) => {
    exec(shell, (err, stdout, stderr) => {
      if (err) {
        reject(new Error(stderr))
        return
      }
      resolve(stdout)
    })
  })
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

const main = () => {
  _.each(config.benchmarks.tests, async (test) => {
    try {
      let output = await runCommand(test)
      let results = parseResults(output)
      config.log.info({ results: results })
    } catch (e) {
      config.log.error(e)
    }
  })
}

main()
