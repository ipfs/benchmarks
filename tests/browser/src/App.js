import React, { Component } from 'react'
import './App.css'
import IPFS from 'ipfs'
import hrtime from 'browser-process-hrtime'
import uuidv1 from 'uuid/v1'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import { once } from 'stream-iterators-utils'
import fileReaderStream from 'filereader-stream'
const test = {
  initializeNode: async () => {
    // Create the IPFS node instance
    const start = hrtime()
    const node = new IPFS({ repo: String(uuidv1()) })
    node.on('ready', () => {
    })
    await once(node, 'ready')
    const delta = hrtime(start)
    return { node: node, delta: delta, name: 'initializeNode' }
  },
  addLocalFile: async (file) => {
    // Create the IPFS node instance
   
    const  node = new IPFS({ repo: String(uuidv1()),
      config: { 
        Addresses: {
        Swarm: [
         //'/dnsaddr/ws-star-signal-1.servep2p.com/tcp/9090/ws/p2p-websocket-star/'
         '/dnsaddr/ws-star.discovery.libp2p.io/tcp/9090/ws/p2p-websocket-star/'
        ]
        }
      }})

    const fileArray = [...file]

    node.on('ready', () => {})
    await once(node, 'ready')
    const start = hrtime()
    for (let i = 0; i < fileArray.length; i++) {
      const readStream = fileReaderStream(fileArray[i])
      node.add ? await node.add(readStream) : await node.files.add(readStream)
    }
    const delta = hrtime(start)
    return { node: node, delta: delta, name: 'addLocalFile' }
  },
  peerTransfer: async (file) => {
    // Create the IPFS node instance
   
    const node = new IPFS({ repo: String(uuidv1()),
      config: {
        Addresses: {
          Swarm: [
            '/dnsaddr/95.179.134.100/tcp/9090/ws/p2p-websocket-star/'
          ]
        }
      }
    })
    const node2 = new IPFS({ repo: String(uuidv1()),
      config: {
        Addresses: {
          Swarm: [
            '/dnsaddr/95.179.134.100/tcp/9090/ws/p2p-websocket-star/'
          ]
        }
      }
    })
    node.on('ready', () => {})
    node2.on('ready', () => {})
    await once(node, 'ready')
    await once(node2, 'ready')
    const fileArray = [...file]
    const nodeId = await node.id()
    node2.swarm.connect(nodeId.addresses[0])
    const fileStream = fileReaderStream(fileArray[0])
    const inserted = node.add ? await node.add(fileStream) : await node.files.add(fileStream)
    const start = hrtime()
    let stream = node2.catReadableStream ? node2.catReadableStream(inserted[0].hash) : node2.files.catReadableStream(inserted[0].hash)
    stream.resume()
    await once(stream, 'end')
    const delta = hrtime(start)
    return { node: node, delta: delta, name: 'peerTransfer' }
  }
}
class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      initializeNode: { id: null,
        version: null,
        protocol_version: null,
        added_file_hash: null,
        added_file_contents: null,
        time_s: null,
        time_ms: null,
        ready: ''
      },
      addLocalFile: { id: null,
        version: null,
        protocol_version: null,
        added_file_hash: null,
        added_file_contents: null,
        time_s: null,
        time_ms: null,
        ready: ''
      },
      peerTransfer: { id: null,
        version: null,
        protocol_version: null,
        added_file_hash: null,
        added_file_contents: null,
        time_s: null,
        time_ms: null,
        ready: ''
      }
    }
  }
  ops (node, delta, name) {
    node.id((err, res) => {
      if (err) {
        throw err
      }
      const results = { ...this.state[name] }
      results.id = res.id
      results.version = res.agentVersion
      results.protocol_version = res.protocolVersion
      results.time_s = delta[0]
      results.time_ms = delta[1]
      results.ready = 'ready'
      this.setState({ [name]: results })
    })
  }

  async startTest (t) {
    const tt = await test[t]()
    this.ops(tt.node, tt.delta, tt.name)
  }
  async handleselectedFile (e, name) {
    const tt = await test[name](e.target.files)
    this.ops(tt.node, tt.delta, tt.name)
  }
  componentDidMount () {
  }
  render () {
    const data = [{
      name: 'Initialize Node',
      start: {
        type: 'button',
        name: 'initializeNode'
      },
      time: {
        s: this.state.initializeNode.time_s,
        ms: this.state.initializeNode.time_ms,
        name: 'initializeNode',
        ready: this.state.initializeNode.ready
      },
      node: {
        id: this.state.initializeNode.id,
        version: this.state.initializeNode.version,
        protocal_version: this.state.initializeNode.protocol_version
      }
    },
    {
      name: 'Add files',
      start: {
        type: 'file',
        name: 'addLocalFile'
      },
      time: {
        s: this.state.addLocalFile.time_s,
        ms: this.state.addLocalFile.time_ms,
        name: 'addLocalFile',
        ready: this.state.addLocalFile.ready
      },
      node: {
        id: this.state.addLocalFile.id,
        version: this.state.addLocalFile.version,
        protocal_version: this.state.addLocalFile.protocol_version
      }
    },
    {
      name: 'Transfer file between peer',
      start: {
        type: 'file',
        name: 'peerTransfer'
      },
      time: {
        s: this.state.peerTransfer.time_s,
        ms: this.state.peerTransfer.time_ms,
        name: 'peerTransfer',
        ready: this.state.peerTransfer.ready
      },
      node: {
        id: this.state.peerTransfer.id,
        version: this.state.peerTransfer.version,
        protocal_version: this.state.peerTransfer.protocol_version
      }
    }]
    const columns = [
      {
        Header: 'Start',
        accessor: 'start',
        style: {
          cursor: 'pointer'
        },
        Cell: props => props.value.type === 'button' ? <button class={props.value.name} onClick={(e) => this.startTest(props.value.name)}>Start Test</button> : <input type='file' class={props.value.name} multiple='multiple' onChange={(e) => this.handleselectedFile(e, props.value.name)} />
      },
      {
        Header: 'Test',
        accessor: 'name'
      }, {
        Header: 'Node',
        accessor: 'node',
        Cell: props => <div>
          <p>ID:<strong>{props.value.id}</strong></p>
          <p>IPFS version: <strong>{props.value.version}</strong></p>
          <p>IPFS protocol version:<strong>{props.value.protocal_version}</strong></p>
        </div>
      }, {
        Header: 'Time',
        accessor: 'time',
        Cell: props => <div><div class={props.value.name + '_s_' + props.value.ready}>secs:{props.value.s}</div><div class={props.value.name + '_ms_' + props.value.ready}_ms>milli:{props.value.ms}</div></div>
      }]
    return <div><header class='pa2 bg-navy'>
      <h2 class='ma0 montserrat aqua'>
      IPFS Browser Benchmark
      </h2>
    </header><ReactTable
      data={data}
      columns={columns}
      showPagination={false}
    />
    </div>
  }
}

export default App
