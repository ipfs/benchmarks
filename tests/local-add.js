#!/usr/bin/env node
'use strict'

const fs = require('fs')
const ora = require('ora')
const os = require('os')
const ipfsNode = require('../lib/create-node.js')


async function localAdd(node, name, file) {

  try {
    const fileStream = fs.createReadStream(file)

    const start = process.hrtime();
    const inserted = await node.files.add(fileStream)
    const end = process.hrtime(start);
    return (
      {
        name: name,
        file: file,
        date: new Date().toISOString(),
        s: end[0],
        ms: end[1] / 1000000,
        cpu: os.cpus(),
        loadAvg: os.loadavg(),
        memory: os.totalmem() - os.freemem()
      }
    )
  }
  catch (err) {
    throw Error(err)
  }

}
const results = []

// mock scenerios until the other one is working.
async function scenarios() {

  const spinner = ora(`Started `).start()
  spinner.color = 'magenta'
  spinner.text = "Starting unixFS:extract:smallfile Benchamrk"
  try {
    const node = await ipfsNode()
    results.push(await localAdd(node, "unixFS:add:smallfile:emptyRepo", "./fixtures/200Bytes.txt"))
    const node1 = await ipfsNode({
      "Addresses": {
        "API": "/ip4/127.0.0.1/tcp/5013",
        "Gateway": "/ip4/127.0.0.1/tcp/9092",
        "Swarm": [
          "/ip4/0.0.0.0/tcp/4013",
          "/ip4/127.0.0.1/tcp/4015/ws"
        ]
      },
      "Bootstrap": []
    })
    spinner.text = "Starting unixFS:extract:largefile Benchamrk"
    const r = await localAdd(node1, "unixFS:add:largefile:emptyRepo", "./fixtures/1.2MiB.txt")
    results.push(r)


    results.push(await localAdd(node1, "unixFS:add:smallfile", "./fixtures/200Bytes.txt"))


    results.push(await localAdd(node, "unixFS:add:largefile", "./fixtures/1.2MiB.txt"))


    console.log(JSON.stringify(results))

    node.stop()
    node1.stop()
    spinner.succeed()
  }
  catch (err) {
    spinner.fail()
    throw Error(err)

  }
}


scenarios()

module.exports = localAdd