'use strict'

const fs = require('fs')
const fixtures = require('./lib/fixtures')
const run = require('./lib/runner')
const { build } = require('./schema/results')

async function unixFsAdd (node, name, subtest, testClass) {
  try {
    const fileStream = fs.createReadStream(fixtures[testClass])
    const start = process.hrtime()
    const peer = node[0]
    await peer.files.add(fileStream)
    const end = process.hrtime(start)
    return build({
      name: name,
      subtest: subtest,
      file: fixtures[testClass],
      description: 'Add file to local repo using unixFS engine',
      testClass: testClass,
      duration: {
        s: end[0],
        ms: end[1] / 1000000
      }
    })
  } catch (err) {
    throw Error(err)
  }
}

run(unixFsAdd)
