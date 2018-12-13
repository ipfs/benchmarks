'use strict'

const Rsync = require('rsync')

// Build the command
var rsync = new Rsync()
  // .shell('ssh')
  .flags('avz')
  .shell(`ssh -i ${process.env.HOME}/.ssh/id_rsa`)
  .source('elexy@operations.azure.nearform.net:/tmp/out/localAdd')
  .destination('~/tmp')

// Execute the command
rsync.execute(function (error, code, cmd) {
  if (error) console.log(error)
  console.log(code)
  console.log(cmd)
})
