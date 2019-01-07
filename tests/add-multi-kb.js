'use strict'

const fs = require('fs')
const { build } = require('./schema/results')
const { file } = require('./lib/fixtures')
const run = require('./lib/runner')

async function addMultiKb (node, name, warmup, fileSet, version) {
  const fileArr = await file(fileSet)
  const start = process.hrtime()
  const peer = node[0]
  for (var i = 0, len = fileArr.length; i < len; i++) {
    const fileStream = fs.createReadStream(fileArr[i])
    peer.add ? await peer.add(fileStream) : await peer.files.add(fileStream)
  }
  const end = process.hrtime(start)

  // Pass in test output to build and return

  return build({
    name: name,
    warmup: warmup,
    file: fileSet,
    meta: { version: version },
    description: `Add ${fileArr.length} 1 KB files to local`,
    file_set: fileSet,
    duration: { s: end[0],
      ms: end[1] / 1000000 }
  })
}
run(addMultiKb)
