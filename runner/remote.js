'use strict'

const remoteExec = require('ssh-exec-plus')
const config = require('./config')

const run = (shell, name) => {
  config.log.info(`Running [${shell}] on host [${config.benchmarks.host}] for user [${config.benchmarks.user}] using [${config.benchmarks.key}]`)
  return new Promise((resolve, reject) => {
    remoteExec(shell, {
      user: config.benchmarks.user,
      host: config.benchmarks.host,
      key: config.benchmarks.key
    }, (err, stdout, stderr) => {
      config.log.info({
        err: err,
        stdout: stdout,
        stderr: stderr
      })
      if (err) {
        reject(Error(err))
      } else if (stderr) {
        if (!name && stderr.includes('No such file or directory')) {
          resolve('')
        } else {
          reject(Error(stderr))
        }
      }

      if (name) {
        let retrieveCommand = `cat ${config.outFolder}/${name}.json`
        config.log.info(`Retrieving [${config.outFolder}/${name}.json] from [${config.benchmarks.host}]`)
        remoteExec(retrieveCommand, {
          user: config.benchmarks.user,
          host: config.benchmarks.host,
          key: config.benchmarks.key
        }, (err, stdout, stderr) => {
          // config.log.info({
          //   err: err,
          //   stdout: stdout.substring(0, 500) + '\n...',
          //   stderr: stderr
          // })
          if (err || stderr) {
            reject(new Error(stderr))
            return
          }
          if (stdout) {
            try {
              let objResults = JSON.parse(stdout)
              config.log.info(objResults)
              resolve(objResults)
            } catch (e) {
              reject(e)
            }
          }
        })
      } else {
        resolve(stdout)
      }

    })
  })
}

module.exports = {
  run: run
}
