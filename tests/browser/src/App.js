import React, { Component } from 'react'
import './App.css'

import IPFS from 'ipfs'
import hrtime from 'browser-process-hrtime'
import { config } from '../package.json'
import uuidv1 from 'uuid/v1'
import ReactTable from "react-table"
import 'react-table/react-table.css'
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
      time_ms: null,
      ready: ''
    }
  }
  submitClick (t) {
    const self = this
    let node

    create()

    function create () {
      // Create the IPFS node instance
      const start = hrtime()


      node = new IPFS({ repo: String(uuidv1()) })

      node.once('ready', () => {
        const delta = hrtime(start)
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
          time_ms: delta[1],
          ready: 'ready'
        })
      })
    }
    
  }
  componentDidMount () {
   
  }
  render () {
    const data = [{
      name: 'Initialize Node',
      start: "initialize_node",
      time: {
        s: this.state.time_s,
        ms: this.state.time_ms,
        name: 'initialize_node',
        ready: this.state.ready
      },
      node: {
        id: this.state.id,
         version: this.state.version,
         protocal_version: this.state.protocol_version
      }
    }]
  
    const columns = [
      {
        Header: 'Start',
        accessor: 'start',
        style: {
          cursor: 'pointer'
        },
        Cell: props => <button class={props.value} onClick={()=>this.submitClick(props.value)}>Start Test</button>
      },
      {
        Header: 'Test',
        accessor: 'name'
      }, {
        Header: 'Node',
        accessor: 'node',
        Cell: props => <div>
          <p>Your ID is <strong>{props.value.id}</strong></p>
          <p>Your IPFS version is <strong>{props.value.version}</strong></p>
          <p>Your IPFS protocol version is <strong>{props.value.protocal_version}</strong></p>
        </div>
      }, {
        Header: 'Time',
        accessor: 'time',
        Cell: props => <div><div class={props.value.name + '_s_' + props.value.ready}>{props.value.s}</div>.<div class={props.value.name + '_ms_' + props.value.ready}_ms>{props.value.ms}</div></div>
      }]
    return <div style={{ textAlign: 'center' }}>       <h1>IPFS Browser Benchmark</h1><ReactTable
      data={data}
      columns={columns}
      showPagination={false}
    />
    </div>
  }
}

export default App
