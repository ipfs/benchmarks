const Influx = require('influx')
const http = require('http')
const os = require('os')
const { DateTime } = require("luxon")
const _ = require('lodash')
const db = 'benchmarks'
const measurement =  'local_transfer'

const influx = new Influx.InfluxDB({
  host: 'localhost',
  database: db,
  schema: [
    {
      measurement: measurement,
      fields: {
        filesize: Influx.FieldType.FLOAT,
        duration: Influx.FieldType.INTEGER
      },
      tags: [
        'commit',
        'project'
      ]
    }
  ]
})

const getRandom = () => {
  return parseFloat((Math.random() * (20.0200 - 5.100) + 0.0200).toFixed(2))
}

const data = [
  {
    project: 'js-ipfs',
    commit: '8g76fsd8',
    duration: getRandom(),
    fileSize: 10000,
    timestamp: DateTime.local().toJSDate()
  },{
    project: 'js-ipfs',
    commit: '87f6gsd',
    duration: getRandom(),
    fileSize: 10000,
    timestamp: DateTime.local().minus({ days: 1}).toJSDate()
  },{
    project: 'js-ipfs',
    commit: '98hgj7s',
    duration: getRandom(),
    fileSize: 10000,
    timestamp: DateTime.local().minus({ days: 2}).toJSDate()
  }
]

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

const report = () => {
  influx.query(`
    select * from ${db}..${measurement}
    order by time desc
    limit 10
  `).then(result => {
    console.log(JSON.stringify(result, null, 4))
  }).catch(err => {
    console.error(err.stack)
  })
}

influx.getDatabaseNames()
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