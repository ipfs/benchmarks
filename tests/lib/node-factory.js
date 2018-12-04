'use strict'

const createNode = require(`./create-node`)
const IPFS = require('ipfs')
const REMOTE = process.env.REMOTE || false
const remoteIPFS = require('../../../js-ipfs')

class NodeFactory {
  constructor (ipfs) {
    this._ipfs = typeof ipfs !== 'undefined' ? ipfs : IPFS
    if (REMOTE) {
      this._ipfs = remoteIPFS
    }
    this._nodes = []
  }

  async add (config, init) {
    const node = await createNode(config, init, this._ipfs, this._nodes.length)
    this._nodes.push(node)
    return node
  }
  stop () {
    this._nodes.forEach(async (node) => {
      try {
        await node.stop()
      } catch (e) {
        console.log(`Error stopping node: ${e}`)
      }
    })
    this._nodes.length = 0
  }
  get () {
    return this._nodes
  }
}

module.exports = NodeFactory
