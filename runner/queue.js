'use strict'

const levelup = require('levelup')
const leveldown = require('leveldown')
const Jobs = require('level-jobs')
const config = require('./config')
const db = levelup(leveldown(`${config.dataDir}/${config.db}`))
const run = require('./runner')

let queueStatus = {}

const getStatus = (params) => {
  let retVal = {}
  if (params.id) {
    if (queueStatus[params.id]) {
      retVal = Object.assign({}, queueStatus[params.id])
    } else {
      if (params.work) {
        retVal = {
          jobId: params.id,
          work: params.work
        }
      }
    }
    if (queueStatus[params.id]) {
      switch (params.status) {
        case 'pending':
          if (queueStatus[params.id].status !== 'pending') {
            retVal.status = 'pending'
            retVal.queued = new Date().toString()
          }
          break
        case 'started':
          if (queueStatus[params.id].status !== 'started') {
            retVal.status = 'started'
            retVal.started = new Date().toString()
          }
          break
        case 'error':
          if (queueStatus[params.id].status !== 'error') {
            retVal.status = 'error'
            retVal.queued = new Date().toString()
          }
          break
      }
    } else {
      retVal.status = 'pending'
      retVal.queued = new Date().toString()
    }
  }
  return retVal
}

const handler = async (id, params, cb) => {
  config.log.info('Started job id: %s, work: %j', id, params)
  queueStatus[id] = getStatus({ id: id, status: 'started' })
  try {
    if (params.restart) {
      // exit process, relying on process manager to restart
      config.log.info('Exiting, for restart.')
      cb()
      process.exit(0)
    } else {
      await run(params)
      config.log.info('Finished job id: %s, work: %j', id, params)
      if (queueStatus[id]) {
        delete queueStatus[id]
      }
      cb()
    }
  } catch (e) {
    config.log.error(e)
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
      queueStatus[d.key] = getStatus({
        id: d.key,
        status: 'pending',
        work: d.value
      })
      config.log.info('Next job id: %s, work: %j', d.key, d.value)
    })
    this.q.runningStream().on('data', function (d) {
      queueStatus[d.key] = getStatus({
        id: d.key,
        status: 'pending',
        work: d.value
      })
      config.log.info('Pending job id: %s, work: %j', d.key, d.value)
    })
  }

  add (params) {
    let task = Object.assign({}, params)
    let jobId = this.q.push(params, function (err) {
      if (err) config.log.error('Error pushing work into the queue', err.stack)
    })
    queueStatus[jobId] = getStatus({
      status: 'pending',
      id: `${jobId}`,
      work: params
    })
    task.id = jobId
    config.log.info(`Added job with [${JSON.stringify(task)}] to the queue`)
    return task
  }

  async drain () {
    return new Promise((resolve, reject) => {
      if (Object.values(queueStatus)) {
        let taskIds = []
        for (let task of Object.values(queueStatus)) {
          if (task.status !== 'started') {
            taskIds.push(task.jobId)
            delete queueStatus[task.jobId]
          }
        }
        this.q.delBatch(taskIds, (err) => {
          if (err) {
            config.log.error('Error deleting jobs', err.stack)
            reject(Error('Error deleting jobs'))
          } else {
            resolve(queueStatus)
          }
        })
      }
    })
  }

  getStatus (q) {
    return queueStatus
  }
}

module.exports = q
