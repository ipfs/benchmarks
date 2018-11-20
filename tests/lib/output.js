'use strict'

const fs = require('fs')
const Ajv = require('ajv')
const schema = require('../schema/results.js')

const folder = 'out'
async function write (data) {
  const name = createFilename(data)

  if (validate(data)) {
    try {
      fs.writeFileSync(`${name}.json`, JSON.stringify(data))
      console.log(data)
    } catch (e) {
      throw new Error(e)
    }
  }
}

function createFilename (data) {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder)
  }
  return `${folder}/${data.name}-${new Date().toISOString()}`
}

function validate (data) {
  const ajv = new Ajv({ useDefaults: true })
  const validate = ajv.compile(schema.valueOf())

  const valid = validate(data)
  if (valid.error) {
    throw new Error(valid)
  }
  return valid
}

module.exports = { validate, createFilename, write }
