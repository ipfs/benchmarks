'use strict'

const t = require('tap')
const { validate, createFilename, write } = require('../lib/output')
const { resultsDTO } = require('../schema/results')
const test = t.test

test('validate - results ', t => {
  t.plan(2)
  const e = validate(resultsDTO)
  t.equal(e, true)
  t.pass()
})

test('validate - create filename ', t => {
  t.plan(1)
  const e = createFilename(resultsDTO)
  console.log(e)
  t.pass()
})

test('validate - write flename ', t => {
  t.plan(1)
  const e = write(resultsDTO)
  console.log(e)
  t.pass()
})

test('validate - generate model ', t => {
  t.plan(1)
  const e = resultsDTO
  console.log(e)
  t.pass()
})
