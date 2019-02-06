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
const docs = {
  benchmarks: config.server.api.benchmarks,
  clinic: config.server.api.clinic
}
docs.benchmarks.txt = `Benchmarks run with their own set of files mandated by the type of test.`
docs.clinic.txt = `For clinic runs you can request to run wit a specific fileset.`

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
    remote: true,
    nightly: true
  })
})

fastify.register(require('fastify-swagger'), {
  routePrefix: '/docs',
  swagger: {
    info: {
      title: 'IPFS Runner API',
      description: 'Running benchmkarks for IPFS projects',
      version: '0.1.0'
    },
    host: 'localhost',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json']
  },
  exposeRoute: true
})

fastify.addSchema(schema.addBody)
fastify.addSchema(schema.headers)

// add a new task to the queue
fastify.route({
  method: 'POST',
  url: '/',
  schema: {
    description: 'Add a job run to the queue.',
    body: 'addBody#',
    headers: 'protect#',
    response: {
      201: {
        description: 'Succesful response',
        type: 'object',
        properties: {
          hello: { type: 'string' }
        }
      }
    }
  },
  handler: async (request, reply) => {
    let task = queue.add({
      commit: request.body.commit,
      clinic: request.body.clinic,
      benchmarks: request.body.benchmarks,
      remote: true,
      nightly: true
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

fastify.put('/some-route/:id', {
  schema: {
    description: 'post some data',
    tags: ['user', 'code'],
    summary: 'qwerty',
    params: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'user id'
        }
      }
    },
    body: {
      type: 'object',
      properties: {
        hello: { type: 'string' },
        obj: {
          type: 'object',
          properties: {
            some: { type: 'string' }
          }
        }
      }
    },
    response: {
      201: {
        description: 'Succesful response',
        type: 'object',
        properties: {
          hello: { type: 'string' }
        }
      }
    }
  }
}, (req, reply) => {})

// Run the server!
const start = async () => {
  try {
    await fastify.listen(config.server.port, '0.0.0.0')
    fastify.log.info(`server listening on ${fastify.server.address().port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
