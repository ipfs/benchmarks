'use strict'

const createNode = require(`./create-node`)
const IPFS = process.env.REMOTE === 'true' ? require('../../js-ipfs') : require('ipfs')

class NodeFactory {
  constructor (ipfs) {
    this._ipfs = typeof ipfs !== 'undefined' ? ipfs : IPFS
    this._nodes = []
  }

  async add (type, config, init) {
    if (type === 'go') {
      const node = await this.addGo(config, init)
      return node
    }
    if (type === 'nodejs') {
      console.log("nodejs")
     const node = await this.addNodeJs(config, init)
     return node
    }
  }
  async addGo (config, init) {
    const node = await createNode(config, init, this._ipfs, this._nodes.length, 'go')
    this._nodes.push(node)
    return node
  }
  async addNodeJs (config, init) {
    const node = await createNode(config, init, this._ipfs, this._nodes.length)
    this._nodes.push(node)
    return node
  }
  async stop (type) {
    switch (type) {
      case 'nodejs':
        await this.stopNodeJs()
        break
      case 'go':
        await this.stopGo()
        break
    }
  }

  async stopNodeJs () {
    for (let node of this._nodes) {
      try {
        await node.stop()
      } catch (e) {
        console.log(`Error stopping node: ${e}`)
      }
    }
    this._nodes.length = null
  }
  async stopGo () {
    for (let node of this._nodes) {
      try {
        await node.kill('SIGTERM')
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
