'use strict'

const { FluentSchema } = require('fluent-schema')
const os = require('os')
const Ajv = require('ajv')
const config = require('../config')
const ajv = new Ajv({ allErrors: true, useDefaults: true, removeAdditional: true })
const { getIpfsCommit, getBranchName } = require('../util/get-commit')
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
    'warmup',
    FluentSchema()
      .asBoolean()
      .default(true))
  .required()
  .prop(
    'description',
    FluentSchema()
      .asString()
      .default('Description of test'))
  .prop(
    'file_set',
    FluentSchema()
      .asString()
      .default('OneKBFile')
  )
  .prop(
    'date',
    FluentSchema()
      .asString()
      .default(new Date().toISOString())
  )
  .required()
  .definition(
    'duration',
    FluentSchema()
      .prop('s', FluentSchema()
        .asInteger()
        .default(0))
      .required()
      .prop('ms', FluentSchema()
        .asNumber()
        .default(0))
      .required()
  )
  .prop('duration')
  .ref('#definitions/duration')
  .definition(
    'meta',
    FluentSchema()
      .prop('project', FluentSchema()
        .asString()
        .default('js-ipfs'))
      .prop('commit')
      .prop('version')
  )
  .prop('meta')
  .ref('#definitions/meta')

// TODO: use this until we get AJV to generate all defaults
const resultsDTO = {
  'name': 'test name',
  'warmup': true,
  'description': 'Description of benchmark',
  'file_set': 'OneKBFile',
  'date': 'date',
  'file': 'file name',
  'meta': {
    'project': 'js-ipfs',
    'commit': 'TBD',
    'version': 'version of js-ifps'
  },
  'duration': {
    's': 0,
    'ms': 0
  },
  'cpu': 'cpu',
  'loadAvg': 'load average',
  'memory': 'memory'
}
async function build (props) {
  const results = { ...resultsDTO, ...props }
  results.cpu = os.cpus()
  results.loadAvg = os.loadavg()
  results.memory = os.totalmem() - os.freemem()
  results.date = new Date()
  results.meta.project = 'js-ipfs'
  results.meta.commit = await getIpfsCommit()
  results.meta.branch = await getBranchName()
  results.meta.guid = config.guid
  return results
}

function validate (data) {
  const valid = ajv.validate(schema.valueOf(), data)
  return valid
}

module.exports = { schema, resultsDTO, build, validate }
