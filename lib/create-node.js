#!/usr/bin/env node
'use strict'
// TODO: point this to the branch code
const IPFS = require('../../js-ipfs')
const defaultConfig = require('../config/default-config.json')

module.exports = (config) => {
  return new Promise((resolve, reject) => {
    const node = new IPFS({
      repo: '/tmp/.ipfs-' + Math.random()
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