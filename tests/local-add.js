'use strict'

const fs = require('fs')
const NodeFactory = require('./lib/node-factory')
const { build } = require('./schema/results')
const { store } = require('./lib/output')
const fixtures = require('./lib/fixtures')
const clean = require('./lib/clean')

const testName = 'unixFS-add'

async function localAdd (node, name, subtest, testClass) {
  try {
    const fileStream = fs.createReadStream(fixtures[testClass])
    const start = process.hrtime()
    await node.files.add(fileStream)
    const end = process.hrtime(start)
    return build({
      name: name,
      subtest: subtest,
      file: fixtures[testClass],
      description: 'Add file to local repo using unixFS engine',
      testClass: testClass,
      duration: {
        s: end[0],
        ms: end[1] / 1000000
      }
    })
  } catch (err) {
    throw Error(err)
  }
}

async function scenarios () {
  try {
    const nodeFactory = new NodeFactory()

    const node = await nodeFactory.add()
    let arrResults = []
    arrResults.push(await localAdd(node, testName, 'add-empty-repo', 'largefile'))
    const node1 = await nodeFactory.add()

    arrResults.push(await localAdd(node1, testName, 'empty-repo', 'smallfile'))

    arrResults.push(await localAdd(node1, testName, 'populated-repo', 'smallfile'))
    arrResults.push(await localAdd(node, testName, 'populated-repo', 'largefile'))

    store(arrResults)

    nodeFactory.stop()
    clean.peerRepos()

  } catch (err) {
    throw Error(err)
  }
}

scenarios()
module.exports = localAdd
