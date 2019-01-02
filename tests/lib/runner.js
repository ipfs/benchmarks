'use strict'
const NodeFactory = require('./node-factory')
const config = require('../config')
const clean = require('./clean')
const { store } = require('./output')
const genTests = require('../util/create-files')

async function runner (test, nodeCount = 1, type = 'nodejs') {
  if (!config.verify) {
    await genTests()
  }
  const arrResults = []
  const nodeFactory = new NodeFactory()
  const node = []
  for (let i = 0; i < nodeCount; i++) {
    node.push(await nodeFactory.add(type))
  }
  const version = await node[0].version()
  try {
    for (let subTest of config.test[test.name]) {
      for (let fileSet of subTest.fileSet) {
        if (config.fileSetParam && fileSet.toLowerCase() === config.fileSetParam) {
          arrResults.push(await test(node, test.name, subTest.warmup.toLowerCase(), fileSet, version))
        } else if (!config.fileSetParam) {
          arrResults.push(await test(node, test.name, subTest.warmup.toLowerCase(), fileSet, version))
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
    console.log(err)
    console.log(err.message)
    process.exit(1)
  }
  store(arrResults)
  await nodeFactory.stop(type)
  clean.peerRepos()
}
module.exports = runner
