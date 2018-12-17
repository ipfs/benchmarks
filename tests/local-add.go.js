'use strict'

const os = require('os')
const util = require('util')
const execute = util.promisify(util.promisify(require('child_process').exec))
const { file } = require('./lib/fixtures.js')
const { build } = require('./schema/results')
const run = require('./lib/runner')
const conf = { tmpPath: os.tmpdir() }

const unixFsAddGo = async (node, name, warmup, fileSet, version) => {
  const filePath = await file(fileSet)
  const start = process.hrtime()
  let command = `export IPFS_PATH=${conf.tmpPath}/ipfs1 && ipfs add ${filePath}`
  await execute(command)
  const end = process.hrtime(start)
  return build({
    name: name,
    warmup: warmup,
    file_set: fileSet,
    file: filePath,
    meta: { version: version, project: 'go-ipfs' },
    description: 'Add files to go node',
    duration: {
      s: end[0],
      ms: end[1] / 1000000
    }
  }, 'go')
}

run(unixFsAddGo, 1, 'go')
