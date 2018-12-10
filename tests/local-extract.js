'use strict'

const fs = require('fs')
const { build } = require('./schema/results')
const { file } = require('./lib/fixtures')
const run = require('./lib/runner')
const util = require('util')
const stream = require('stream')
const finished = util.promisify(stream.finished)

async function localExtract (node, name, subtest, fileSet, version) {
  const filePath = await file(fileSet)
  const fileStream = fs.createReadStream(filePath)
  const peer = node[0]
  const inserted = await peer.files.add(fileStream)
  const start = process.hrtime()
  const stream = peer.files.catReadableStream(inserted[0].hash)
  // endof steam
  stream.resume()

  await finished(stream)
  console.log('done')
  const end = process.hrtime(start)
  return build({
    name: name,
    subTest: subtest,
    file: filePath,
    meta: { version: version },
    description: 'Get file to local repo',
    fileSet: fileSet,
    duration: { s: end[0],
      ms: end[1] / 1000000 }
  })
}
run(localExtract)
