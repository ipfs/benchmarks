'use strict'

const fs = require('fs')
const util = require('util')
const path = require('path')
const fsWriteFile = util.promisify(fs.writeFile)
const fsMakeDir = util.promisify(fs.mkdir)
const fsExists = util.promisify(fs.access)
const { validate } = require('../schema/results.js')
const Table = require('cli-table3')
const folder = process.env.OUT_FOLDER || path.join(__dirname, '/../out')

async function store (data) {
  if (Array.isArray(data)) {
    if (process.env.REMOTE === 'true') {
      console.log('Writing output in a single file')
      write(data)
    } else {
      console.log('Writing output in a multiple files')
      var table = new Table({
        head: ['Test', 'Sub Test', 'Description', 'Test Class', 'Duration'], colWidths: [20, 20, 50, 20]
      })
      for (let testResult of data) {
        table.push([testResult.name, testResult.subtest, testResult.description, testResult.testClass, `s:${testResult.duration.s} ms: ${testResult.duration.ms}`])
        write(testResult)
      }
      console.log(table.toString())
    }
  } else {
    throw Error('"store" requires an array')
  }
}

async function write (data) {
  const name = await createFilename(folder, data)
  if (validate(data)) {
    await fsWriteFile(`${name}.json`, JSON.stringify(data, null, 2))
  } else {
    const name = await createFilename(`${folder}/error`, data)
    await fsWriteFile(`${name}.json`, JSON.stringify(data, null, 2))
  }
}

const buildName = (data) => {
  if (process.env.REMOTE === 'true') {
    return `${folder}/${data[0].name || 'undefined'}`
  } else {
    return `${folder}/${data.name || 'undefined'}-${new Date().toISOString()}`
  }
}

async function createFilename (folder, data) {
  try {
    await fsExists(folder)
    return buildName(data)
  } catch (err) {
    try {
      await fsMakeDir(folder)
      return buildName(data)
    } catch (err) {
      return buildName(data)
    }
  }
}
module.exports = {
  createFilename,
  write,
  store
}
