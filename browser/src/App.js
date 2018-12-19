import React, { Component } from 'react'
import './App.css'

import IPFS from 'ipfs'
import hrtime from 'browser-process-hrtime'
import { config } from '../package.json'
class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      id: null,
      version: null,
      protocol_version: null,
      added_file_hash: null,
      added_file_contents: null,
      time: null
    }
  }
  componentDidMount () {
    const self = this
    let node

    create()

    function create () {
      // Create the IPFS node instance

      node = new IPFS({ repo: String(Math.random() + Date.now()) })

      node.once('ready', () => {
        console.log('IPFS node is ready')
        ops()
      })
    }

    function ops () {
      node.id((err, res) => {
        if (err) {
          throw err
        }
        self.setState({
          id: res.id,
          version: res.agentVersion,
          protocol_version: res.protocolVersion
        })
      })
    }
  }
  render () {
    return <div style={{ textAlign: 'center' }}>
      <h1>IPFS Browser Benchmark</h1>
      <p>Your ID is <strong>{this.state.id}</strong></p>
      <p>Your IPFS version is <strong>{this.state.version}</strong></p>
      <p>Your IPFS protocol version is <strong>{this.state.protocol_version}</strong></p>
      <div>
        <div>
          Time <br />
          {this.state.time}
        </div>
        <div>
          Contents of this file: <br />
          {this.state.added_file_contents}
        </div>
      </div>
    </div>
  }
}

export default App
