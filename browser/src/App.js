import React, { Component } from 'react'
import './App.css'

import IPFS  from 'ipfs'
import hrtime from 'browser-process-hrtime'
import { config } from '../package.json'
const client = (done) => {
  const node = new IPFS({
    repo: `${config.repoPath}${Math.random()
      .toString()
      .substring(2, 8)}`,
    config: {
      "Addresses": {
        "API": "/ip4/127.0.0.1/tcp/5012",
        "Gateway": "/ip4/127.0.0.1/tcp/9091",
        "Swarm": [
          "/ip4/0.0.0.0/tcp/4012",
          "/ip4/127.0.0.1/tcp/4022/ws"
        ]
      },
      "Bootstrap": []
    },
    init: { privateKey: 'CAAS4AQwggJcAgEAAoGBAJGwCGgBEgVxzx6URFoTCm7UJHwDG+LFzolu56k/njk1E96u7zRjGZ+ihvSSfh5Na0IewXtO+X4lpVT91OQrZtX/if1vu8Vb2MZ2eWQ2dOkMxjSGt6E6Y2U/MCIH6PEJH4XofQ8MTzt3VKmZtNLfjc461KjXWEZb9bjHEYi9GfvZAgMBAAECgYEAjcMH+wQHoCqlSvElLazXew6MzetMiDbIiazUWTlhYfNG+Wmps4U22sIQpg2iESRuWTGKPc2UMm65WWGBdeDRt7FJWoA+tyoI0y57Jl4ohQyi1158S6C5sHaTWO7gX3K7zox5xoQ+ow5hnTsxXVgHJfmZttNihUJcQWsuzhkjGIECQQDcXERw5Ehvx46YZXspplh6Y5IiY2TiNvxoHP/3H7IGuBDPJkur4ROK0j5qOZnLoALyQZnCDMJJ2gRW7l/WEpDxAkEAqUAJeiBCO68mhSuajlGZy9PHd56RudFNg2dz5shYeeDsQ6UenXS/D4IMAntgmw/8AcAR/TtDXyhpQ2eF9KUZaQJACe62vwfrI+6wxLm+RXBUCKA4VAh64Z9s3RyBhRgOpDLjvxKQ0pyAjv9PBOa3we/ichz220JL95w2Gd0AwNtxYQJAGRjLzvY1nBAO0DR1CKGFArp2m4BB76HfspqGjzQqGniF0EoNzh9frXcFPOD6pEOshL3sbPZ6uQOPCFWzgWFx8QJAM19xWfr9RZSBqXMUKuk8YhK3ma/CQ1olqD4nHjwnKtvzTbLW/+4MMlRAyCPKvTicRPIB8NdsVrEtRl9JFr6WxA==' }
  })
  node.on('ready', () => {
    console.log('Node ready')
    done(node)
  })
  node.on('error', (err) => {
    console.error(err)
  })
  node.on('stop', () => {
    console.log('Node stopped')
  })
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
    client((ipfs) => {
      ipfs.version((err, res) => {
        if (err) throw err
        this.setState({
          id: res.id,
          version: res.agentVersion,
          protocol_version: res.protocolVersion
        })
      })
    })
    const delta = hrtime(start)
    this.setState({ time: delta })
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
