import React from 'react'
import IPFS from 'ipfs'
import hrtime from 'browser-process-hrtime'
import uuidv1 from 'uuid/v1'
import 'react-table/react-table.css'
import { once } from 'stream-iterators-utils'
import getId from './getId'
import localState from './localState'
import TestRow from './test-row'
class InitializeNode extends React.Component {
  constructor (props) {
    super(props)
    this.state = localState
  }

  async test (e) {
    // Create the IPFS node instance
    const start = hrtime()
    const node = new IPFS({ repo: String(uuidv1()) })
    node.on('ready', () => {
    })
    await once(node, 'ready')
    const delta = hrtime(start)
    const results = await getId(node, delta, this.state)
    this.setState(results)
  }
  render () {
    const name = 'initializeNode'
    const description = 'Initialize an IPFS node'
    return (
      <TestRow
        name={name}
        description={description}
        results={this.state}
        test={this.test.bind(this)}
        type='button'
      />
    )
  }
}
export default InitializeNode
