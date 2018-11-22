'use strict'

const t = require('tap')
const { validate, createFilename, write } = require('../lib/output')
const { resultsDTO, build } = require('../schema/results')
const test = t.test

test('validate - results ', t => {
  t.plan(2)
  const e = validate(resultsDTO)
  console.log(e)
  t.equal(e, true)
  t.pass()
})

test('validate - invalid results ', t => {
  t.plan(2)
  const valid = validate({ name: 0 })
  t.equal(valid, false)
  t.pass()
})

test('validate - create filename ', t => {
  t.plan(1)
  createFilename('out', resultsDTO)
  t.pass()
})

test('validate - create error dir filename ', t => {
  t.plan(1)
  createFilename('out/error', { invalidefile: 'yes' })
  t.pass()
})

test('validate - write flename ', t => {
  t.plan(1)
  write(resultsDTO)
  t.pass()
})

test('validate - write file to error directory ', t => {
  t.plan(1)
  write(build({ name:  0 }))
  t.pass()
})
