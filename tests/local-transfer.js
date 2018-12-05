'use strict'

const fs = require('fs')
const fixtures = require('./lib/fixtures.js')
const { build } = require('./schema/results')
const run = require('./lib/runner')

const localTransfer = async (node, name, subTest, testClass, version) => {
  console.log(testClass)
  const fileStream = fs.createReadStream(fixtures[testClass])
  const peerA = node[0]
  const peerB = node[1]
  const peerAId = await peerA.id()
  peerB.swarm.connect(peerAId.addresses[0])
  const inserted = await peerA.files.add(fileStream)
  const start = process.hrtime()
  await peerB.files.cat(inserted[0].hash)
  const end = process.hrtime(start)

  return build({
    name: name,
    subTest: subTest,
    file: fixtures[testClass],
    meta: { version: version },
    description: 'Transfer file between two local nodes',
    testClass: testClass,
    duration: {
      s: end[0],
      ms: end[1] / 1000000
    }
  })
}

run(localTransfer)
