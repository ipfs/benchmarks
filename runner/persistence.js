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
  let durationString = `${objDuration.milliseconds / 1000000}`
  console.log(parseFloat(objDuration.seconds + durationString))
  return parseFloat(objDuration.seconds + durationString)
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
  console.log(payload)
  return influx.writePoints(payload).catch(err => {
    console.error(`Error saving data to InfluxDB! ${err.stack}`)
  })
}

const report = (test) => {
  influx.query(`
    select * from ${config.influxdb.db}..${test.measurement}
    order by time desc
    limit 10
  `).then(result => {
    console.log(JSON.stringify(result, null, 4))
  }).catch(err => {
    console.error(err.stack)
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
    await report(result)
  } catch (err) {
    console.error(err)
    console.error(`Error creating Influx database!`)
  }
}

module.exports = {
  store: store
}
