'use strict'

const levelup = require('levelup')
const leveldown = require('leveldown')
const db = levelup(leveldown('./mydb'))
const Jobs = require('level-jobs')
const config = require('./config')
const run = require('./runner')

let queueStatus = {}

const getStatus = (params) => {
  let retVal = {}
  if (params.id) {
    if (queueStatus[params.id]) {
      retVal = Object.assign({}, queueStatus[params.id])
    } else {
      if (params.value) {
        retVal = {
          jobId: params.id,
          work: params.value
        }
      }
    }
    switch (params.status) {
      case 'queued':
        retVal.status = 'queued'
        retVal.queued = new Date().toString()
        break
      case 'started':
        retVal.status = 'started'
        retVal.started = new Date().toString()
        break
      case 'error':
        retVal.status = 'error'
        retVal.queued = new Date().toString()
        break
    }
  }
  console.log(retVal)
  return retVal
}

const handler = async (id, params, cb) => {
  config.log.info('Started job id: %s, work: %j', id, params)
  queueStatus[id] = getStatus({ id: id, status: 'started' })
  try {
    await run(params)
    config.log.info('Finished job id: %s, work: %j', id, params)
    if (queueStatus[id]) {
      delete queueStatus[id]
    }
    cb()
  } catch (e) {
    console.log(e)
    if (queueStatus[id]) {
      queueStatus[id] = getStatus({ id: id, status: 'error' })
    }
    cb(e)
  }
}
class q {
  constructor () {
    this.q = Jobs(db, handler, 1)
    this.q.pendingStream().on('data', function (d) {
      queueStatus[d.key] = getStatus({ id: d.key, status: 'pending' })
      config.log.info('Next job id: %s, work: %j', d.key, d.value)
    })
    this.q.runningStream().on('data', function (d) {
      queueStatus[d.key] = getStatus({ id: d.key, status: 'pending' })
      config.log.info('Pending job id: %s, work: %j', d.key, d.value)
    })
  }

  add (params) {
    let task = Object.assign({}, params)
    console.log(params)
    let jobId = this.q.push(params, function (err) {
      if (err) console.error('Error pushing work into the queue', err.stack)
    })
    queueStatus[jobId] = getStatus({
      status: 'pending',
      id: jobId,
      work: params
    })
    task.id = jobId
    config.log.info(`Added job with [${JSON.stringify(task)}] to the queue`)
    return task
  }

  getStatus (q) {
    return queueStatus
  }
}

module.exports = q
