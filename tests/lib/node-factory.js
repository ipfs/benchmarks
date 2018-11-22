'use strict'

const createNode = require(`./create-node`)
const IPFS = require('ipfs')

function NodeFactory () {
  if (!(this instanceof NodeFactory)) {
    return new NodeFactory()
  }

  const nodes = []

  this.createIPFS = async (config, ipfsModule) => {
    ipfsModule = typeof ipfsModule !== 'undefined' ? ipfsModule : IPFS
    const node = await createNode(config, ipfsModule)
    nodes.push(node)
    return node
  }
  this.stopIPFS = () => {
    nodes.forEach((node) => {
      node.stop()
    })
  }
  this.getIPFS = (node) => {
    return node[nodes]
  }
}

module.exports = NodeFactory
