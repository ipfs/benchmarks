'use strict'

const Rsync = require('rsync')
const fs = require('fs')

module.exports = (config, run, targetDir) => {
  const targetPath = `${targetDir}/${run.benchmarkName}/${run.operation}/${run.fileSet}`
  fs.mkdirSync(targetPath, { recursive: true })
  var rsync = new Rsync()
    .flags('avz')
    .shell(`ssh -i ${config.benchmarks.key}`)
    .source(`${config.benchmarks.user}@${config.benchmarks.host}:${config.outFolder}/${run.benchmarkName}/`)
    .destination(targetPath)
  config.log.info(`Retrieving the clinic files with [${rsync.command()}]`)
  return new Promise((resolve, reject) => {
    rsync.execute(function (error, code, cmd) {
      if (error) {
        reject(error)
      } else {
        config.log.info(code)
        config.log.info(cmd)
        resolve(targetPath)
      }
    })
  })
}
