'use strict'

const addBody = {
  $id: 'addBody',
  type: 'object',
  properties: {
    commit: {
      type: 'string',
      description: 'Commit of the js-IPFS library'
    },
    benchmarks: {
      type: 'object',
      properties: {
        tests: {
          type: 'array',
          items: {
            type: 'string'
          },
          description: 'Names of benchmark tests to be run'
        }
      }
    },
    clinic: {
      type: 'object',
      properties: {
        enabled: { type: 'boolean', default: false },
        tests: {
          type: 'array',
          items: {
            type: 'string'
          }
        }
      }
    }
  },
  required: ['commit']
}

const addResponse = {
  $id: 'addResponse',
  200: {
    description: 'Succesful response',
    type: 'object',
    properties: {
      commit: { type: 'string' },
      clinic: {
        type: 'object',
        properties: {
          enabled: { type: 'boolean' }
        }
      },
      benchmarks: {
        type: 'object',
        properties: {
          tests: {
            type: 'array',
            items: { type: 'string' }
          }
        }
      },
      remote: { type: 'boolean' },
      nightly: { type: 'boolean' },
      id: { type: 'integer' }
    }
  }
}

module.exports = {
  addBody,
  addResponse
}
