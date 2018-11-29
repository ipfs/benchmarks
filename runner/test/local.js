'use srict'

const tap = require('tap')
const nockExec = require('nock-exec')
const config = require('../config')
const shell = 'shell-command'
const shellError = 'shell-error'
const name = 'test-name'
const nameError = 'error-name'
const retrieve = `cat ${config.outFolder}/${name}.json`
const retrieveError = `cat ${config.outFolder}/${nameError}.json`
const results = { duration: 1 }

nockExec(shell).err(null).reply(0, 'This command was mocked')
nockExec(shellError).err('shell error').reply(1, 'This command returns an error')
nockExec(retrieve).err().reply(0, JSON.stringify(results))
nockExec(retrieveError).err('retrieve error').reply(1, 'This command returns an error')
nockExec(retrieveError).err('retrieve error').reply(1, 'This command returns an error')

// the test subject
const runLocal = require('../local.js')

tap.test('run local: successful', async (t) => {
  const out = await runLocal.run(shell, name)
  tap.equal(out.duration, results.duration)
  t.end()
})

tap.rejects('run local: missing name', async (t) => {
  let e = await runLocal.run(shell)
  t.equals(e.message, 'shell+name required')
  t.end()
})

tap.rejects('run local: missing shell', async (t) => {
  let e = await runLocal.run(null, name)
  t.equals(e.message, 'shell+name required')
  t.end()
})

tap.rejects('shell error', async (t) => {
  let e = await runLocal.run(shellError, name)
  t.equals(e.message, 'some error')
  t.end()
})

tap.rejects('retrieve error', async (t) => {
  let e = await runLocal.run(shellError, name)
  t.equals(e.message, 'some error')
  t.end()
})
