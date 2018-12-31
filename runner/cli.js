'user strict'

const argv = require('yargs').argv
const runner = require('./runner')
const config = require('./config')

const cli = async () => {
  if (argv.commit) {
    config.log.info(`Running benchmarks with IPFS@${argv.commit}`)
    await runner(argv.commit)
  } else {
    runner()
  }
}

cli()
