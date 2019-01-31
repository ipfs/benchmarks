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
    clinic: { type: 'boolean', default: true }
  },
  required: ['commit']
}

module.exports = {
  addBody,
  headers
}
