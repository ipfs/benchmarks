#!/usr/bin/env node
'use strict'

const localExtract = require('./tests/local-extract')
const ipfsNode = require('./lib/create-node.js')
const os = require('os')
const ora = require('ora')

// Run through use cases

const results = []
async function benchmark() {
  const spinner = ora(`Started `).start()
  spinner.color = 'magenta'
  spinner.text = "Starting unixFS:extract:smallfile Benchamrk"

  const node = await ipfsNode
  //results.push(await localExtract(node, "unixFS:extract:smallfile", "tests/fixtures/200Bytes.txt"))
  //results[0].cpu = os.cpus()
  //results[0].loadAvg = os.loadavg()

  spinner.text = "Starting unixFS:extract:largefile Benchamrk"
  const r = await localExtract(node, "unixFS:extract:largefile", "tests/fixtures/1.2MiB.txt")
  results.push(r)
  results[0].cpu = os.cpus()
  results[0].loadAvg = os.loadavg()



  console.log(JSON.stringify(results))

  node.stop()
  spinner.succeed()

}
benchmark()
