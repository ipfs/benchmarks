'use strict'

const fs = require('fs')
const os = require('os')
const util = require('util')
const tap = require('tap')
const mkDir = util.promisify(fs.mkdir)
const writeFile = util.promisify(fs.writeFile)
const readDir = util.promisify(fs.readdir)
const stat = util.promisify(fs.stat)
const rmfr = require('rmfr')
const now = Date.now()
const clinicFile = '1234.clinic-bubbleprof'
const tmpDir = `${os.tmpdir()}/${now}-compress-test`
const dataDir = `${tmpDir}/${clinicFile}`
const compress = require('../compress')

const createTestFiles = async () => {
  await mkDir(tmpDir)
  await writeFile(`${tmpDir}/${clinicFile}.html`, '<body>clinic</body>')
  await mkDir(dataDir)
  await writeFile(`${dataDir}/1.txt`, '1')
  await writeFile(`${dataDir}/2.txt`, '2')
  await writeFile(`${dataDir}/3.txt`, '3')
  await writeFile(`${dataDir}/4.txt`, '4')
}

const cleanup = async () => {
  await rmfr(tmpDir)
}

tap.test('compress dir', async (t) => {
  await createTestFiles()
  await compress._tgzDir(tmpDir, `${tmpDir}/file.tar.gz`)
  const contents = await readDir(tmpDir)
  let found = false
  for (let node of contents) {
    if (node === 'file.tar.gz') found = true
  }
  tap.equal(found, true, 'found compressed file')
  await cleanup()
  t.done()
})

tap.test('compress clinic files', async (t) => {
  await createTestFiles()
  await compress.clinicFiles(tmpDir)
  try {
    await stat(`${tmpDir}/${clinicFile}`)
  } catch (e) {
    tap.match(e.message, 'no such file or directory')
  }
  let htmlStats = await stat(`${tmpDir}/${clinicFile}.html`)
  tap.type(htmlStats, 'object')
  let targzStats = await stat(`${tmpDir}/${clinicFile}.tar.gz`)
  tap.type(targzStats, 'object')
  await cleanup()
  t.done()
})

tap.test('silently fails if missing', async (t) => {
  await compress.clinicFiles(tmpDir)
  try {
    await stat(`${tmpDir}/${clinicFile}`)
  } catch (e) {
    tap.match(e.message, 'no such file or directory')
  }
  try {
    await stat(`${tmpDir}/${clinicFile}.html`)
  } catch (e) {
    tap.match(e.message, 'no such file or directory')
  }
  try {
    await stat(`${tmpDir}/${clinicFile}.tar.gz`)
  } catch (e) {
    tap.match(e.message, 'no such file or directory')
  }
  t.done()
})
