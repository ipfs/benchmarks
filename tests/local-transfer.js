'use strict'

const fs = require('fs')
const { file } = require('./lib/fixtures.js')
const { build } = require('./schema/results')
const run = require('./lib/runner')

const localTransfer = async (node, name, subTest, fileSet, version) => {
  const fileStream = fs.createReadStream(file(fileSet))
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
    fileSet: fileSet,
    file: file(fileSet),
    meta: { version: version },
    description: 'Transfer file between two local nodes',
    duration: {
      s: end[0],
      ms: end[1] / 1000000
    }
  })
}

run(localTransfer)
