'use strict'

const fs = require('fs')
const { build } = require('./schema/results')
const file = require('./lib/fixtures')
const run = require('./lib/runner')

async function addMultiKb (node, name, subtest, fileSet) {
  try {
    const start = process.hrtime()
    const peer = node[0]
fileset.array.forEach(async element => {

  const fileStream = fs.createReadStream(file(element))
  await peer.files.add(fileStream)
  
});
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
  } catch (err) {
    throw Error(err)
  }
}

run(addMultiKb)