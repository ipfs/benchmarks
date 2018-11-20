'use strict'

const fs = require('fs')
const os = require('os')
const ipfsNode = require('../lib/create-node.js')
const { resultsDTO, build } = require('./schema/results')
const { write } = require('./lib/output')

async function localAdd (node, name, subtest, file, testClass) {
  try {
    const fileStream = fs.createReadStream(file)
    const start = process.hrtime()
    await node.files.add(fileStream)
    const end = process.hrtime(start)
    return build({
      name: name,
      subtest: subtest,
      file: file,
      date: new Date().toISOString(),
      description: 'Add file to local repo using unixFS engine',
      testClass: testClass,
      duration: {
        s: end[0],
        ms: end[1] / 1000000
      },
      cpu: os.cpus(),
      loadAvg: os.loadavg(),
      memory: os.totalmem() - os.freemem()
    })
  } catch (err) {
    throw Error(err)
  }
}

async function scenarios () {
  try {
    const node = await ipfsNode()
    write(await localAdd(node, 'unixFS', 'add-emptyRepo', './fixtures/200Bytes.txt', 'largefile'))
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

    const r = await localAdd(node1, 'unixFS', 'add-empty-repo', './fixtures/1.2MiB.txt', 'largefile')
    write(r)

    write(await localAdd(node1, 'unixFS', 'add-populated-repo', './fixtures/200Bytes.txt', 'smallfile'))

    write(await localAdd(node, 'unixFS', 'add-populated-repo', './fixtures/1.2MiB.txt', 'largefile'))

    node.stop()
    node1.stop()
  } catch (err) {
    throw Error(err)
  }
}

scenarios()

module.exports = localAdd
