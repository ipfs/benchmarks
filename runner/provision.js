'use strict'

const path = require('path')
const config = require('./config')
const { hashElement } = require('folder-hash')
const local = require('./local')
const remote = require('./remote')
const fs = require('fs')
const hashFile = '/dirHash.txt'

const options = {
  folders: { include: ['.*'] },
  files: { include: ['*.js', '*.json'] }
}

const dirHash = (dir) => {
  config.log.info('Creating a hash over the [../tests] folder:')
  return hashElement(dir, options)
}

const writeHash = (hash, dir) => {
  let hashPath = path.join(dir, hashFile)
  try {
    fs.writeFileSync(hashPath, hash.hash)
    config.log.info(`Written local hash: [${hash.hash}]`)
  } catch (e) {
    throw Error(e)
  }
}

const checkHash = async (hashPath) => {
  try {
    let hash = await remote.run(`cat ${hashPath}`)
    config.log.info(`Remote hash is: [${hash}]`)
    return hash
  } catch (e) {
    config.log.error(e)
    throw Error(e)
  }
}

const cloneIpfsRemote = async (commit) => {
  try {
    let out = await remote.run(`
      cd ${config.ipfs.path} && \
      git clone https://github.com/ipfs/js-ipfs.git 2> /dev/null || (cd js-ipfs; git checkout master; git pull) && \
      cd js-ipfs && \
      git checkout ${commit} && \
      ${config.nodePre} && \
      npm install
    `)
    config.log.info(out)
    return
  } catch (e) {
    config.log.error(e)
    throw Error(e)
  }
}

const ensure = async (commit) => {
  try {
    let hash = await dirHash(config.benchmarks.path)
    await writeHash(hash, config.benchmarks.path)
    let remotehash = await checkHash(path.join(config.benchmarks.remotePath, hashFile))
    if (remotehash !== hash.hash) {
      config.log.info(`Tests on ${config.benchmarks.host} are out of sync, updating...`)
      let ansible = await local.run(config.provison.command)
      config.log.info(ansible)
    } else {
      config.log.info(`Tests on ${config.benchmarks.host} are up to date.`)
    }
    // provision required commit of ipfs
    await cloneIpfsRemote(commit)
  } catch (e) {
    throw Error(e)
  }
}

module.exports = {
  dirHash: dirHash,
  ensure: ensure,
  writeHash: writeHash
}
