'use strict'

const { generateFiles, verifyTestFiles } = require('../lib/fixtures')

const verifyAndCreateFiles = async () => {
  const valid = await verifyTestFiles()
  if (!valid) {
    console.log('Some files missing.  Generating files')
    await generateFiles()
  } else {
    console.log('Files Verified')
  }
}
module.exports = verifyAndCreateFiles
