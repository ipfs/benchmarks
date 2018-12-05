'user strict'

const argv = require('yargs').argv
const runner = require('./runner')
const config = require('./config')

if (argv.commit) {
  config.log.info(`Running benchmarks with IPFS@${argv.commit}`)
  runner(argv.commit)
} else {
  runner()
}
