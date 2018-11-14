#!/usr/bin/env node
'use strict'

const fs = require('fs')
const prettyHrtime = require('pretty-hrtime')
const node = require('../lib/create-node.js')

const ora = require('ora')
const handler = "local extract"

async function localExtract() {
  const spinner = ora(`Started ${handler}`).start()
  spinner.color = 'magenta'
  spinner.text = "testing"
  const node1 = await node
  const fileStream = fs.createReadStream("tests/fixtures/200Bytes.txt")
  const inserted = await node1.files.add(fileStream)
  console.log('vmx: inserted:', inserted)
  const validCID = inserted[0].hash
  node1.files.get(validCID, function (err, files) {
    files.forEach((file) => {
      console.log(file.path)
      spinner.succeed()
      node1.stop()
    })
  })

}

module.exports = localExtract