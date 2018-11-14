#!/usr/bin/env node
'use strict'

const localExtract = require('./tests/local-extract')
const os = require('os')

// Run through use cases
const logger = require('pino')()
logger.info(os.cpus())

async function benchmark() {

  await localExtract(logger)
  console.log("done")
  logger.info(os.loadavg())

}
benchmark()
