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
    console.log(delta)
    return { node: node , delta: delta, name: 'initializeNode' }
  },
  addLocalFile: async (file) => {
    // Create the IPFS node instance
    const node = new IPFS({ repo: String(uuidv1()) })
    const readStream = fileReaderStream(file)
    node.on('ready', () => {})
    await once(node, 'ready')
    const start = hrtime()
    const inserted = node.add ? await node.add(readStream) : await node.files.add(readStream)
    const delta = hrtime(start)
    console.log(inserted)
    return { node: node, delta: delta, name: 'addLocalFile' }
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
        ready: '' }
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
    console.log(name)
    const tt = await test[name](e.target.files[0])
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
    }]
    const columns = [
      {
        Header: 'Start',
        accessor: 'start',
        style: {
          cursor: 'pointer'
        },
        Cell: props => props.value.type === 'button' ? <button class={props.value.name} onClick={(e) => this.startTest(props.value.name)}>Start Test</button> : <input type="file" class={props.value.name} onChange={(e) => this.handleselectedFile(e, props.value.name)} />
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
    <div className="App">
      <input type="file" name="" id="" onChange={this.handleselectedFile} />
      <button onClick={this.handleUpload}>Upload</button>
     <div> {Math.round(this.state.loaded,2) } %</div>
    </div>
    </div>
  }
}

export default App
