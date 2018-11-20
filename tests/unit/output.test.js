#!/usr/bin/env node
'use strict'

const t = require('tap')
const { validate } = require('../lib/output')
const { resultModel } = require('../schema/results')
const test = t.test

console.log(resultModel())
test('validate - results ', t => {
  t.plan(2)
  try {
    const e = validate(resultModel())
    console.log(e)
    t.equal(e, true)
    t.pass()
  } catch (e) {
    console.log(e)
    t.fail()
  }
})