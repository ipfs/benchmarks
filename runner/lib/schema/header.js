'use strict'

const config = require('../../config')

const headers = {
  $id: 'protect',
  type: 'object',
  properties: {
    'x-ipfs-benchmarks-api-key': {
      type: 'string',
      const: config.server.apikey
    }
  },
  required: ['x-ipfs-benchmarks-api-key']
}

module.exports = {
  headers
}
