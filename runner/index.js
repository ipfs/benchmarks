'use strict'
require('make-promises-safe') // installs an 'unhandledRejection' handler
const schedule = require('node-schedule')
const fastify = require('fastify')({
  logger: true
})
const config = require('./config')
const remote = require('./remote.js')
const local = require('./local.js')
const provision = require('./provision')
const persistence = require('./persistence')
const schema = require('./schema')
const baseUrl = 'https://some.url.com'

const runCommand = (test) => {
  if (config.stage === 'local') {
    return local.run(test.localShell, test.name)
  } else {
    return remote.run(test.shell, test.name)
  }
}

const run = async () => {
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

// run this every day at midnight, at least
schedule.scheduleJob('0 0 * * *', function () {
  run()
})

// Declare a route
fastify.post('/', { schema }, async (request, reply) => {
  let resultsHash = await run(request.body.commit)
  return {
    commit: request.body.commit,
    url: `${baseUrl}/${resultsHash}`
  }
})

// Run the server!
const start = async () => {
  try {
    await fastify.listen(9000)
    fastify.log.info(`server listening on ${fastify.server.address().port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
