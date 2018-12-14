'use strict'

const createNode = require(`./create-node`)
const IPFS = process.env.REMOTE === 'true' ? require('../../js-ipfs') : require('ipfs')

class NodeFactory {
  constructor (ipfs) {
    this._ipfs = typeof ipfs !== 'undefined' ? ipfs : IPFS
    this._nodes = []
  }

  async add (config, init) {
    const node = await createNode(config, init, this._ipfs, this._nodes.length)
    this._nodes.push(node)
    return node
  }
  async stop () {
    for (let node of this._nodes) {
      try {
        await node.stop()
      } catch (e) {
        console.log(`Error stopping node: ${e}`)
      }
    }
    this._nodes.length = null
  }
  get () {
    return this._nodes
  }
}

module.exports = NodeFactory
