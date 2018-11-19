'use strict'

const { exec } = require('child_process')
const util = require('util')

const config = require('./config')

const run = shell => {
  config.log.info(`Running [${shell}] locally`)
  util.promisify(exec)
}

module.exports = {
  run: run
}
