#!/usr/bin/env node
'use strict'

const { FluentSchema } = require('fluent-schema')
const schema = FluentSchema()
  .id('ipfs')
  .title('IPFS Benchmarks')
  .description('IFPS benchmark results')
  .prop(
    'name',
    FluentSchema()
      .asString())
  .required()
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
  )
  .required()
  .definition(
    'duration',
    FluentSchema()
      .prop('s')
      .required()
      .prop('ms')
    // .required()
  )
  .prop('duration')
  .ref('#definitions/duration')
  .definition(
    'meta',
    FluentSchema()
      .prop('project')
      .default('js-ipfs')
      //  .required()
      .prop('commit')
      .prop('version')
    // .required()
  )
  .prop('meta')
  .ref('#definitions/meta')
console.log(JSON.stringify(schema.valueOf(), undefined, 2))
