'use strict'

const fs = require('fs')
const util = require('util')
const fsWriteFile = util.promisify(fs.writeFile)
const fsMakeDir = util.promisify(fs.mkdir)
const fsExists = util.promisify(fs.access)
const Ajv = require('ajv')
const schema = require('../schema/results.js')

const folder = 'out'
async function write (data) {
  const name = await createFilename(data)

  if (validate(data)) {
    await fsWriteFile(`${name}.json`, JSON.stringify(data))
    console.log(data)
  }
}

async function createFilename (data) {
  try {
    await fsExists(folder)
    return `${folder}/${data.name}-${new Date().toISOString()}`
  } catch (err) {
    try {
      await fsMakeDir(folder)
      return `${folder}/${data.name}-${new Date().toISOString()}`
    } catch (err) {
      return `${folder}/${data.name}-${new Date().toISOString()}`
    }
  }
}

function validate (data) {
  const ajv = new Ajv({ useDefaults: true })
  const validate = ajv.compile(schema.valueOf())
  return validate(data)
}

module.exports = { validate, createFilename, write }
