'use strict'

const Influx = require('influx')
const moment = require('moment')
const _ = require('lodash')
const config = require('./config')

const influx = new Influx.InfluxDB({
  host: config.influxdb.host,
  database: config.influxdb.db,
  schema: config.influxdb.schema
})

const parseDuration = (objDuration) => {
  let ms = ((objDuration.seconds * 1000) + objDuration.milliseconds)
  return parseFloat(ms)
}

const writePoints = (data) => {
  if (!_.isArray(data)) {
    data = [data]
  }
  let payload = []
  _.each(data, (point) => {
    payload.push({
      measurement: point.name,
      tags: { commit: point.meta.commit, project: point.meta.project, testClass: point.testClass },
      fields: { duration: parseDuration(point.duration) },
      timestamp: moment(point.date).toDate()
    })
  })
  config.log.info(payload)
  return influx.writePoints(payload)
}

const ensureDb = async (db) => {
  let names = await influx.getDatabaseNames()
  if (!names.includes(db)) {
    return influx.createDatabase(db)
  } else {
    return influx
  }
}

const store = async (result) => {
  try {
    await ensureDb('benchmarks')
    await writePoints(result)
  } catch (err) {
    config.log.error(err)
  }
  return true
}

module.exports = {
  store: store
}
