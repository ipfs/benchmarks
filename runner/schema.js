'use strict'

const schema = {
  body: {
    type: 'object',
    properties: {
      commit: { type: 'string' }
    },
    required: ['commit']
  },

  headers: {
    type: 'object',
    properties: {
      'x-ipfs-benchmarks-api-key': { const: process.env.API_KEY || 'supersecret' }
    },
    required: ['x-ipfs-benchmarks-api-key']
  }
}

module.exports = schema
