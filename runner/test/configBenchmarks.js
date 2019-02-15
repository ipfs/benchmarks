'use srict'

const tap = require('tap')
const configBenchmarks = require('../lib/configBenchmarks')

tap.test('construct a single test', async (t) => {
  let benchmarks = configBenchmarks.constructTests(
    'remote',
    false,
    ['unixFsAddBrowser_balanced']
  )
  tap.equal(benchmarks[0].name, 'unixFsAddBrowser_balanced', 'check test name')
  tap.equal(benchmarks.length, 1, 'should be 1 test')
  tap.contains(benchmarks[0].benchmark, 'local-add.browser.js', 'check test file')
  t.end()
})

tap.test('construct a 2 tests', async (t) => {
  let benchmarks = configBenchmarks.constructTests(
    'remote',
    false,
    ['unixFsAddBrowser_balanced', 'addMultiKbBrowser_balanced']
  )
  tap.equal(benchmarks[0].name, 'unixFsAddBrowser_balanced', 'check first test name')
  tap.equal(benchmarks[1].name, 'addMultiKbBrowser_balanced', 'check second test name')
  tap.equal(benchmarks.length, 2, 'should be 2 tests')
  t.end()
})

tap.test('construct a 1 non-existing and 1 existing test', async (t) => {
  let benchmarks = configBenchmarks.constructTests(
    'remote',
    false,
    ['blahblah', 'addMultiKbBrowser_balanced']
  )
  tap.equal(benchmarks[0].name, 'addMultiKbBrowser_balanced', 'check first and only test name')
  tap.equal(benchmarks.length, 1, 'should be 1 tests')
  t.end()
})

tap.test('non existent testname', async (t) => {
  let benchmarks = configBenchmarks.constructTests(
    'remote',
    false,
    ['blablah']
  )
  tap.equal(benchmarks.length, 0, 'there should be no test')
  t.end()
})

tap.test('default tests', async (t) => {
  let benchmarks = configBenchmarks.constructTests(
    'remote',
    false
  )
  tap.equal(benchmarks.length, configBenchmarks.testAbstracts.length, 'compare # constructed to # abstracts')
  t.end()
})

tap.test('construct a single test with clinic', async (t) => {
  let benchmarks = configBenchmarks.constructTests(
    'remote',
    true,
    ['unixFsAddBrowser_balanced']
  )
  tap.equal(benchmarks[0].name, 'unixFsAddBrowser_balanced', 'check test name')
  tap.equal(benchmarks.length, 1, 'should be 1 test')
  tap.equal(typeof benchmarks[0]['doctor'] === 'undefined', false, 'contains doctor property')
  tap.equal(typeof benchmarks[0]['flame'] === 'undefined', false, 'contains flame property')
  tap.equal(typeof benchmarks[0]['bubbleProf'] === 'undefined', false, 'contains bubbleProf property')
  tap.equal(typeof benchmarks[0]['blahblah'] === 'undefined', true, 'does not contain blahblah property')
  t.end()
})
