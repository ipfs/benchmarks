'use strict'

const { exec } = require('child_process')

const config = require('./config')

const run = shell => {
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

module.exports = {
  run: run
}
