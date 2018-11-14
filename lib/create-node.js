#!/usr/bin/env node
'use strict'

// TODO: point this to the branch code
const IPFS = require('ipfs')

module.exports = new Promise((resolve) => {
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