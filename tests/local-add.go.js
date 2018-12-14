'use strict'

const os = require('os')
const { execSync } = require('child_process')
const { file } = require('./lib/fixtures.js')
const { build } = require('./schema/results')
const createNode = require(`./lib/create-node`)
const conf = {tmpPath: os.tmpdir()}
let out

const unixFsAdd = async (name, warmup, fileSet, version) => {
  const filePath = await file(fileSet)
  let peer = await createNode(conf, null, null, 1, 'go')

  const start = process.hrtime()
  let command = `export IPFS_PATH=${conf.tmpPath}/ipfs1 && ipfs add ${filePath}`
  execSync(command)
  const end = process.hrtime(start)

  peer.kill('SIGTERM')

  return build({
    name: name,
    warmup: warmup,
    file_set: fileSet,
    file: filePath,
    meta: { version: version },
    description: 'Transfer file between two local nodes',
    duration: {
      s: end[0],
      ms: end[1] / 1000000
    }
  })
}

const run = async () => {
  try {
    out = await unixFsAdd('unixFsAdd', true, 'One64MBFile')
    console.log(out)
    out = await unixFsAdd('unixFsAdd', false, 'One64MBFile')
    console.log(out)
  } catch (e) {
    console.log(e)
  }
}

run()
