#!/usr/bin/env node
'use strict'

const fs = require('fs')
const prettyHrtime = require('pretty-hrtime')
const node = require('../lib/create-node.js')


const ora = require('ora')
const handler = "local extract"

function localExtract(logger) {
  return new Promise(async (resolve) => {
    const spinner = ora(`Started ${handler}`).start()
    spinner.color = 'magenta'
    spinner.text = "testing"
    const node1 = await node
    const fileStream = fs.createReadStream("tests/fixtures/200Bytes.txt")
    const inserted = await node1.files.add(fileStream)
    logger.info('inserted:', inserted)
    const validCID = inserted[0].hash
    const files = await node1.files.get(validCID)

    files.forEach((file) => {
      logger.info(file.path)

    })
    await spinner.succeed()
    await node1.stop()
    resolve()
  })

}

module.exports = localExtract