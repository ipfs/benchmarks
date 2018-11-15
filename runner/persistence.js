'use strict'

const Influx = require('influx')
const http = require('http')
const exec = require('ssh-exec')
const os = require('os')
const { DateTime } = require("luxon")
const _ = require('lodash')
const config = require('./config')

const influx = new Influx.InfluxDB({
  host: config.influxdb.host,
  database: config.influxdb.db,
  schems: config.influxdb.schema
})

const writePoints = (data) => {
  let payload = []
  _.each(data, (point) => {
    payload.push({
      measurement: measurement,
      tags: { commit: point.commit, project: point.project },
      fields: { duration: point.duration, filesize: point.fileSize },
      timestamp: point.timestamp
    })
  })
  console.log(payload)
  return influx.writePoints(payload).catch(err => {
    console.error(`Error saving data to InfluxDB! ${err.stack}`)
  })
}

// const report = (test) => {
//   influx.query(`
//     select * from ${config.influxdb.db}..${test.measurement}
//     order by time desc
//     limit 10
//   `).then(result => {
//     console.log(JSON.stringify(result, null, 4))
//   }).catch(err => {
//     console.error(err.stack)
//   })
// }

const influx.getDatabaseNames()
  .then(names => {
    if (!names.includes('benchmarks')) {
      return influx.createDatabase('benchmarks');
    }
  })
  .then(() => {

    writePoints(data). then( () => {report()})
  })
  .catch(err => {
    console.error(err);
    console.error(`Error creating Influx database!`);
  })

  module.exports = {

  }