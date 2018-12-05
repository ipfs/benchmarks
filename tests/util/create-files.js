'use strict'

const path = require('path')
const crypto = require('crypto')
const util = require('util')
const fs = require('fs')
const fsWriteFile = util.promisify(fs.writeFile)
const KB = 1024
const MB = KB * 1024
const GB = MB * 1024
const files = [
  { size: KB, name: 'KB' },
  { size: 62 * KB, name: '62KB' },
  { size: 64 * KB, name: '64KB' },
  { size: 512 * KB, name: '512KB' },
  { size: 768 * KB, name: '768KB' },
  { size: 1023 * KB, name: '1023KB' },
  { size: MB, name: 'MB' },
  { size: 4 * MB, name: '4MB' },
  { size: 8 * MB, name: '8MB' },
  { size: 64 * MB, name: '64MB' },
  { size: 128 * MB, name: '128MB' },
  { size: 512 * MB, name: '512MB' },
  { size: GB, name: 'GB' }
]

for (let file of files) {
  write(crypto.randomBytes(file.size), file.name)
}

async function write (data, name) {
  await fsWriteFile(path.join(__dirname, `../fixtures/${name}.txt`), data)
  console.log(`File ${name} created.`)
}
