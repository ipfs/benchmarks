#!/usr/bin/env node
'use strict'

const fs = require('fs')
const prettyHrtime = require('pretty-hrtime')
const node = require('../lib/create-node.js')


const ora = require('ora')
const handler = "local extract"

function localExtract(logger, name, file) {
  return new Promise(async (resolve) => {
    const spinner = ora(`Started ${handler}`).start()
    spinner.color = 'magenta'
    spinner.text = "testing"
    const node1 = await node
    const fileStream = fs.createReadStream(file)
    const inserted = await node1.files.add(fileStream)
    const start = process.hrtime();
    const validCID = inserted[0].hash
    const files = await node1.files.get(validCID)
    const end = process.hrtime(start);
    files.forEach((file) => {
      logger.info(file.path)

    })
    await spinner.succeed()
    // await node1.stop()
    const d = new Date()
    resolve(
      {
        name: name,
        file: file,
        date: d.toISOString(),
        s: end[0],
        ms: end[1] / 1000000
      }
    )
  })

}

module.exports = localExtract