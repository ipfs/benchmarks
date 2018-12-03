'use strict'

const fs = require('fs')
const verbose = process.env.VERBOSE || false
const fixtures = require('./lib/fixtures.js')
const { build } = require('./schema/results')
const run = require('./lib/runner')

const localTransfer = async (node, name, subTest, testClass) => {
  // Insert into peerA
  const fileStream = fs.createReadStream(fixtures[testClass])
  const peerA = node[0]
  const peerB = node[1]
  const peerAId = await peerA.id()
  peerB.swarm.connect(peerAId.addresses[0])
  const inserted = await peerA.files.add(fileStream)

  // peerB doesn't have any data cached, get all from peerA
  const start = process.hrtime()
  await peerB.files.cat(inserted[0].hash)
  const end = process.hrtime(start)

  return build({
    name: name,
    subtest: subTest,
    testClass: testClass,
    file: fixtures[testClass],
    duration: {
      s: end[0],
      ms: end[1] / 1000000
    }
  })
}

run(localTransfer)
