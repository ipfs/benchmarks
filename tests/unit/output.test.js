#!/usr/bin/env node
'use strict'

const t = require('tap')
const { validate, createFilename, write } = require('../lib/output')
const { resultModel, generateModel } = require('../schema/results')
const test = t.test

test('validate - results ', t => {
  t.plan(2)
  try {
    const e = validate(resultModel())
    t.equal(e, true)
    t.pass()
  } catch (e) {
    console.log(e)
    t.fail()
  }
})

test('validate - create filename ', t => {
  t.plan(1)
  try {
    const e = createFilename(resultModel())
    console.log(e)
    t.pass()
  } catch (e) {
    console.log(e)
    t.fail()
  }
})

test('validate - write flename ', t => {
  t.plan(1)
  try {
    const e = write(resultModel())
    console.log(e)
    t.pass()
  } catch (e) {
    console.log(e)
    t.fail()
  }
})

test('validate - generate model ', t => {
  t.plan(1)
  try {
    const e = generateModel()
    console.log(e)
    t.pass()
  } catch (e) {
    console.log(e)
    t.fail()
  }
})
