import React from 'react'
import IPFS from 'ipfs'
import hrtime from 'browser-process-hrtime'
import uuidv1 from 'uuid/v1'
import 'react-table/react-table.css'
import { once } from 'stream-iterators-utils'
import fileReaderStream from 'filereader-stream'
import getId from './getId'
import localState from './localState'
import TestRow from './test-row'
import WS from 'libp2p-websockets'
import MPLEX from 'libp2p-mplex'
class PeerTransfer extends React.Component {
  constructor (props) {
    super(props)
    this.state = localState
  }

  async test (e) {
    const server = process.env.REACT_APP_REMOTE === 'true' ? 'benchmarks.ipfs.team' : 'ws-star.discovery.libp2p.io'
    const fileArray = [...e.target.files]
    // Create the IPFS node instance
    const node = new IPFS({ repo: String(uuidv1()),
      config: { 'libp2p': {
        'modules': {
          transport: [WS],
          streamMuxer: [MPLEX],
          connEncryption: [],
          'peerDiscovery': []
        }
      },
      Addresses: {
        Swarm: [
          `/dnsaddr/${server}/tcp/9090/ws/p2p-websocket-star/`
        ]
      }
      }
    })
    const node2 = new IPFS({ repo: String(uuidv1()),
      config: { 'libp2p': {
        'modules': {
          transport: [WS],
          streamMuxer: [MPLEX],
          connEncryption: [],
          'peerDiscovery': []
        }
      },
      Addresses: {
        Swarm: [
          `/dnsaddr/${server}/tcp/9090/ws/p2p-websocket-star/`
        ]
      }
      }
    })
    node.on('ready', () => {})
    node2.on('ready', () => {})
    await once(node, 'ready')
    await once(node2, 'ready')
    const nodeId = await node.id()
    node2.swarm.connect(nodeId.addresses[0])
    const fileStream = fileReaderStream(fileArray[0])
    const inserted = node.add ? await node.add(fileStream) : await node.files.add(fileStream)
    const start = hrtime()
    let stream = node2.catReadableStream ? node2.catReadableStream(inserted[0].hash) : node2.files.catReadableStream(inserted[0].hash)
    stream.resume()
    await once(stream, 'end')
    const delta = hrtime(start)
    const results = await getId(node, delta, this.state)
    this.setState(results)
  }
  render () {
    const name = 'peerTransfer'
    const description = 'Transfer files between peers'
    return (
      <TestRow
        name={name}
        description={description}
        results={this.state}
        test={this.test.bind(this)}
      />
    )
  }
}
export default PeerTransfer
