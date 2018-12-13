'use strict'

const defaultConfig = require('../config/default-config.json')
const privateKey = require('../config/private-key.json')
const { repoPath } = require('../package.json').config

module.exports = (config, init, IPFS, count) => {
  return new Promise((resolve, reject) => {
    const node = new IPFS({
      repo: `${repoPath}${Math.random()
        .toString()
        .substring(2, 8)}`,
      config: config || defaultConfig[count],
      init: init || { privateKey: privateKey[count].privKey }
    })
    node.on('ready', () => {
      resolve(node)
    })
    node.on('stop', () => {
      resolve(node)
    })
    node.on('error', (e) => {
      reject(e)
    })
  })
}
