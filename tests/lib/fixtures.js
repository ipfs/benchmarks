'use strict'

const path = require('path')

module.exports = {
  smallFile: path.join(__dirname, '../fixtures/200Bytes.txt'),
  largeFile: path.join(__dirname, '../fixtures/1.2MiB.txt')
}
