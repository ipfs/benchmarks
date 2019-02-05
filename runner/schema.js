'use strict'

const config = require('./config')

const headers = {
  $id: 'protect',
  type: 'object',
  properties: {
    'x-ipfs-benchmarks-api-key': { const: config.server.apikey }
  },
  required: ['x-ipfs-benchmarks-api-key']
}

const addBody = {
  $id: 'addBody',
  type: 'object',
  properties: {
    commit: { type: 'string' },
    benchmarks: {
      type: 'object',
      properties: {
        tests: { type: 'array' }
      }
    },
    clinic: {
      type: 'object',
      properties: {
        enabled: { type: 'boolean', default: false },
        tests: { type: 'array' }
      }
    }
  },
  required: ['commit']
}

module.exports = {
  addBody,
  headers
}
