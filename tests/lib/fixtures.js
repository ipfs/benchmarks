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
  { size: KB, name: 'onekbfile' },
  { size: KB, name: 'hundred1kbfile', count: 100 },
  { size: 62 * KB, name: 'one62kbfile' },
  { size: 64 * KB, name: 'one64kbfile' },
  { size: 512 * KB, name: 'one512kbfile' },
  { size: 768 * KB, name: 'one768kbfile' },
  { size: 1023 * KB, name: 'one1023kbfile' },
  { size: MB, name: 'onembfile' },
  { size: 4 * MB, name: 'one4mbfile' },
  { size: 8 * MB, name: 'one8mbfile' },
  { size: 64 * MB, name: 'one64mbfile' },
  { size: 128 * MB, name: 'one128mbfile' },
  { size: 512 * MB, name: 'one512mbfile' },
  { size: GB, name: 'onegbfile' }

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
  const isDir = await isDirectory(name.toLowerCase())
  if (!isDir) {
    const file = files.find((file) => {
      return file.name === name.toLowerCase()
    })
    if (typeof file !== 'undefined' && file) {
      return path.join(__dirname, `../fixtures/${file.name}.txt`)
    } else {
      if (name.includes(`/`)) {
        return path.join(__dirname, `../fixtures/${name.toLowerCase()}`)
      } else {
        return file
      }
    }
  } else {
    const arr = await fsReadDir(path.join(__dirname, `../fixtures/${name.toLowerCase()}`))

    return arr
  }
}

async function isDirectory (name) {
  try {
    const dir = path.join(__dirname, `../fixtures/${name.toLowerCase()}`)
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
        console.log(`Missing ${f.name}`)
        return false
      }
    }
  }
  return true
}

module.exports = { generateFiles, file, isDirectory, verifyTestFiles }
