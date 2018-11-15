'use strict'

// const remoteExec = require('ssh-exec')
const { exec } = require('child_process')
const _ = require('lodash')
const config = require('./config')

// const runRemote = (shell, host, user) => {
//   return new Promise((resolve, reject) => {
//     remoteExec(shell, {
//       user: user,
//       host: host
//     }).pipe(output => {
//       resolve(output)
//     })
//   })
// }

const runLocal = shell => {
  return new Promise((resolve, reject) => {
    exec(shell, (err, stdout, stderr) => {
      if (err) {
        reject(new Error(stderr))
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
    let output = await runLocal(test.localShell)
    let results = parseResults(output)
    console.log(results)
  })
}

main()
