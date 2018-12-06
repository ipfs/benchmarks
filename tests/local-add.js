'use strict'

const { file } = require('./lib/fixtures')
const run = require('./lib/runner')
const { build } = require('./schema/results')
const fs = require('fs')

async function unixFsAdd (node, name, subTest, fileSet, version) {
  const fileStream = fs.createReadStream(file(fileSet))
  const start = process.hrtime()
  const peer = node[0]
  await peer.files.add(fileStream)
  const end = process.hrtime(start)
  return build({
    name: name,
    subTest: subTest,
    file: file(fileSet),
    meta: { version: version },
    description: 'Add file to local repo using unixFS engine',
    fileSet: fileSet,
    duration: {
      s: end[0],
      ms: end[1] / 1000000
    }
  })
}
run(unixFsAdd)
