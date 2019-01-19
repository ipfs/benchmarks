'use strict'

const { file } = require('./lib/fixtures')
const run = require('./lib/runner')
const { build } = require('./schema/results')
const fs = require('fs')

async function unixFsAdd (node, name, warmup, fileSet, version) {
  const filePath = await file(fileSet)
  const fileStream = fs.createReadStream(filePath)
  const start = process.hrtime()
  const peer = node[0]
  const strategy = process.argv[2] === 'trickle' ? 'trickle' : 'balanced'
  // output file and dashboard name will match trategy.  default is balanced
  name = strategy === 'trickle' ? `${name}Trickle` : name
  await peer.add(fileStream, { strategy: strategy })
  const end = process.hrtime(start)
  return build({
    name: name,
    warmup: warmup,
    file: filePath,
    meta: { version: version },
    description: 'Add file to local repo using unixFS engine',
    file_set: fileSet,
    duration: {
      s: end[0],
      ms: end[1] / 1000000
    }
  })
}
run(unixFsAdd)
