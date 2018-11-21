'use strict'

const fs = require('fs')
const os = require('os')
const ipfsNode = require('./lib/create-node')
const { build } = require('./schema/results')
const { store } = require('./lib/output')
const fixtures = require('./lib/fixtures')
const clean = require('./lib/clean')

const testName = 'unixFS'

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
      date: new Date().toISOString(),
      description: 'Add file to local repo using unixFS engine',
      testClass: testClass,
      duration: {
        s: end[0],
        ms: end[1] / 1000000
      },
      cpu: os.cpus(),
      loadAvg: os.loadavg(),
      memory: os.totalmem() - os.freemem()
    })
  } catch (err) {
    throw Error(err)
  }
}

async function scenarios () {
  try {
    const node = await ipfsNode()
    let arrResults = []
    arrResults.push(await localAdd(node, testName, 'add-empty-repo', 'largefile'))
    const node1 = await ipfsNode({
      'Addresses': {
        'API': '/ip4/127.0.0.1/tcp/5013',
        'Gateway': '/ip4/127.0.0.1/tcp/9092',
        'Swarm': [
          '/ip4/0.0.0.0/tcp/4013',
          '/ip4/127.0.0.1/tcp/4015/ws'
        ]
      },
      'Bootstrap': []
    })

    arrResults.push(await localAdd(node1, testName, 'add-empty-repo', 'smallfile'))

    arrResults.push(await localAdd(node1, testName, 'add-populated-repo', 'smallfile'))

    arrResults.push(await localAdd(node, testName, 'add-populated-repo', 'largefile'))

    store(arrResults)

    node.stop()
    node1.stop()
    clean.peerRepos()
  } catch (err) {
    throw Error(err)
  }
}

scenarios()

module.exports = localAdd
