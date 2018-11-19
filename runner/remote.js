'use strict'

const remoteExec = require('ssh-exec-plus')
const config = require('./config')
const util = require('util')

const run = (shell) => {
  config.log.info(`Running [${shell}] on host [${config.benchmarks.host}]`)
  // util.promisify()
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

module.exports = {
  run: run
}
