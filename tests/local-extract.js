#!/usr/bin/env node
'use strict'

const fs = require('fs')
async function localExtract(node, name, file) {

  const fileStream = fs.createReadStream(file)
  const inserted = await node.files.add(fileStream)
  const start = process.hrtime();
  const validCID = inserted[0].hash
  const files = await node.files.get(validCID)
  const end = process.hrtime(start);
  const d = new Date()
  return (
    {
      name: name,
      file: file,
      date: d.toISOString(),
      s: end[0],
      ms: end[1] / 1000000
    }
  )

}

module.exports = localExtract