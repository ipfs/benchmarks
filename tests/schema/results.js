'use strict'

const Ajv = require('ajv')
const ajv = new Ajv({ useDefaults: true })
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
    'subtest',
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
  )
  .prop('meta', FluentSchema()
    .default('js-ipfs'))
  .ref('#definitions/meta')

// TODO: use this until we get AJV to generate all defaults
const resultsDTO = {
  'name': 'test name',
  'subtest': 'sub test',
  'description': 'Description of benchamrk',
  'testClass': 'smallfile or largefile',
  'date': 'date',
  'file': 'file name',
  'meta': {
    'project': 'js-ipfs',
    'commit': 'TBD',
    'version': 'version of js-ifps'
  },
  'duration': {
    'seconds': 0,
    'milliseconds': 0
  },
  'cpu': 'cpu',
  'loadAvg': 'load average',
  'memory': 'memory'
}
function build (props) {
  return { ...resultsDTO, ...props }
}
module.exports = { schema, resultsDTO, build }
