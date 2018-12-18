'use strict'

const { build } = require('./schema/results')
const run = require('./lib/runner')
const NodeFactory = require('./lib/node-factory')

async function initializeNode (node, name, warmup, fileSet, version) {
  const start = process.hrtime()
  const nodeFactory = new NodeFactory()
  await nodeFactory.add('nodejs', {
    'Addresses': {
      'API': '/ip4/127.0.0.1/tcp/6012',
      'Gateway': '/ip4/127.0.0.1/tcp/9191',
      'Swarm': [
        '/ip4/0.0.0.0/tcp/7012',
        '/ip4/127.0.0.1/tcp/3022/ws'
      ]
    },
    'Bootstrap': []
  }, { 'empty-repo': true })
  const end = process.hrtime(start)
  await nodeFactory.stop('nodejs')
  return build({
    name: name,
    wamrup: warmup,
    file: '',
    meta: { version: version },
    description: 'Initialize node without pre-generated key',
    file_set: '',
    duration: { s: end[0],
      ms: end[1] / 1000000 }
  })
}

run(initializeNode)
