'use strict'

const fs = require('fs')
const prettyHrtime = require('pretty-hrtime')
const IPFS = require('ipfs')

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
    console.log('peerA ready')
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
    console.log('peerB ready')
    resolve(peer)
  })
})

const connectPeers = async (peerA, peerB) => {
  try {
    const peerAId = await peerA.id()
    return peerB.swarm.connect(peerAId.addresses[0])
  } catch (err) {
    console.error(err)
  }
}

const main = async () => {
  try {
    const peerA = await peerAPromise
    const peerB = await peerBPromise

    await connectPeers(peerA, peerB)
    console.log('vmx: connected')

    // Insert into peerA
    const fileStream = fs.createReadStream('/tmp/100m.bin')
    const inserted = await peerA.files.add(fileStream)
    console.log('vmx: inserted:', inserted)

    // peerB doesn't any data cached, get all from peerA
    const start = process.hrtime();
    await peerB.files.cat(inserted[0].hash)
    const end = process.hrtime(start);
    console.log('It took:', prettyHrtime(end))

    peerA.stop()
    peerB.stop()
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

main()