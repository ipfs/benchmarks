'use strict'

const IPFS = require('ipfs')
const node = new IPFS()

node.on('ready', async () => {
  const version = await node.version()
  console.log('Version:', version.version)

  node.util.addFromFs('/tmp/out/localAdd/17157.clinic-doctor.html', { recursive: true, ignore: [] }, (err, result) => {
    if (err) { throw err }
    console.log(result)
  })
})
