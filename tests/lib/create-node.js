#!/usr/bin/env node
'use strict'

const defaultConfig = require('../config/default-config.json')

module.exports = (config, IPFS) => {
  return new Promise((resolve, reject) => {
    console.log('Creating a node..')
    const node = new IPFS({
      repo: '/tmp/.ipfs/' + Math.random()
        .toString()
        .substring(2, 8),
      config: config || defaultConfig,
      init: {
        emptyRepo: true
      }
    })
    node.on('ready', () => {
      resolve(node)
    })
    node.on('error', () => {
      reject(node)
    })
  })
}
