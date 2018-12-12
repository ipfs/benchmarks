'use strict'

const fs = require('fs')
const { file } = require('./lib/fixtures.js')
const { build } = require('./schema/results')
const { once } = require('stream-iterators-utils')
const run = require('./lib/runner')

const multiPeerTransfer = async (node, name, warmup, fileSet, version) => {
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
  const inserted = peerA.add ? await peerA.add(fileStream) : await peerA.files.add(fileStream)
  peerB.add ? await peerB.add(fileStream) : await peerB.files.add(fileStream)
  peerC.add ? await peerC.add(fileStream) : await peerC.files.add(fileStream)
  peerD.add ? await peerD.add(fileStream) : await peerD.files.add(fileStream)
  peerE.swarm.connect(peerAId.addresses[0])
  peerE.swarm.connect(peerBId.addresses[0])
  peerE.swarm.connect(peerCId.addresses[0])
  peerE.swarm.connect(peerDId.addresses[0])
  const start = process.hrtime()
  let stream = peerE.catReadableStream ? peerE.catReadableStream(inserted[0].hash) : peerE.files.catReadableStream(inserted[0].hash)
  // endof steam
  stream.resume()

  // we cannot use end-of-stream/pump for some reason here
  // investigate.
  // https://github.com/ipfs/js-ipfs/issues/1774
  await once(stream, 'end')
  const end = process.hrtime(start)

  return build({
    name: name,
    warmup: warmup,
    file_set: fileSet,
    file: filePath,
    description: 'Retrieve file from one of 4 peers',
    meta: { version: version },
    duration: {
      s: end[0],
      ms: end[1] / 1000000
    }
  })
}

run(multiPeerTransfer, 5)
