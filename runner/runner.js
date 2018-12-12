'use strict'

const config = require('./config')
const remote = require('./remote.js')
const local = require('./local.js')
const provision = require('./provision')
const persistence = require('./persistence')

const runCommand = (command, name) => {
  if (config.stage === 'local') {
    return local.run(command, name)
  } else {
    return remote.run(command, name)
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
    // first run the benchmark straght up
    try {
      let result = await runCommand(test.benchmark, test.name)
      persistence.store(result)
    } catch (e) {
      config.log.error(e)
    }
    // then run it with each of the clinic tools
    try {
      let doctor = await runCommand(test.doctor)
      let flame = await runCommand(test.flame)
      let bubbleProf = await runCommand(test.bubbleProf)
    } catch (e) {
      config.log.error(e)
    }
  }
}

module.exports = run
