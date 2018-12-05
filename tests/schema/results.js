'use strict'

const { FluentSchema } = require('fluent-schema')
const os = require('os')
const Ajv = require('ajv')
const ajv = new Ajv({ allErrors: true, useDefaults: true, removeAdditional: true })
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
    'subTest',
    FluentSchema()
      .asString()
      .default('sub test name'))
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
  .prop('meta', FluentSchema()
    .default('js-ipfs'))
  .ref('#definitions/meta')

// TODO: use this until we get AJV to generate all defaults
const resultsDTO = {
  'name': 'test name',
  'subTest': 'sub test',
  'description': 'Description of benchamrk',
  'testClass': 'smallfile',
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
function build (props) {
  const results = { ...resultsDTO, ...props }
  results.cpu = os.cpus()
  results.loadAvg = os.loadavg()
  results.memory = os.totalmem() - os.freemem()
  results.date = new Date().toISOString()
  return results
}

function validate (data) {
  const valid = ajv.validate(schema.valueOf(), data)
  return valid
}

module.exports = { schema, resultsDTO, build, validate }
