'use strict'

const fs = require('fs')
const os = require('os')
const IPFS = require('ipfs')
const verbose = process.env.VERBOSE || false

const log = (msg) => {
  if (verbose) {
    console.log(msg)
  }
}

const peerAPromise = new Promise((resolve) => {
  const config = {
    "Addresses": {
      "API": "/ip4/127.0.0.1/tcp/5012",
      "Gateway": "/ip4/127.0.0.1/tcp/9091",
      "Swarm": [
        "/ip4/0.0.0.0/tcp/4012",
        "/ip4/127.0.0.1/tcp/4013/ws"
      ]
    },
    "Bootstrap": []
  }
  const peer = new IPFS({
    repo: '/tmp/peera',
    config: config,
    init: {
      emptyRepo: true
    }
  })
  peer.on('ready', () => {
    log('peerA ready')
    resolve(peer)
  })
})

const peerBPromise = new Promise((resolve) => {
  const config = {
    "Addresses": {
      "API": "/ip4/127.0.0.1/tcp/5022",
      "Gateway": "/ip4/127.0.0.1/tcp/9092",
      "Swarm": [
        "/ip4/0.0.0.0/tcp/4022",
        "/ip4/127.0.0.1/tcp/4023/ws"
      ]
    },
    "Bootstrap": []
  }
  const peer = new IPFS({
    repo: '/tmp/peerb',
    config: config,
    init: {
      emptyRepo: true
    }
  })
  peer.on('ready', () => {
    log('peerB ready')
    resolve(peer)
  })
})

const connectPeers = async (peerA, peerB) => {
  try {
    const peerAId = await peerA.id()
    return peerB.swarm.connect(peerAId.addresses[0])
  } catch (err) {
    error(err)
  }
}

const main = async () => {
  try {
    const peerA = await peerAPromise
    const peerB = await peerBPromise

    await connectPeers(peerA, peerB)
    log('vmx: connected')

    // Insert into peerA
    const fileStream = fs.createReadStream('/tmp/100m.bin')
    const inserted = await peerA.files.add(fileStream)
    log('vmx: inserted:', inserted)

    // peerB doesn't any data cached, get all from peerA
    const start = process.hrtime();
    await peerB.files.cat(inserted[0].hash)
    const end = process.hrtime(start);

    console.log('-*-*-*-*-*- BEGIN RESULTS -*-*-*-*-*-')
    console.log(JSON.stringify({
      name: 'LocalFs:local-transfer:smallfile',
      date: new Date().toISOString(),
      file: '/tmp/100m.bin',
      duration: {
        seconds: end[0],
        milliseconds: end[1] / 1000000
      },
      cpu: os.cpus(),
      loadAvg: os.loadavg()
    }))
    console.log('-*-*-*-*-*- END RESULTS -*-*-*-*-*-')

    peerA.stop()
    peerB.stop()
  } catch (err) {
    throw Error(err)
    process.exit(1)
  }
}

main()