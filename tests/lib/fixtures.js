'use strict'

const path = require('path')

module.exports = {
  smallfile: path.join(__dirname, '../fixtures/200Bytes.txt'),
  largefile: path.join(__dirname, '../fixtures/1.2MiB.txt')
}
