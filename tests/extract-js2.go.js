'use strict'

const os = require('os')
const fs = require('fs')
const { build } = require('./schema/results')
const { file } = require('./lib/fixtures')
const run = require('./lib/runner')
const { once } = require('stream-iterators-utils')
const NodeFactory = require('./lib/node-factory')
const util = require('util')
const execute = util.promisify(util.promisify(require('child_process').exec))
const conf = { tmpPath: os.tmpdir() }

async function extractJs2Go (ipfs, name, warmup, fileSet, version) {
  console.log(fileSet)
  //Runner rtunrs the NodeJS ipfs but we need to create the Go ipfs
  const nodeFactory = new NodeFactory()
  const ipfsGo = await nodeFactory.add('go')
  const filePath = await file(fileSet)
  const fileStream = fs.createReadStream(filePath)
  const peer = ipfs[0]
  const inserted = await peer.add(fileStream)

  const peerId = await peer.id()
  let command = `export IPFS_PATH=${conf.tmpPath}/ipfs0 && ipfs swarm connect ${peerId.addresses[0]}`
  const results = await execute(command, { maxBuffer: 1024 * 1024 * 100 })

  const start = process.hrtime()
  command = `export IPFS_PATH=${conf.tmpPath}/ipfs0 && ipfs cat ${inserted[0].hash}`
  await execute(command)
  const end = process.hrtime(start)
  await nodeFactory.stop('go')
  return build({
    name: name,
    warmup: warmup,
    file: filePath,
    meta: { version: version },
    description: 'Extract files from JS to Go IPFS peers',
    file_set: fileSet,
    duration: { s: end[0],
      ms: end[1] / 1000000 }
  })
}
run(extractJs2Go)
