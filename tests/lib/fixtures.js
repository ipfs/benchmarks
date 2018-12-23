'use strict'

const path = require('path')
const crypto = require('crypto')
const util = require('util')
const fs = require('fs')
const fsWriteFile = util.promisify(fs.writeFile)
const fsMakeDir = util.promisify(fs.mkdir)
const fsExists = util.promisify(fs.access)
const fsStat = util.promisify(fs.lstat)
const fsReadDir = util.promisify(fs.readdir)
const KB = 1024
const MB = KB * 1024
const GB = MB * 1024
const files = [
  { size: KB, name: 'OneKBFile' },
  { size: KB, name: 'Hundred1KBFile', count: 100 },
  { size: 62 * KB, name: 'One62KBFile' },
  { size: 64 * KB, name: 'One64KBFile' },
  { size: 512 * KB, name: 'One512KBFile' },
  { size: 768 * KB, name: 'One768KBFile' },
  { size: 1023 * KB, name: 'One1023KBFile' },
  { size: MB, name: 'OneMBFile' },
  { size: 4 * MB, name: 'One4MBFile' },
  { size: 8 * MB, name: 'One8MBFile' },
  { size: 64 * MB, name: 'One64MBFile' },
  { size: 128 * MB, name: 'One128MBFile' },
  { size: 512 * MB, name: 'One512MBFile' },
  { size: GB, name: 'OneGBFile' }

]
async function generateFiles () {
  const testPath = path.join(__dirname, `../fixtures/`)
  for (let file of files) {
    if (file.count) {
      try {
        await fsExists(`${testPath}${file.name}`)
      } catch (err) {
        await fsMakeDir(`${testPath}${file.name}`)
      }
      for (let i = 0; i < file.count; i++) {
        write(crypto.randomBytes(file.size), `${file.name}/${file.name}-${i}`)
      }
    } else {
      write(crypto.randomBytes(file.size), file.name)
    }
  }
}

async function write (data, name, folder) {
  await fsWriteFile(path.join(__dirname, `../fixtures/${name}.txt`), data)
  console.log(`File ${name} created.`)
}
async function file (name) {
  const isDir = await isDirectory(name)
  if (!isDir) {
    const file = files.find((file) => {
      return file.name === name
    })
    if (typeof file !== 'undefined' && file) {
      return path.join(__dirname, `../fixtures/${file.name}.txt`)
    } else {
      if (name.includes(`/`)) {
        return path.join(__dirname, `../fixtures/${name}`)
      } else {
        return file
      }
    }
  } else {
    const arr = await fsReadDir(path.join(__dirname, `../fixtures/${name}`))

    return arr
  }
}

async function isDirectory (name) {
  try {
    const dir = path.join(__dirname, `../fixtures/${name}`)
    const stats = await fsStat(dir)
    return stats.isDirectory()
  } catch (e) {
    return false
  }
}

async function verifyTestFiles () {
  const fixtures = path.join(__dirname, `../fixtures`)
  try {
    await fsExists(fixtures)
  } catch (e) {
    await fsMakeDir(fixtures)
  }
  for (let f of files) {
    if (f.count) {
      console.log(`Verifying Directory ${f.name}`)
      const dir = await isDirectory(f.name)
      if (dir) {
        const fileArr = file(f.name)
        if (fileArr.length < f.count) {
          console.log(`Missing files in directory ${f.name}`)
          return false
        }
      } else {
        console.log(`Missing directory ${f.name}`)
        return false
      }
    } else {
      const filePath = await file(f.name)
      try {
        console.log(`Verifying File ${f.name}`)
        await fsExists(filePath)
      } catch (err) {
        console.log('Missing ${f.name')
        return false
      }
    }
  }
  return true
}

module.exports = { generateFiles, file, isDirectory, verifyTestFiles }
