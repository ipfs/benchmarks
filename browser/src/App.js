import React, { Component } from 'react'
import './App.css'

import ipfsClient from 'ipfs-http-client'
import IPFSFactory from 'ipfsd-ctl'
import hrtime from 'browser-process-hrtime'

const client = () => {
  let client
  client = ipfsClient('localhost', '5001')
  return client
}
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
    const start = hrtime()
    const ipfs = client()
    const delta = hrtime(start)
    this.setState({ time: delta })
    ipfs.id((err, res) => {
      if (err) throw err
      this.setState({
        id: res.id,
        version: res.agentVersion,
        protocol_version: res.protocolVersion
      })
    })
  }
  render () {
    return <div style={{ textAlign: 'center' }}>
      <h1>Benchmark for IPFS browser</h1>
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
