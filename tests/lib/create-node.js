'use strict'

const { spawn } = require('child_process')
const rimraf = require('rimraf')
const defaultConfig = require('../config/default-config.json')
const defaultConfigGo = require('../config/default-config-go.json')
const goConfigs = require('../config/go-configs.json')
const fs = require('fs')
const privateKey = require('../config/private-key.json')
const os = require('os')
const conf = { tmpPath: os.tmpdir() }
const { repoPath } = require('../package.json').config
const ipfsClient = require('ipfs-http-client')
const IPFSFactory = require('ipfsd-ctl')
const util = require('util')

const initRepo = async (path) => {
  return new Promise((resolve, reject) => {
    let init = spawn('ipfs', ['init'], { env: Object.assign(process.env, { IPFS_PATH: path }) })
    init.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`)
    })
    init.stderr.on('data', (errorData) => {
      console.error(`${errorData}`)
      return reject(Error(errorData))
    })
    init.on('close', (code, signal) => {
      console.error('Repo iinitialized')
      resolve(init)
    })
  })
}

const CreateNodeJs = async (config, init, IPFS, count) => {
  return new Promise((resolve, reject) => {
    const node = new IPFS({
      repo: `${repoPath}${Math.random()
        .toString()
        .substring(2, 8)}`,
      config: config || defaultConfig[count],
      init: init || { privateKey: privateKey[count].privKey },
      EXPERIMENTAL: {
        pubsub: true
      }
    })
    node.on('ready', () => {
      resolve(node)
    })
    node.on('stop', () => {
      resolve(node)
    })
    node.on('error', (e) => {
      return reject(e)
    })
  })
}

const CreateBrowser = async (config, init, IPFS, count) => {
  return new Promise((resolve, reject) => {

  // create deamon
  let daemon
  let client
  const f = IPFSFactory.create()
  f.spawn({ initOptions: { bits: 1024 } }, (err, _ipfsd) => {
    daemon = _ipfsd
    client = ipfsClient(_ipfsd.apiAddr)
    resolve(client)
  })
})
}

const CreateGo = async (config, init, IPFS, count) => {
  return new Promise(async (resolve, reject) => {
    const peerDir = `${conf.tmpPath}/ipfs${count}`
    const peerSpecificConf = goConfigs[count]
    const peerConf = Object.assign({}, defaultConfigGo, peerSpecificConf)
    rimraf.sync(peerDir)
    fs.mkdirSync(peerDir, { recursive: true })
    await initRepo(peerDir)
    fs.writeFileSync(`${peerDir}/config`, JSON.stringify(peerConf))
    let peer = spawn('ipfs', ['daemon'], { env: Object.assign(process.env, { IPFS_PATH: peerDir }) })
    peer.version = function () { return '1' }
    peer.stdout.on('data', (data) => {
      let version = {}
      if (data.includes('go-ipfs version:')) {
        const stdArray = data.toString('utf8').split('\n')
        for (let item of stdArray) {
          if (item.includes('go-ipfs version:')) {
            version.version = item.split(':')[1].trim()
          }
          if (item.includes('Repo version:')) {
            version.repo = item.split(':')[1].trim()
          }
        }
        peer.version = function () {
          return version
        }
      }
      if (data.includes('Daemon is ready')) resolve(peer)
    })
    peer.stderr.on('data', (data) => {
      console.error(`${data}`)
      return reject(Error(data))
    })
    peer.on('close', (code, signal) => {
      console.error('Daemon is stopped')
    })
  })
}

module.exports = {
  CreateNodeJs,
  CreateGo,
  CreateBrowser
}
