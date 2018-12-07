'use strict'

const fs = require('fs')
const { file } = require('./lib/fixtures.js')
const { build } = require('./schema/results')
const run = require('./lib/runner')

const multiPeerTransfer = async (node, name, subTest, fileSet, version) => {
  const filePath = await file(fileSet)
  const fileStream = fs.createReadStream(filePath)
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
  await peerB.files.add(fileStream)
  await peerC.files.add(fileStream)
  await peerD.files.add(fileStream)
  peerE.swarm.connect(peerAId.addresses[0])
  peerE.swarm.connect(peerBId.addresses[0])
  peerE.swarm.connect(peerCId.addresses[0])
  peerE.swarm.connect(peerDId.addresses[0])
  const start = process.hrtime()
  await peerE.files.cat(inserted[0].hash)
  const end = process.hrtime(start)

  return build({
    name: name,
    subTest: subTest,
    fileSet: fileSet,
    file: filePath,
    meta: { version: version },
    duration: {
      s: end[0],
      ms: end[1] / 1000000
    }
  })
}

run(multiPeerTransfer)
