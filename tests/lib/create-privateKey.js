'use strict'

const PeerId = require('peer-id')

PeerId.create({ bits: 1024 }, (err, id) => {
  if (err) { throw err }
  console.log(JSON.stringify(id.toJSON(), null, 2))
})
