'use strict'

const { exec } = require('child_process')

const config = require('./config')

const run = (shell, name) => {
  config.log.info(`Running [${shell}] locally`)
  return new Promise((resolve, reject) => {
    exec(shell, (err, stdout, stderr) => {
      if (err) {
        reject(new Error(stderr))
        return
      }
      config.log.info(stdout)
      let retrieveCommand = `cat ${config.outFolder}/${name}.json`
      config.log.info(`Retrieving [${retrieveCommand}] locally`)
      exec(retrieveCommand, (err, stdout, stderr) => {
        if (err) {
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
    })
  })
}

module.exports = {
  run: run
}
