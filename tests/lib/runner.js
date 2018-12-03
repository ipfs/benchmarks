'use strict'
const NodeFactory = require('./node-factory')
const config = require('../config')
const clean = require('./clean')
const { store } = require('./output')
const testClassParam = process.env.TESTCLASS || false
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
    for (let testClass of subTest.testClass) {
      if (testClassParam && testClass === testClassParam) {
        arrResults.push(await test(node, test.name, subTest.subTest, testClass))
      } else if (!testClassParam) {
        try{
          console.log(`${test.name} ${subTest.subTest} ${testClass}`)
        arrResults.push(await test(node, test.name, subTest.subTest, testClass))
        } catch(e){
          console.log(e)
        }
      }
    }
  }
  store(arrResults)
  nodeFactory.stop()
  clean.peerRepos()
}
module.exports = runner
