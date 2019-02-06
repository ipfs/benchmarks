'use strict'

const clinicOperation = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      fileSet: { type: 'string' }
    }
  }
}
const benchmarkResponse = {
  $id: 'benchmarkResponse',
  200: {
    description: 'Succesful response',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        doctor: clinicOperation,
        flame: clinicOperation,
        bubbleProf: clinicOperation
      }
    }
  }
}

module.exports = {
  benchmarkResponse
}
