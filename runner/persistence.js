'use strict'

const Influx = require('influx')
const moment = require('moment')
const config = require('./config')

const influx = new Influx.InfluxDB({
  host: config.influxdb.host,
  database: config.influxdb.db,
  schema: config.influxdb.schema
})

const parseDuration = (objDuration) => {
  let ms = ((objDuration.s * 1000) + objDuration.ms)
  return parseFloat(ms)
}

const writePoints = (data) => {
  if (!Array.isArray(data)) {
    data = [data]
  }
  let payload = []
  for (let point of data) {
    config.log.info('point: ', point)
    payload.push({
      measurement: point.name,
      tags: { warmup: point.warmup, commit: point.meta.version.commit || 'tbd', project: point.meta.project || 'tbd', file_set: point.file_set, version: point.meta.version.version || 'tbd', repo: point.meta.version.repo || 'tbd' },
      fields: { duration: parseDuration(point.duration) },
      timestamp: moment(point.date).toDate()
    })
  }
  config.log.debug(payload)
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
