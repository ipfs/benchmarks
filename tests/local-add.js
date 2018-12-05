'use strict'

const fixtures = require('./lib/fixtures')
const run = require('./lib/runner')
const { build } = require('./schema/results')

async function unixFsAdd (node, name, subTest, fileSet, version) {
  try {
    const data = fixtures[fileSet]
    const start = process.hrtime()
    const peer = node[0]
    await peer.files.add(data)
    const end = process.hrtime(start)
    return build({
      name: name,
      subTest: subTest,
      meta: { version: version },
      description: 'Add file to local repo using unixFS engine',
      fileSet: fileSet,
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
