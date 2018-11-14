#!/usr/bin/env node
'use strict'

const fs = require('fs')
const prettyHrtime = require('pretty-hrtime')

// TODO: point this to the branch code
const IPFS = require('ipfs')
const ora = require('ora')
const handler = "local extract"



const node = new Promise((resolve) => {
  const config = {
    "Addresses": {
      "API": "/ip4/127.0.0.1/tcp/5012",
      "Gateway": "/ip4/127.0.0.1/tcp/9091",
      "Swarm": [
        "/ip4/0.0.0.0/tcp/4012",
        "/ip4/127.0.0.1/tcp/4013/ws"
      ]
    },
    "Bootstrap": []
  }
  const peer = new IPFS({
    repo: '/tmp/peer',
    config: config,
    init: {
      emptyRepo: true
    }
  })
  peer.on('ready', () => {
    console.log('node ready')
    resolve(peer)
  })
})

async function localExtract() {
  const spinner = ora(`Started ${handler}`).start()
  spinner.color = 'magenta'
  spinner.text = "testing"
  const node1 = await node
  const fileStream = fs.createReadStream("tests/fixtures/200Bytes.txt")
  const inserted = await node1.files.add(fileStream)
  console.log('vmx: inserted:', inserted)
  const validCID = inserted[0].hash
  node1.files.get(validCID, function (err, files) {
    files.forEach((file) => {
      console.log(file.path)
      spinner.succeed()
      node1.stop()
    })
  })

}

module.exports = localExtract