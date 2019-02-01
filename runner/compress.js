'use strict'

const fs = require('fs')
const os = require('os')
const util = require('util')
const _ = require('lodash')
const rmfr = require('rmfr')
const mkDir = util.promisify(fs.mkdir)
const writeFile = util.promisify(fs.writeFile)
const stat = util.promisify(fs.stat)
const readDir = util.promisify(fs.readdir)
const compressing = require('compressing')
const config = require('./config')

const _tgzDir = async (source, target) => {
  if (source && target) {
    config.log.info(`Compressing [${source}] to [${target}]`)
    await compressing.tgz.compressDir(source, target)
    return { result: 'ok' }
  } else {
    config.log.error(`compress.tgz - Source [${source}] and Target [${target}] are required`)
  }
}

const clinicFiles = async (path) => {
  try {
    let contents = await readDir(path)
    // find the dir
    let clinicDir = _.find(contents, async (node) => {
      let stats = await stat(`${path}/${node}`)
      if (stats.isDirectory()) return node
    })
    if (clinicDir) {
      await _tgzDir(`${path}/${clinicDir}`, `${path}/${clinicDir}.tar.gz`)
      await rmfr(`${path}/${clinicDir}`)
    } else {
      config.log.error(`No clinic files found in ${path}`)
    }
  } catch (e) {
    config.log.error(e)
    return Error(`Error reading path: ${path}`)
  }
}

module.exports = {
  _tgzDir,
  clinicFiles
}
