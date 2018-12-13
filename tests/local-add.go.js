'use strict'

const { exec } = require('child_process')
const { execSync } = require('child_process')
const { file } = require('./lib/fixtures.js')
const { build } = require('./schema/results')

const startNode = (id) => {
  return new Promise((resolve, reject) => {
    let command = `export IPFS_PATH=~/tmp/ipfs${id} && ipfs daemon`
    let peer = exec(command)
    peer.stdout.on('data', (data) => {
      console.log(data)
      if (data.includes('Daemon is ready')) resolve(peer)
    })
    peer.stderr.on('data', (data) => {
      console.error(data)
      reject(data)
    })
  })
}

const unixFsAdd = async (name, warmup, fileSet, version) => {
  const filePath = await file(fileSet)
  let peer = await startNode('A')

  const start = process.hrtime()
  let command = `export IPFS_PATH=~/tmp/ipfsA && ipfs add ${filePath}`
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
  let out = await unixFsAdd('unixFsAdd', true, 'One64MBFile')
  console.log(out)
}

run()
