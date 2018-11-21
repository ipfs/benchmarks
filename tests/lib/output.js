'use strict'

const fs = require('fs')
const util = require('util')
const fsWriteFile = util.promisify(fs.writeFile)
const fsMakeDir = util.promisify(fs.mkdir)
const fsExists = util.promisify(fs.access)
const Ajv = require('ajv')
const { schema } = require('../schema/results.js')
const ajv = new Ajv({ allErrors: true, useDefaults: true, removeAdditional: true })

const folder = process.env.OUT_FOLDER || 'out'

async function write (data) {
  const name = await createFilename(folder, data)
  if (validate(data)) {
    await fsWriteFile(`${name}.json`, JSON.stringify(data))
  } else {
    const name = await createFilename(`${folder}/error`, data)
    await fsWriteFile(`${name}.json`, JSON.stringify(data))
  }
}

async function createFilename (folder, data) {
  try {
    await fsExists(folder)
    return `${folder}/${data.name || 'undefined'}-${new Date().toISOString()}`
  } catch (err) {
    try {
      await fsMakeDir(folder)
      return `${folder}/${data.name || 'undefined'}-${new Date().toISOString()}`
    } catch (err) {
      return `${folder}/${data.name || 'undefined'}-${new Date().toISOString()}`
    }
  }
}

function validate (data) {
  const valid = ajv.validate(schema.valueOf(), data)
  return valid
}

module.exports = { validate, createFilename, write }
