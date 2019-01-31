'use strict'
require('make-promises-safe') // installs an 'unhandledRejection' handler
const schedule = require('node-schedule')
const fastify = require('fastify')({
  logger: true
})
const schema = require('./schema')
const config = require('./config')
const runner = require('./runner')
const Queue = require('./queue')

// This function exits the main process, relying on process manager to restart
// so that a new version of the runner can be applied on next startup
const stopFn = (cb) => {
  config.log.info('Exiting for restart.')
  cb()
  fastify.close(() => {
    process.exit(0)
  })
}

const queue = new Queue(stopFn, runner)

// run this every day at midnight, at least
schedule.scheduleJob('0 0 * * *', function () {
  queue.add({
    commit: '',
    clinic: true,
    remote: true
  })
})

fastify.addSchema(schema.addBody)
fastify.addSchema(schema.headers)

// add a new task to the queue
fastify.route({
  method: 'POST',
  url: '/',
  schema: {
    body: 'addBody#',
    headers: 'protect#'
  },
  handler: async (request, reply) => {
    let task = queue.add({
      commit: request.body.commit,
      clinic: request.body.clinic,
      remote: true
    })
    return task
  }
})

// list tasks
fastify.route({
  method: 'GET',
  url: '/',
  handler: async (request, reply) => {
    let status = queue.getStatus()
    fastify.log.info('getting queue status', status)
    return status
  }
})

// we do want to be able to drain the queue
fastify.route({
  method: 'POST',
  url: '/drain',
  schema: {
    headers: 'protect#'
  },
  handler: async (request, reply) => {
    return queue.drain()
  }
})

// after CD deployed new code we queue a restart of the runner
fastify.route({
  method: 'POST',
  url: '/restart',
  schema: {
    headers: 'protect#'
  },
  handler: async (request, reply) => {
    let task = queue.add({
      restart: true
    })
    return task
  }
})

// Run the server!
const start = async () => {
  try {
    await fastify.listen(config.server.port, '0.0.0.0')
    fastify.server.timeout = 96000
    fastify.log.info(`server listening on ${fastify.server.address().port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
