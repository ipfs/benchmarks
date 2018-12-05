'use strict'

const config = require('./config')
const remote = require('./remote.js')
const local = require('./local.js')
const provision = require('./provision')
const persistence = require('./persistence')

const runCommand = (test) => {
  if (config.stage === 'local') {
    return local.run(test.localShell, test.name)
  } else {
    return remote.run(test.shell, test.name)
  }
}

const run = async (commit) => {
  if (config.stage !== 'local') {
    try {
      await provision.ensure(commit)
    } catch (e) {
      config.log.error(e)
    }
  }
  for (let test of config.benchmarks.tests) {
    try {
      let result = await runCommand(test)
      persistence.store(result)
    } catch (e) {
      config.log.error(e)
    }
  }
}

module.exports = run
