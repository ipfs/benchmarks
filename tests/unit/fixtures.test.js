'use strict'

const t = require('tap')
const { file, isDirectory } = require('../lib/fixtures')
const test = t.test

test('Files - file does not exist ', async t => {
  t.plan(2)
  const filepath = await file('NoOneKBFile')
  t.equal(typeof filepath === 'undefined', true)
  t.pass()
})
test('Is not a Directory ', async t => {
  t.plan(2)
  const results = await isDirectory('OneKBFile')

  t.assert(!results)
  t.pass()
})

test('Is a Directory ', async t => {
  t.plan(2)
  const results = await isDirectory('Hundred1KBFile')

  t.assert(results)
  t.pass()
})