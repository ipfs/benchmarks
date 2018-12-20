'use strict'

const { build } = require('./schema/results')
const run = require('./lib/runner')

async function initializeNodeBrowser (node, name, warmup, fileSet, version) {
  const start = process.hrtime()

  const end = process.hrtime(start)

  return build({
    name: name,
    wamrup: warmup,
    file: '',
    meta: { version: version },
    description: 'Initialize node without pre-generated key',
    file_set: '',
    duration: { s: end[0],
      ms: end[1] / 1000000 }
  })
}

run(initializeNodeBrowser, 1,'browser')
