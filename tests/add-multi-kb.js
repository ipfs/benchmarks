'use strict'

const fs = require('fs')
const { build } = require('./schema/results')
const { file } = require('./lib/fixtures')
const run = require('./lib/runner')

async function addMultiKb (node, name, subTest, fileSet, version) {
  const fileArr = await file(fileSet) 
  const start = process.hrtime()
  const peer = node[0]
  for (var i = 0, len = fileArr.length; i < len; i++) {
    const filePath = await file(`${fileSet}/${fileArr[i]}`)
    const fileStream = fs.createReadStream(filePath)
    await peer.files.add(fileStream)
  }
  const end = process.hrtime(start)

  // Pass in test output to build and return

  return build({
    name: name,
    subTest: subTest,
    meta: { version: version },
    description: 'Add 100 1 KB files to local',
    fileSet: fileSet,
    duration: { s: end[0],
      ms: end[1] / 1000000 }
  })
}
run(addMultiKb)
