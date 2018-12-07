'use strict'
const NodeFactory = require('./node-factory')
const config = require('../config')
const clean = require('./clean')
const { store } = require('./output')
const fileSetParam = process.env.FILESET || false
const subTestParam = process.env.SUBTEST || false
async function runner (test, nodeCount = 1) {
  const arrResults = []
  const nodeFactory = new NodeFactory()
  const node = []
  for (let i = 0; i < nodeCount; i++) {
    node.push(await nodeFactory.add())
  }
  const version = await node[0].version()
  try {
    for (let subTest of config[test.name]) {
      if (subTestParam && subTest.subTest === subTestParam) {
        for (let fileSet of subTest.fileSet) {
          if (fileSetParam && fileSet === fileSetParam) {
            arrResults.push(await test(node, test.name, subTest.subTest, fileSet, version))
          } else if (!fileSetParam) {
            arrResults.push(await test(node, test.name, subTest.subTest, fileSet, version))
          }
        }
      } else if (!subTestParam) {
        for (let fileSet of subTest.fileSet) {
          if (fileSetParam && fileSet === fileSetParam) {
            arrResults.push(await test(node, test.name, subTest.subTest, fileSet, version))
          } else if (!fileSetParam) {
            arrResults.push(await test(node, test.name, subTest.subTest, fileSet, version))
          }
        }
      }
    }
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log('ERROR -- Run "npm run generateFiles" then run test again.')
      nodeFactory.stop()
      clean.peerRepos()
      process.exit(1)
    }
    console.log(err.message)
    process.exit(1)
  }
  store(arrResults)
  nodeFactory.stop()
  clean.peerRepos()
}
module.exports = runner
