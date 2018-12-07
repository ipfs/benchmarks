'use strict'

const { generateFiles, verifyTestFiles } = require('../lib/fixtures')

async function verifyAndCreateFiles () {
  const valid = await verifyTestFiles()
  if (!valid) {
    console.log('Some files missing.  Generating files')
    await generateFiles()
  } else {
    console.log('Files Verified')
  }
}
verifyAndCreateFiles()

