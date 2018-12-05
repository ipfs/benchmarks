'use strict'

const path = require('path')
const crypto = require('crypto')
const KB = 1024
const MB = KB * 1024
const GB = MB * 1024

/*
const sizes = [
  KB,
  62 * KB,
  64 * KB,
  512 * KB,
  768 * KB,
  1023 * KB,
  MB,
  4 * MB,
  8 * MB,
  64 * MB,
  128 * MB,
  512 * MB,
  GB,
  10 * GB,
  100 * GB,
  1000 * GB
]
*/

module.exports = {
  smallFile: path.join(__dirname, '../fixtures/200Bytes.txt'),
  largeFile: path.join(__dirname, '../fixtures/1.2MiB.txt'),
  OneKBFile: crypto.randomBytes(KB),
  OneMBFile: crypto.randomBytes(MB),
  OneGBFile: crypto.randomBytes(GB)

}
