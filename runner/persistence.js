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
  // let durationString = `${objDuration.milliseconds}`
  let ms = ((objDuration.seconds * 1000) + objDuration.milliseconds)
  return parseFloat(ms)
}

const writePoints = (data) => {
  // console.log(data)
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
  return influx.writePoints(payload).catch(err => {
    console.error(`Error saving data to InfluxDB! ${err.stack}`)
  })
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
  await ensureDb('benchmarks')
  try {
    await writePoints(result)
  } catch (err) {
    console.error(err)
    console.error(`Error creating Influx database!`)
  }
}

module.exports = {
  store: store
}
