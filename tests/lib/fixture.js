'use strict'

const path = require('path')

module.export = {
  smallFile: path.join(__dirname, './fixtures/200Bytes.txt'),
  largeFile: path.join(__dirname, './fixtures/1.2MiB.txt')
}
