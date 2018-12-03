'use strict'
const NodeFactory = require('./node-factory')
const config = require('../config')
const clean = require('./clean')
const { store } = require('./output')

async function runner (test) {
  const arrResults = []
  const nodeFactory = new NodeFactory()
  const node = []
  node.push(await nodeFactory.add())
  node.push(await nodeFactory.add())
  for (let subtest of config[test.name]) {
    for (let testClass of subtest.testClass) {
      arrResults.push(await test(node, test.name, subtest.subtest, testClass))
    }
  }
  store(arrResults)
  nodeFactory.stop()
  clean.peerRepos()
}
module.exports = runner
