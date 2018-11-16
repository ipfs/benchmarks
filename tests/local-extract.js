#!/usr/bin/env node
'use strict'

const fs = require('fs')
const ora = require('ora')
const os = require('os')
const ipfsNode = require('../lib/create-node.js')

async function localExtract (node, name, file) {
  try {
    const fileStream = fs.createReadStream(file)
    const inserted = await node.files.add(fileStream)
    const start = process.hrtime()
    const validCID = inserted[0].hash
    await node.files.get(validCID)
    const end = process.hrtime(start)
    return (
      {
        name: name,
        file: file,
        date: new Date().toISOString(),
        s: end[0],
        ms: end[1] / 1000000,
        cpu: os.cpus(),
        loadAvg: os.loadavg(),
        memory: os.totalmem() - os.freemem()
      }
    )
  } catch (err) {
    throw Error(err)
  }
}
const results = []

async function scenarios () {
  const spinner = ora(`Started `).start()
  spinner.color = 'magenta'
  spinner.text = 'Starting unixFS:extract:smallfile Benchamrk'
  try {
    const node = await ipfsNode()
    results.push(await localExtract(node, 'unixFS:extract:smallfile:emptyRepo', './fixtures/200Bytes.txt'))
    const node1 = await ipfsNode({
      'Addresses': {
        'API': '/ip4/127.0.0.1/tcp/5013',
        'Gateway': '/ip4/127.0.0.1/tcp/9092',
        'Swarm': [
          '/ip4/0.0.0.0/tcp/4013',
          '/ip4/127.0.0.1/tcp/4015/ws'
        ]
      },
      'Bootstrap': []
    })
    spinner.text = 'Starting unixFS:extract:largefile Benchamrk'
    const r = await localExtract(node1, 'unixFS:extract:largefile:emptyRepo', './fixtures/1.2MiB.txt')
    results.push(r)

    results.push(await localExtract(node1, 'unixFS:extract:smallfile', './fixtures/200Bytes.txt'))

    results.push(await localExtract(node, 'unixFS:extract:largefile', './fixtures/1.2MiB.txt'))

    console.log(JSON.stringify(results))

    node.stop()
    node1.stop()
    spinner.succeed()
  } catch (err) {
    spinner.fail()
    throw Error(err)
  }
}
scenarios()

module.exports = localExtract
