#!/usr/bin/env node
'use strict'

const fs = require('fs')
const Ajv = require('ajv')
const schema = require('../schema/results.js')

async function write(data) {



}

function validate(data) {
  const ajv = new Ajv({ useDefaults: true })
  const validate = ajv.compile(schema.valueOf())

  const valid = validate(data)
  if (valid.error) {
    throw new Error(valid)
  }
  return valid
}

module.exports = { validate }