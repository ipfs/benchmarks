'use strict'

const fs = require('fs')
const verbose = process.env.VERBOSE || false
const NodeFactory = require('./lib/node-factory')
const fixtures = require('./lib/fixtures.js')
const { store } = require('./lib/output')
const { build } = require('./schema/results')
const clean = require('./lib/clean')

const testName = 'localTransfer'

const log = (msg) => {
  if (verbose) {
    console.log(msg)
  }
}

const getDuration = async (peerA, peerB, subTest, testClass) => {
  // Insert into peerA
  const fileStream = fs.createReadStream(fixtures[testClass])
  const inserted = await peerA.files.add(fileStream)
  log('vmx: inserted:', inserted)

  // peerB doesn't have any data cached, get all from peerA
  const start = process.hrtime()
  await peerB.files.cat(inserted[0].hash)
  const end = process.hrtime(start)

  return build({
    name: testName,
    subtest: subTest,
    testClass: testClass,
    file: fixtures[testClass],
    duration: {
      s: end[0],
      ms: end[1] / 1000000
    }
  })
}

const main = async () => {
  try {
    const nodeFactory = new NodeFactory()
    const peerA = await nodeFactory.createIPFS()
    const peerB = await nodeFactory.createIPFS({
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

    let arrResults = []

    clean.peerRepos()
    arrResults.push(await getDuration(peerA, peerB, 'empty-repo', 'smallfile'))
    clean.peerRepos()
    arrResults.push(await getDuration(peerA, peerB, 'empty-repo', 'largefile'))

    arrResults.push(await getDuration(peerA, peerB, 'populated-repo', 'smallfile'))
    arrResults.push(await getDuration(peerA, peerB, 'populated-repo', 'largefile'))

    store(arrResults)

    nodeFactory.stopIPFS()
    clean.peerRepos()
  } catch (err) {
    throw Error(err)
  }
}

main()
