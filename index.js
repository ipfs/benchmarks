#!/usr/bin/env node
'use strict'

const localExtract = require('./tests/local-extract')
const os = require('os')

// Run through use cases
const logger = require('pino')()
const results = []
async function benchmark() {

  results.push(await localExtract(logger, "unixFS:extract:smallfile", "tests/fixtures/200Bytes.txt"))
  results[0].cpu = os.cpus(),
    results[0].loadAvg = os.loadavg()

  results.push(await localExtract(logger, "unixFS:extract:largefile", "tests/fixtures/1.2MiB.txt"))
  results[1].cpu = os.cpus(),
    results[1].loadAvg = os.loadavg()

  console.log(JSON.stringify(results))

}
benchmark()
