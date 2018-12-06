'use strict'

const t = require('tap')
const { file } = require('../lib/fixtures')
const test = t.test

test('Files - generateFile ', t => {
  t.plan(1)
  const filepath = file('OneKBFile')
  console.log(filepath)
  t.pass()
})