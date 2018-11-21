'use strict'

const fs = require('fs')
const os = require('os')
const verbose = process.env.VERBOSE || false
const ipfsNode = require('./lib/create-node.js')
const fixtures = require('./lib/fixtures.js')
const { write } = require('./lib/output')

const log = (msg) => {
  if (verbose) {
    console.log(msg)
  }
}

const getDuration = async (peerA, peerB, testClass) => {
  // Insert into peerA
  const fileStream = fs.createReadStream(fixtures[testClass])
  const inserted = await peerA.files.add(fileStream)
  log('vmx: inserted:', inserted)

  // peerB doesn't have any data cached, get all from peerA
  const start = process.hrtime()
  await peerB.files.cat(inserted[0].hash)
  const end = process.hrtime(start)
  const date = new Date()

  return {
    name: 'local-transfer',
    testClass: testClass,
    date: date.toISOString(),
    file: fixtures[testClass],
    meta: {
      project: 'js-ipfs',
      commit: 'TBD'
    },
    duration: {
      seconds: end[0],
      milliseconds: end[1] / 1000000
    },
    cpu: os.cpus(),
    loadAvg: os.loadavg()
  }
}

const main = async () => {
  try {
    const peerA = await ipfsNode()
    const peerB = await ipfsNode({
      'Addresses': {
        'API': '/ip4/127.0.0.1/tcp/5022',
        'Gateway': '/ip4/127.0.0.1/tcp/9092',
        'Swarm': [
          '/ip4/0.0.0.0/tcp/4022',
          '/ip4/127.0.0.1/tcp/4023/ws'
        ]
      },
      'Bootstrap': []
    })
    const peerAId = await peerA.id()
    peerB.swarm.connect(peerAId.addresses[0])
    log('vmx: connected')

    write(await getDuration(peerA, peerB, 'smallFile'))
    write(await getDuration(peerA, peerB, 'largeFile'))

    peerA.stop()
    peerB.stop()
  } catch (err) {
    throw Error(err)
  }
}

main()
