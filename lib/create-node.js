#!/usr/bin/env node
'use strict'
// TODO: point this to the branch code
const IPFS = require('../../js-ipfs')
const config = require('../config/default-config.json')

module.exports = new Promise((resolve) => {
  const peer = new IPFS({
    repo: '/tmp/peer',
    config: config,
    init: {
      emptyRepo: true
    }
  })
  peer.on('ready', () => {
    resolve(peer)
  })
})