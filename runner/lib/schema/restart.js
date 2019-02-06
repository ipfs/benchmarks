'use strict'

const restartResponse = {
  $id: 'restartResponse',
  200: {
    description: 'Succesful response',
    type: 'object',
    properties: {
      id: { type: 'integer' },
      restart: { type: 'boolean' }
    }
  }
}

module.exports = {
  restartResponse
}
