'use strict'

const { exec } = require('child_process')
const { spawn } = require('child_process')

const config = require('./config')

const run = (shell, name) => {
  config.log.info(`Running [${shell}] locally`)
  let args = shell.split(' ')
  let cmd = args[0]
  args.shift()

  return new Promise((resolve, reject) => {
    if (!shell) reject(Error('shell command required'))
    let cmdInstance = spawn(cmd, args)
    let stdOut = ''
    let stdErr = ''
    const commandLogger = config.log.child({command: cmd})
    cmdInstance.stdout.on('data', (data) => {
      commandLogger.debug(data.toString())
      stdOut += data
    })
    cmdInstance.stderr.on('data', (data) => {
      commandLogger.error(data.toString())
      stdErr += data
    })
    cmdInstance.on('close', (code) => {
      commandLogger.debug(`-- main command end ${code} --`)
      if (code === 0) {
        resolve(stdOut)
      } else {
        commandLogger.error('error', code)
        commandLogger.error(stdErr)
        reject(new Error(stdErr))
      }
    })
    cmdInstance.on('error', (err) => {
      commandLogger.error('error', err)
      reject(new Error(err))
    })

    // if (name) {
      // let retrieveCommand = `cat ${config.outFolder}/${name}.json`
      // config.log.info(`Retrieving [${retrieveCommand}] locally`)
      // const retrieveLogger = config.log.child({command: retrieveCommand})
      // let retrieveStream = exec(retrieveCommand)
      // let jsonResponse = ''
      // retrieveStream.setEncoding('utf-8')
      // retrieveStream.on('data', (data) => {
        // retrieveLogger.debug(data)
        // jsonResponse += data
      // })
      // retrieveStream.on('warn', (data) => {
        // retrieveLogger.error(data)
      // })
      // retrieveStream.on('end', () => {
        // retrieveLogger.debug('-- retrieve command end --')
        // try {
          // let objResults = JSON.parse(jsonResponse)
          // retrieveLogger.debug(objResults)
          // resolve(objResults)
        // } catch (e) {
          // retrieveLogger.error(e)
          // resolve(e)
        // }
      // })
      // retrieveStream.on('error', (err) => {
        // retrieveLogger.error('error', err)
        // resolve(err)
      // })
    // }
  })
}

module.exports = {
  run: run
}
