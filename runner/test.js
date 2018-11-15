const remoteExec = require('ssh-exec-plus')

remoteExec('ls -lh', {
  user: 'elexy',
  host: 'operations.azure.nearform.net'
}).pipe((out) => {
  console.log(out)
})
