#!/usr/bin/env node
'use strict'

const Ajv = require('ajv')
const { FluentSchema } = require('fluent-schema')

const schema = FluentSchema()
  .id('ipfs')
  .title('IPFS Benchmarks')
  .description('IFPS benchmark results')
  .prop(
    'name',
    FluentSchema()
      .asString()
      .default('Benchmark Test Name'))
  .required()
  .prop(
    'description',
    FluentSchema()
      .asString()
      .default('Description of test'))
  .prop(
    'testClass',
    FluentSchema()
      .asString()
      .enum(['smallfile', 'largefile'])
      .default('smallfile')
  )
  .prop(
    'date',
    FluentSchema()
      .asString()
      .format('date')
      .default(new Date().toISOString())
  )
  .required()
  .definition(
    'duration',
    FluentSchema()
      .prop('s', FluentSchema()
        .default(0))
      .required()
      .prop('ms', FluentSchema()
        .default(0))
    // .required()
  )
  .prop('duration')
  .ref('#definitions/duration')
  .definition(
    'meta',
    FluentSchema()
      .prop('project', FluentSchema()
        .default('js-ipfs'))
      .prop('commit')
      .prop('version')
    // .required()
  )
  .prop('meta', FluentSchema()
    .default('js-ipfs'))
  .ref('#definitions/meta')

const model = {
  name: 'test name',
  description: 'Description of benchamrk',
  testClass: 'smallfile or largefile',
  date: new Date().toISOString(),
  file: 'file name',
  meta: {
    project: 'js-ipfs',
    commit: 'TBD',
    version: 'version of js-ifps'
  },
  duration: {
    seconds: 0,
    milliseconds: 1 / 1000000
  },
  cpu: 'cpu',
  loadAvg: 'load average',
  memory: 'memory'
}

function resultModel () {
  let user = {}
  const ajv = new Ajv({ useDefaults: true })
  const validate = ajv.compile(schema.valueOf())
  validate(user)
  return user
}

module.exports = { schema, resultModel }
