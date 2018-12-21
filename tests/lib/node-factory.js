'use strict'

const { CreateNodeJs, CreateGo, CreateHttp, CreateBrowser } = require(`./create-node`)
const IPFS = process.env.REMOTE === 'true' ? require('../../../js-ipfs') : require('ipfs')

class NodeFactory {
  constructor (ipfs) {
    this._ipfs = typeof ipfs !== 'undefined' ? ipfs : IPFS
    this._nodes = []
  }

  async add (type, config, init) {
    console.log(type)
    if (type === 'go') {
      const node = await this.addGo(config, init)
      return node
    }
    if (type === 'nodejs') {
      const node = await this.addNodeJs(config, init)
      return node
    }
    if (type === 'http') {
      const node = await this.addHttp(config, init)
      return node
    }
    if (type === 'browser') {
      const node = await this.addBrowser(config, init)
      return node
    }
  }
  async addGo (config, init) {
    const node = await CreateGo(config, init, this._ipfs, this._nodes.length)
    this._nodes.push(node)
    return node
  }
  async addNodeJs (config, init) {
    const node = await CreateNodeJs(config, init, this._ipfs, this._nodes.length)
    this._nodes.push(node)
    return node
  }
  async addHttp (config, init) {
    const node = await CreateHttp(config, init, this._ipfs, this._nodes.length)
    this._nodes.push(node)
    return node
  }
  async addBrowser (config, init) {
    const node = await CreateBrowser(config, init, this._ipfs, this._nodes.length)
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
      case 'http':
        await this.stopHttp()
        break
      case 'browser':
        await this.stopBrowser()
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
  async stopHttp () {
    for (let node of this._nodes) {
      try {
        await node.stop()
      } catch (e) {
        console.log(`Error stopping node: ${e}`)
      }
    }
    this._nodes.length = null
  }
  async stopBrowser () {
    for (let node of this._nodes) {
      try {
        await node.browser.close()
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
