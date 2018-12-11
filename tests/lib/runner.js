'use strict'
const NodeFactory = require('./node-factory')
const config = require('../config')
const clean = require('./clean')
const { store } = require('./output')

const fileSetParam = (process.env.FILESET && process.env.FILESET.toLowerCase()) || false
const warmup = (process.env.WARMUP && process.env.WARMUP.toLowerCase()) || false
const verify = process.env.VERIFYOFF && process.env.VERIFYOFF.toLowerCase() === 'true'
const genTests = require('../util/create-files')

async function runner (test, nodeCount = 1) {
  if (!verify) {
    await genTests()
  }
  const arrResults = []
  const nodeFactory = new NodeFactory()
  const node = []
  for (let i = 0; i < nodeCount; i++) {
    node.push(await nodeFactory.add())
  }
  const version = await node[0].version()
  try {
    for (let subTest of config[test.name]) {
      if (warmup && subTest.warmup.toLowerCase() === warmup) {
        for (let fileSet of subTest.fileSet) {
          if (fileSetParam && fileSet.toLowerCase() === fileSetParam) {
            arrResults.push(await test(node, test.name, subTest.warmup, fileSet, version))
          } else if (!fileSetParam) {
            arrResults.push(await test(node, test.name, subTest.warmup, fileSet, version))
          }
        }
      } else if (!warmup) {
        for (let fileSet of subTest.fileSet) {
          if (fileSetParam && fileSet.toLowerCase() === fileSetParam) {
            arrResults.push(await test(node, test.name, subTest.warmup, fileSet, version))
          } else if (!fileSetParam) {
            arrResults.push(await test(node, test.name, subTest.warmup, fileSet, version))
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
