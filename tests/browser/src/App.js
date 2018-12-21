import React, { Component } from 'react'
import './App.css'

import IPFS from 'ipfs'
import hrtime from 'browser-process-hrtime'
import { config } from '../package.json'
import uuidv1 from 'uuid/v1'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      id: null,
      version: null,
      protocol_version: null,
      added_file_hash: null,
      added_file_contents: null,
      time_s: null,
      time_ms: null
    }
  }
  componentDidMount () {
    const self = this
    let node

    create()

    function create () {
      // Create the IPFS node instance
      const start = hrtime()


      node = new IPFS({ repo: String(uuidv1()) })

      node.once('ready', () => {
        const delta = hrtime(start)
        console.log('IPFS node is ready')
        console.log(delta)
        ops(delta)
      })
    }

    function ops (delta) {
      node.id((err, res) => {
        if (err) {
          throw err
        }
        self.setState({
          id: res.id,
          version: res.agentVersion,
          protocol_version: res.protocolVersion,
          time_s: delta[0],
          time_ms: delta[1]
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
          Time <span class='init-node-browser-time_s'>{this.state.time_s}</span>.<span class='init-node-browser-time_ms'>{this.state.time_ms}</span>
        </div>
      </div>
    </div>
  }
}

export default App
