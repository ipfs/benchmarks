'use strict'

require('make-promises-safe') // installs an 'unhandledRejection' handler
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

const main = async () => {
  if (config.stage !== 'local') {
    await provision.ensure()
  }
  for (let test of config.benchmarks.tests) {
    try {
      let result = await runCommand(test)
      // config.log.info(result)
      persistence.store(result)
    } catch (e) {
      config.log.error(e)
    }
  }
}

main()
