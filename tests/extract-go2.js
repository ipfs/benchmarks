'use strict'

const os = require('os')
const { build } = require('./schema/results')
const { file } = require('./lib/fixtures')
const run = require('./lib/runner')
const { once } = require('stream-iterators-utils')
const NodeFactory = require('./lib/node-factory')
const util = require('util')
const execute = util.promisify(util.promisify(require('child_process').exec))
const conf = { tmpPath: os.tmpdir() }
const { description } = require('./config').parseParams()
const argv = require('minimist')(process.argv.slice(2))

async function extractGo2Js (ipfs, name, warmup, fileSet, version) {
  // Runner rtunrs the NodeJS ipfs but we need to create the Go ipfs
  const nodeFactory = new NodeFactory()
  try {
    await nodeFactory.add('go')
  } catch (e) {
    console.log(e)
    retur
  }
  const filePath = await file(fileSet)
  const peer = ipfs[0]

  const peerId = await peer.id()
  const protocal = argv.t === 'ws' ? 'ws' : 'tcp'
  // output file and dashboard name will match trategy.  default is balanced
  name = protocal === 'ws' ? `${name}Ws` : name
  const id = protocal === 'ws' ? 2 : 0
  let command = `export IPFS_PATH=${conf.tmpPath}/ipfs0 && ipfs swarm connect ${peerId.addresses[id]} > /dev/null`
  try {
    await execute(command)
  } catch (e) {
    console.log(e)
    await nodeFactory.stop('go')
    return
  }
  // redirect stderr to dev/null due to the progress of file being processed is sent to stderr causing maxBuffer error
  const addCommand = `export IPFS_PATH=${conf.tmpPath}/ipfs0 && ipfs add ${filePath} 2> /dev/null`
  try {
    await execute(command)
  } catch (e) {
    console.log(e)
    await nodeFactory.stop('go')
    return
  }
  const { stdout } = await execute(addCommand)
  const start = process.hrtime()
  let stream = peer.catReadableStream(stdout.split(' ')[1])
  // endof steam
  stream.resume()
  await once(stream, 'end')
  const end = process.hrtime(start)
  await nodeFactory.stop('go')
  return build({
    name: name,
    warmup: warmup,
    file: filePath,
    meta: { version: version },
    description: `Cat file ${description}`,
    file_set: fileSet,
    duration: { s: end[0],
      ms: end[1] / 1000000 }
  })
}
run(extractGo2Js)
