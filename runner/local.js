'use strict'

const { exec } = require('child_process')

const config = require('./config')
const util = require('util')

const run = async shell => {
  config.log.info(`Running [${shell}] locally`)
  let execAwait = util.promisify(exec)
  try {
    return await execAwait(shell)
  } catch (e) {
    throw Error(e)
  }
  // return new Promise((resolve, reject) => {
  //   exec(shell, (err, stdout, stderr) => {
  //     if (err) {
  //       reject(new Error(stderr))
  //       return
  //     }
  //     resolve(stdout)
  //   })
  // })
}

module.exports = {
  run: run
}
