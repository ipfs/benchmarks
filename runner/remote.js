'use strict'

const remoteExec = require('ssh-exec-plus')
const config = require('./config')
const sshConf = {
  user: config.benchmarks.user,
  host: config.benchmarks.host,
  key: config.benchmarks.key
}

const run = (shell, name, isClinic) => {
  config.log.info(`Running [${shell}] on host [${config.benchmarks.host}] for user [${config.benchmarks.user}] using [${config.benchmarks.key}]`)
  return new Promise((resolve, reject) => {
    remoteExec(shell, sshConf, (err, stdout, stderr) => {
      config.log.debug({
        err: err,
        stdout: stdout,
        stderr: stderr
      })
      if (err || stderr) {
        if (stderr.length) {
          reject(Error(stderr))
        } else {
          reject(Error(stdout))
        }
      }

      // if name is provided we assume it's a json file we read and pass back as the command's result.
      if (name) {
        let results = ''
        let retrieveCommand = `cat ${config.outFolder}/${name}.json`
        config.log.info(`running  [${retrieveCommand}] on [${config.benchmarks.host}]`)
        const stream = remoteExec(retrieveCommand, sshConf, (err, stdout, stderr) => {
          config.log.debug({
            err: err,
            stdout: stdout,
            stderr: stderr
          })
          if (err || stderr) {
            if (stderr.length) {
              reject(Error(stderr))
            } else {
              reject(Error(stdout))
            }
          }
          if (stdout) {
            try {
              console.log("reading data")
            } catch (e) {
              reject(e)
            }
          }
        })
        stream.on('data', function (data) {
          results = results + data
        })
        stream.on('close', function () {
          console.log(results)
          let objResults = JSON.parse(results)
          config.log.debug(objResults)
          resolve(objResults)
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
