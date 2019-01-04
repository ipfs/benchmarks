import React, { Component } from 'react'
import './App.css'
import IPFS from 'ipfs'
import hrtime from 'browser-process-hrtime'
import uuidv1 from 'uuid/v1'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import { once } from 'stream-iterators-utils'
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
    return {node: node , delta: delta, name:'initialize_node'}
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
      this.setState({ initializeNode: results })
    })
  }

  async startTest (t) {
    const tt = await test[t]()
    this.ops(tt.node, tt.delta, tt.name)
  }

  componentDidMount () {
  }
  render () {
    const data = [{
      name: 'Initialize Node',
      start: 'initializeNode',
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
    }]
    const columns = [
      {
        Header: 'Start',
        accessor: 'start',
        style: {
          cursor: 'pointer'
        },
        Cell: props => <button class='{props.value} button button-outlined' onClick={(e) => this.startTest(props.value)}>Start Test</button>
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
