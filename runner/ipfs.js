'use strict'

const _ = require('lodash')
const config = require('./config')
const local = require('./local')
const fs = require('fs')
const util = require('util')
const fsStat = util.promisify(fs.stat)

const store = (localpath) => {
  return new Promise(async (resolve, reject) => {
    if (config.ipfs.network.password) {
      try {
        await fsStat(localpath)
        const shellCommand = `ipfs-cluster-ctl --host ${config.ipfs.network.address} --enc json --basic-auth ${config.ipfs.network.user}:${config.ipfs.network.password} add -r ${localpath}`
        config.log.debug(shellCommand)
        resolve(await local.run(shellCommand))
      } catch (e) {
        reject(e)
      }
    } else {
      reject(Error('Env var IPFS_PASSWORD not set! Upload failed'))
    }
  })
}

const parse = (outString, name) => {
  config.log.info(`Return sha for: ${name}`)
  name = String(name)
  let retVal = ''
  var parts = outString.match(/({\n.*\n.*\n.*\n})/g)
  config.log.debug(parts)
  let almostJson = parts.join(',')
  config.log.debug(almostJson)
  let arrOut = JSON.parse(`[${almostJson}]`)
  config.log.debug(arrOut)
  retVal = _.find(arrOut, { name: name }).cid
  return retVal
}

module.exports = {
  store,
  parse
}
