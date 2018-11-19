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
  return new Promise((resolve, reject) => {
    config.log.info('Creating a hash over the [../tests] folder:')
    hashElement(dir, options)
      .then(hash => {
        resolve(hash.hash)
      })
      .catch(error => {
        return config.log.error('hashing failed:', error)
      })
  })
}

const writeHash = (hash, dir) => {
  return new Promise((resolve, reject) => {
    let hashPath = path.join(dir, hashFile)
    fs.writeFile(hashPath, hash, (err) => {
      if (err) {
        reject(err)
        return
      }
      resolve({ success: true, file: path })
    })
  })
}

const checkHash = async (hashPath) => {
  let hash = await remote.run(`cat ${hashPath}`)
  return hash
}

const ensure = async () => {
  try {
    let hash = await dirHash(config.benchmarks.path)
    await writeHash(hash, config.benchmarks.path)
    let remotehash = await checkHash(path.join(config.benchmarks.remotePath, hashFile))
    if (remotehash !== hash) {
      config.log.info(`Tests on ${config.benchmarks.host} are out of sync, updating...`)
      let ansible = await local.run(config.provison.command)
      config.log.info(ansible)
    } else {
      config.log.info(`Tests on ${config.benchmarks.host} are up to date.`)
    }
  } catch (e) {
    config.log.error(e)
  }
}

module.exports = {
  dirHash: dirHash,
  ensure: ensure,
  writeHash: writeHash
}
