'use strict'

const os = require('os')
const fs = require('fs')
const { build } = require('./schema/results')
const { file } = require('./lib/fixtures')
const run = require('./lib/runner')
const NodeFactory = require('./lib/node-factory')
const util = require('util')
const execute = util.promisify(util.promisify(require('child_process').exec))
const conf = { tmpPath: os.tmpdir() }

async function extractJs2Go (ipfs, name, warmup, fileSet, version) {
  console.log(fileSet)
  //  Runner returns the NodeJS ipfs but we need to create the Go ipfs
  const nodeFactory = new NodeFactory()
  await nodeFactory.add('go')
  const filePath = await file(fileSet)
  const fileStream = fs.createReadStream(filePath)
  const peer = ipfs[0]
  const inserted = await peer.add(fileStream)

  const peerId = await peer.id()
  const protocal = process.argv[2] === 'ws' ? 'ws' : 'tcp'
  // output file and dashboard name will match trategy.  default is balanced
  name = protocal === 'ws' ? `${name}Ws` : name
  const id = protocal === 'ws' ? 2 : 0
  let command = `export IPFS_PATH=${conf.tmpPath}/ipfs0 && ipfs swarm connect ${peerId.addresses[id]} > /dev/null`
  await execute(command)

  const start = process.hrtime()
  command = `export IPFS_PATH=${conf.tmpPath}/ipfs0 && ipfs cat ${inserted[0].hash}  > /dev/null`
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
