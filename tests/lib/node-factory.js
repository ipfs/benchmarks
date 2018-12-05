'use strict'

const createNode = require(`./create-node`)
const IPFS = process.env.STAGE === 'remote' ? require('../../../js-ipfs') : require('ipfs')

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
