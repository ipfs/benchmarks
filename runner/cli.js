'user strict'

const argv = require('yargs').argv
const runner = require('./runner')

if (argv.commit) {
  runner(argv.commit)
} else {
  runner()
}
