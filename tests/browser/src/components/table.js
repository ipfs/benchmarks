import React from 'react'
import AddLocalFile from './add-local-file'
import InitializeNode from './initialize-node'
import PeerTransfer from './peer-transfer'
import './table.css'
export default class Table extends React.Component {
  render () {
    return (
      <div className='ReactTable'>
        <div class='rt-table' role='grid'><div class='rt-thead -header' style={{ minWidth: '400px' }}><div class='rt-tr' role='row'>
          <div className='rt-th rt-resizable-header -cursor-pointer' role='columnheader' style={{ flex: '100 0 auto', width: '100px' }}>
            <div className='rt-resizable-header-content'>Start</div></div><div className='rt-resizable-header-content' style={{ flex: '100 0 auto', width: '100px' }}>Description</div><div className='rt-resizable-header-content' style={{ flex: '100 0 auto', width: '100px' }}>About Node</div><div className='rt-resizable-header-content' style={{ flex: '100 0 auto', width: '100px' }}>Results</div></div>
        </div></div>
        <div class='rt-tbody' style={{ minWidth: '400px' }}><div class='rt-tr-group' role='rowgroup'>
          <InitializeNode />
          <AddLocalFile />
          <PeerTransfer />
        </div>
        </div>
      </div>
    )
  }
}
