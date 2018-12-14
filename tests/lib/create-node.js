'use strict'

const { spawn } = require('child_process')
const rimraf = require('rimraf')
const defaultConfig = require('../config/default-config.json')
const defaultConfigGo = require('../config/default-config-go.json')
const goConfigs = require('../config/go-configs.json')
const fs = require('fs')
const privateKey = require('../config/private-key.json')
const { repoPath } = require('../package.json').config

const initRepo = (path) => {
  return new Promise((resolve, reject) => {
    let init = spawn('ipfs', ['init'], { env: Object.assign(process.env, { IPFS_PATH: path }) })
    init.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`)
    })
    init.stderr.on('data', (errorData) => {
      console.error(`${errorData}`)
      reject(errorData)
    })
    init.on('close', (code, signal) => {
      console.error('Repo iinitialized')
      resolve()
    })
  })
}

module.exports = (config, init, IPFS, count, kind = 'nodejs') => {
  if (kind === 'nodejs') {
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
  } else if (kind === 'go') {
    return new Promise(async (resolve, reject) => {
      const peerDir = `${config.tmpPath}/ipfs${count}`
      console.log(`Peer dir: ${peerDir}`)
      const peerSpecificConf = goConfigs[count]
      const peerConf = Object.assign({}, defaultConfigGo, peerSpecificConf)
      rimraf.sync(peerDir)
      fs.mkdirSync(peerDir, { recursive: true })
      await initRepo(peerDir)
      fs.writeFileSync(`${peerDir}/config`, JSON.stringify(peerConf))
      let peer = spawn('ipfs', ['daemon'], { env: Object.assign(process.env, { IPFS_PATH: peerDir }) })
      peer.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`)
        if (data.includes('Daemon is ready')) resolve(peer)
      })
      peer.stderr.on('data', (data) => {
        console.error(`${data}`)
        reject(data)
      })
      peer.on('close', (code, signal) => {
        console.error('Daemon is stopped')
      })
    })
  }
}
