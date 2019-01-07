'use strict'
require('make-promises-safe') // installs an 'unhandledRejection' handler
const schedule = require('node-schedule')
const fastify = require('fastify')({
  logger: true
})
const schema = require('./schema')
const config = require('./config')
const Queue = require('./queue')
const queue = new Queue()

// run this every day at midnight, at least
schedule.scheduleJob('0 0 * * *', function () {
  queue.add({
    commit: '',
    doctor: true,
    remote: true
  })
})

// Declare a route
fastify.post('/', { schema }, async (request, reply) => {
  let task = queue.add({
    commit: request.body.commit,
    doctor: request.body.doctor,
    remote: true
  })
  return task
})

fastify.get('/', async (request, reply) => {
  let status = queue.getStatus()
  fastify.log.info('getting queue status', status)
  return status
})

// we do wat to be able to drain the queue
fastify.post('/drain', async (request, reply) => {
  return queue.drain()
})

// after CD deployed new code we queue a restart of the runner
fastify.post('/restart', async (request, reply) => {
  let task = queue.add({
    restart: true
  })
  return task
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
