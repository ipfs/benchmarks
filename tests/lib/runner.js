'use strict'
const NodeFactory = require('./node-factory')
const config = require('../config')
const clean = require('./clean')
const { store } = require('./output')
const testClassParam = process.env.TESTCLASS || false
const subTestParam = process.env.SUBTEST || false
async function runner (test) {
  const arrResults = []
  const nodeFactory = new NodeFactory()
  const node = []
  node.push(await nodeFactory.add())
  node.push(await nodeFactory.add())
  node.push(await nodeFactory.add())
  node.push(await nodeFactory.add())
  node.push(await nodeFactory.add())
  for (let subTest of config[test.name]) {
    if (subTestParam && subTest.subTest === subTestParam) {
      for (let testClass of subTest.testClass) {
        if (testClassParam && testClass === testClassParam) {
          arrResults.push(await test(node, test.name, subTest.subTest, testClass))
        } else if (!testClassParam) {
          arrResults.push(await test(node, test.name, subTest.subTest, testClass))
        }
      }
    } else if (!subTestParam) {      
      for (let testClass of subTest.testClass) {
        if (testClassParam && testClass === testClassParam) {
          arrResults.push(await test(node, test.name, subTest.subTest, testClass))
        } else if (!testClassParam) {
          arrResults.push(await test(node, test.name, subTest.subTest, testClass))
        }
      }
    }
  }
  store(arrResults)
  nodeFactory.stop()
  clean.peerRepos()
}
module.exports = runner
