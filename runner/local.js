'use strict'

const { spawn } = require('child_process')

const config = require('./config')

const run = (shell, name) => {
  config.log.info(`Running [${shell}] locally`)
  let args = shell.split(' ')
  let cmd = args[0]
  args.shift()

  return new Promise((resolve, reject) => {
    if (!shell) return reject(Error('shell command required'))
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
      commandLogger.error(err, 'Local command error')
    })
  })
}

module.exports = {
  run: run
}
