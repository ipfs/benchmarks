'use strict'

const { generateFiles, verifyTestFiles } = require('../lib/fixtures')

/**
 * This utlilty will verify or create files needed for the tests.
 * The config is at ../lib/fixtures.file
 *
 * @async
 * @function verifyAndCreateFiles
 */
const verifyAndCreateFiles = async () => {
  const valid = await verifyTestFiles()
  if (!valid) {
    console.log('Some files missing.  Generating files')
    await generateFiles()
  } else {
    console.log('Files Verified')
  }
}
if (require.main === module) {
  verifyAndCreateFiles()
}
module.exports = verifyAndCreateFiles
