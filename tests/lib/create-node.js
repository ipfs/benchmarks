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
const { once } = require('stream-iterators-utils')


const initRepo = (path) => {
  return new Promise((resolve, reject) => {
    let init = spawn('ipfs', ['init'], { env: Object.assign(process.env, { IPFS_PATH: path }) })
    init.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`)
    })
    init.stderr.on('data', (errorData) => {
      console.error(`${errorData}`)
      //return reject(Error(errorData))
    })
    init.on('close', (code, signal) => {
      console.error('Repo iinitialized')
      resolve(init)
    })
  })
}

const CreateNodeJs = async (config, init, IPFS, count) => {
  const node = new IPFS({
    repo: `${repoPath}${Math.random()
      .toString()
      .substring(2, 8)}`,
    config: config || defaultConfig[count],
    init: init || { privateKey: privateKey[count].privKey }
  })
  node.on('ready', () => {
    console.log('Node ready')
  })
  node.on('error', (err) => {
    console.error(`${err}`)
  })
  node.on('stop', () => {
    console.log('Node stopped')
  })
  await once(node, 'ready')
  return node
}

const CreateBrowser = async (config, init, IPFS, count) => {
  let client
  const factory = IPFSFactory.create()
  const spawn = util.promisify(factory.spawn).bind(factory)
  const _ipfsd = await spawn({ initOptions: { bits: 1024 } })
  client = ipfsClient(_ipfsd.apiAddr)
  return client
}

const CreateGo = async (config, init, IPFS, count) => {
  // TODO remove promise use 
  return new Promise(async (resolve, reject) => {
    const peerDir = `${conf.tmpPath}/ipfs${count}`
    const peerSpecificConf = goConfigs[count]
    const peerConf = Object.assign({}, defaultConfigGo, peerSpecificConf)
    // todo make this async
    rimraf.sync(peerDir)
    // todo make this async
    fs.mkdirSync(peerDir, { recursive: true })
    await initRepo(peerDir)
    // TODO make this async
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
