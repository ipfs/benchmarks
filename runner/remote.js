'use strict'

const remoteExec = require('ssh-exec-plus')
const config = require('./config')
const sshConf = {
  user: config.benchmarks.user,
  host: config.benchmarks.host,
  key: config.benchmarks.key,
  timeout: 1000 * 60 * 3
}

const run = (shell, name) => {
  config.log.info(`Running [${shell}] on host [${config.benchmarks.host}] for user [${config.benchmarks.user}] using [${config.benchmarks.key}]`)
  const commandLogger = config.log.child({command: name || shell})
  return new Promise((resolve, reject) => {
    let mainStream = remoteExec(shell, sshConf)
    let cmdOutput = ''
    mainStream.setEncoding('utf-8')
    mainStream.on('data', (data) => {
      commandLogger.info(data)
      cmdOutput += data
    })
    mainStream.on('warn', (data) => {
      commandLogger.error(data)
    })
    mainStream.on('end', () => {
      commandLogger.debug('-- main command end --')
      // if name is provided we assume it's a json file we read and pass back as the command's result.
      if (name) {
        let retrieveCommand = `cat ${config.outFolder}/${name}.json`
        const retrieveLogger = config.log.child({command: retrieveCommand})
        config.log.info(`running  [${retrieveCommand}] on [${config.benchmarks.host}]`)
        let retrieveStream = remoteExec(retrieveCommand, sshConf)
        let jsonResponse = ''
        retrieveStream.setEncoding('utf-8')
        retrieveStream.on('data', (data) => {
          retrieveLogger.info(data)
          jsonResponse += data
        })
        retrieveStream.on('warn', (data) => {
          retrieveLogger.error(data)
        })
        retrieveStream.on('end', () => {
          retrieveLogger.debug('-- retrieve command end --')
          try {
            let objResults = JSON.parse(jsonResponse)
            retrieveLogger.debug(objResults)
            resolve(objResults)
          } catch (e) {
            retrieveLogger.error(e)
            resolve(e)
          }
        })
        retrieveStream.on('error', (err) => {
          retrieveLogger.error('error', err)
        })
      } else {
        resolve(cmdOutput)
      }
    })
    mainStream.on('error', (err) => {
      commandLogger.error('error', err)
    })
  })
}

module.exports = {
  run: run
}
