'use strict'

const levelup = require('levelup')
const leveldown = require('leveldown')
const Jobs = require('level-jobs')
const config = require('./config')

const getStatus = (queueStatus, params) => {
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

class q {
  constructor (stopFn, runner, database) {
    let that = this
    this.stopFn = stopFn
    this.queueStatus = {}
    let dbRef = database
    if (!database) {
      dbRef = levelup(leveldown(`${config.dataDir}/${config.db}`))
    }
    this.q = Jobs(dbRef, this._handler(runner), 1)
    this.q.pendingStream().on('data', function (d) {
      config.log.info(that.queueStatus)
      that.queueStatus[d.key] = getStatus(that.queueStatus, {
        id: d.key,
        status: 'pending',
        work: d.value
      })
      config.log.info('Next job id: %s, work: %j', d.key, d.value)
    })
    this.q.runningStream().on('data', function (d) {
      that.queueStatus[d.key] = getStatus(that.queueStatus, {
        id: d.key,
        status: 'pending',
        work: d.value
      })
      config.log.info('Pending job id: %s, work: %j', d.key, d.value)
    })
  }

  _handler (run) {
    let that = this
    return async (id, params, cb) => {
      config.log.info('Started job id: %s, work: %j', id, params)
      that.queueStatus[id] = getStatus(that.queueStatus, { id: id, status: 'started' })
      try {
        if (params.restart) {
          this.stopFn(cb)
        } else {
          await run(params)
          config.log.info('Finished job id: %s, work: %j', id, params)
          if (that.queueStatus[id]) {
            delete that.queueStatus[id]
          }
          cb()
        }
      } catch (e) {
        config.log.error(e)
        if (that.queueStatus[id]) {
          that.queueStatus[id] = getStatus(that.queueStatus, { id: id, status: 'error' })
        }
        cb(e)
      }
    }
  }

  add (params) {
    let task = Object.assign({}, params)
    let jobId = this.q.push(params, function (err) {
      if (err) config.log.error('Error pushing work into the queue', err.stack)
    })
    this.queueStatus[jobId] = getStatus(this.queueStatus, {
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
      if (Object.values(this.queueStatus)) {
        let taskIds = []
        for (let task of Object.values(this.queueStatus)) {
          if (task.status !== 'started') {
            taskIds.push(task.jobId)
            delete this.queueStatus[task.jobId]
          }
        }
        this.q.delBatch(taskIds, (err) => {
          if (err) {
            config.log.error('Error deleting jobs', err.stack)
            reject(Error('Error deleting jobs'))
          } else {
            resolve(this.queueStatus)
          }
        })
      }
    })
  }

  getStatus (q) {
    return this.queueStatus
  }
}

module.exports = q
