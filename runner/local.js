'use strict'

const { exec } = require('child_process')

const config = require('./config')

const run = (shell, name) => {
  config.log.info(`Running [${shell}] locally`)
  return new Promise((resolve, reject) => {
    if (!shell) reject(Error('shell required'))
    exec(shell, (err, stdout, stderr) => {
      config.log.info({
        err: err,
        stdout: stdout,
        stderr: stderr
      })
      if (err || stderr) {
        reject(new Error(stderr))
        return
      }
      if (name) {
        let retrieveCommand = `cat ${config.outFolder}/${name}.json`
        config.log.info(`Retrieving [${retrieveCommand}] locally`)
        exec(retrieveCommand, (err, stdout, stderr) => {
          config.log.info({
            err: err,
            stdout: stdout,
            stderr: stderr
          })
          if (err || stderr) {
            reject(new Error(stderr))
            return
          }
          try {
            let objResults = JSON.parse(stdout)
            resolve(objResults)
          } catch (e) {
            reject(e)
          }
        })
      } else {
        resolve()
      }
    })
  })
}

module.exports = {
  run: run
}
