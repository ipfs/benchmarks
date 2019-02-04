'use strict'

const { file } = require('./lib/fixtures')
const run = require('./lib/runner')
const { build } = require('./schema/results')
const fs = require('fs')
const { description } = require('./config').parseParams()

async function unixFsAdd (node, name, warmup, fileSet, version) {
  const filePath = await file(fileSet)
  const fileStream = fs.createReadStream(filePath)
  const start = process.hrtime()
  const peer = node[0]
  console.log(" add file")
  // output file and dashboard name will match trategy.  default is balanced
  await peer.add(fileStream, { strategy: 'balanced' })
  const end = process.hrtime(start)
  return build({
    name: name,
    warmup: warmup,
    file: filePath,
    meta: { version: version },
    description: `Add file ${description}`,
    file_set: fileSet,
    duration: {
      s: end[0],
      ms: end[1] / 1000000
    }
  })
}
run(unixFsAdd)
