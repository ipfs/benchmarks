'use strict'

const { build } = require('./schema/results')
const run = require('./lib/runner')

const promiseRetry = require('promise-retry')

async function pubsubMessage (node, name, warmup, fileSet, version) {
  const topic = 'ipfs-benchmark'
  const peerA = node[0]
  const peerB = node[1]

  // connect peers
  const peerAId = await peerA.id()
  const peerBId = await peerB.id()

  await peerB.swarm.connect(peerAId.addresses[0])

  return new Promise((resolve, reject) => {
    const start = process.hrtime()

    // Subscribe topic
    peerB.pubsub.subscribe(topic, () => {
      const end = process.hrtime(start)
      resolve(build({
        name: name,
        warmup: warmup,
        file: 'none',
        meta: { version: version },
        description: 'Pubsub publish & receive a message',
        file_set: 'none',
        duration: {
          s: end[0],
          ms: end[1] / 1000000
        }
      }))
    })

    // wait for peerA to know about peerB subscription
    let peers
    promiseRetry(async (retry, number) => {
      peers = await peerA.pubsub.peers(topic)
      if (peers.length && peers.includes(peerBId.id)) {
        return Promise.resolve()
      } else {
        retry()
      }
    }).then(() => {
      // Publish
      return peerA.pubsub.publish(topic, Buffer.from('data'))
    }).catch((err) => reject(err))
  })
}

run(pubsubMessage, 2, 'nodejs', { EXPERIMENTAL: {
  pubsub: true
} })
