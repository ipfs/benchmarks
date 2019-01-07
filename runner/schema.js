'use strict'

const config = require('./config')

const schema = {
  body: {
    type: 'object',
    properties: {
      commit: { type: 'string' },
      doctor: { type: 'string', default: 'on' }
    },
    required: ['commit']
  },

  headers: {
    type: 'object',
    properties: {
      'x-ipfs-benchmarks-api-key': { const: config.server.apikey }
    },
    required: ['x-ipfs-benchmarks-api-key']
  }
}

module.exports = schema
