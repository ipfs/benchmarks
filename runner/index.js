'use strict'
require('make-promises-safe') // installs an 'unhandledRejection' handler
const schedule = require('node-schedule')
const fastify = require('fastify')({
  logger: true
})
const schema = require('./schema')
const baseUrl = 'https://some.url.com'
const run = require('./runner')

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
    await fastify.listen(9000, '0.0.0.0')
    fastify.server.timeout = 96000
    fastify.log.info(`server listening on ${fastify.server.address().port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
