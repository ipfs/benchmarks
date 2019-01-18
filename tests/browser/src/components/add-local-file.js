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
class AddLocalFile extends React.Component {
  constructor (props) {
    super(props)
    this.state = localState
  }

  async test (e) {
    // Create the IPFS node instance
    const node = new IPFS({ repo: String(uuidv1()) })
    const fileArray = [...e.target.files]
    node.on('ready', () => {})
    await once(node, 'ready')
    const start = hrtime()
    for (let i = 0; i < fileArray.length; i++) {
      const readStream = fileReaderStream(fileArray[i])
      node.add ? await node.add(readStream) : await node.files.add(readStream)
    }
    const delta = hrtime(start)
    const results = await getId(node, delta, this.state)
    this.setState(results)
  }
  render () {
    const name = 'addLocalFile'
    const description = 'Add local files'
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
export default AddLocalFile
