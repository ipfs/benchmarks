'use strict'

const fs = require('fs')
const ipfsNode = require('./lib/create-node.js')
const { build } = require('./schema/results')
const { write } = require('./lib/output')

async function localExtract (node, name, subtest, file, testClass) {
  try {
    const fileStream = fs.createReadStream(file)
    const inserted = await node.files.add(fileStream)
    const start = process.hrtime()
    const validCID = inserted[0].hash
    await node.files.get(validCID)
    const end = process.hrtime(start)
    return build({
      name: name,
      subtest: subtest,
      file: file,
      description: 'Get file to local repo',
      testClass: testClass,
      duration: { s: end[0],
        ms: end[1] / 1000000 }
    })
  } catch (err) {
    throw Error(err)
  }
}
const results = []

async function scenarios () {
  try {
    const node = await ipfsNode()
    write(await localExtract(node, 'unixFS', 'extract-emptyRepo', './fixtures/200Bytes.txt', 'smallfile'))
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

    const r = await localExtract(node1, 'unixFS', 'extract-emptyRepo', './fixtures/1.2MiB.txt', 'largefile')
    write(r)
    results.push(r)

    write(await localExtract(node1, 'unixFS', 'extract', './fixtures/200Bytes.txt', 'smallfile'))

    write(await localExtract(node, 'unixFS', 'extract', './fixtures/1.2MiB.txt', 'largefile'))

    node.stop()
    node1.stop()
  } catch (err) {
    throw Error(err)
  }
}
scenarios()

module.exports = localExtract
