'use strict'

const fs = require('fs')
const fixtures = require('./lib/fixtures.js')
const { build } = require('./schema/results')
const run = require('./lib/runner')

const multiPeerTransfer = async (node, name, subTest, testClass) => {
  // Insert into peerA
  const fileStream = fs.createReadStream(fixtures[testClass])
  const peerA = node[0]
  const peerB = node[1]
  const peerC = node[2]
  const peerD = node[3]
  const peerE = node[4]
  const peerAId = await peerA.id()
  const peerBId = await peerB.id()
  const peerCId = await peerC.id()
  const peerDId = await peerD.id()
  const inserted = await peerA.files.add(fileStream)
  await await peerB.files.add(fileStream)
  await await peerC.files.add(fileStream)
  await await peerD.files.add(fileStream)
  peerE.swarm.connect(peerAId.addresses[0])
  peerE.swarm.connect(peerBId.addresses[0])
  peerE.swarm.connect(peerCId.addresses[0])
  peerE.swarm.connect(peerDId.addresses[0])

  // peerB doesn't have any data cached, get all from peerA
  const start = process.hrtime()
  await peerE.files.cat(inserted[0].hash)
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

run(multiPeerTransfer)
