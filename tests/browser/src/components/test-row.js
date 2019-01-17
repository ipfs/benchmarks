import React from 'react'

export default class TestRow extends React.Component {
  render () {
    return (<div className='rt-tr' role='row'>
      <div className='rt-td' role='gridcell' style={{ flex: '100 0 auto', width: '100px' }}>
        {this.props.type === 'button' ? <button class={this.props.name} onClick={(e) => this.props.test(e)}>Start Test</button>
        : <input type='file' class={this.props.name} multiple='multiple' onChange={(e) => this.props.test(e)} />}
      </div><div className='rt-td' role='gridcell' style={{ flex: '100 0 auto', width: '100px' }}>{this.props.description}</div>
      <div className='rt-td' role='gridcell' style={{ flex: '100 0 auto', width: '100px' }}><p>ID:<strong>{this.props.results.id}</strong></p>
        <p>IPFS version: <strong>{this.props.results.version}</strong></p>
        <p>IPFS protocol version:<strong>{this.props.results.protocol_version}</strong></p></div>
      <div className='rt-td' role='gridcell' style={{ flex: '100 0 auto', width: '100px' }}>
        <div class={`${this.props.name}_s_${this.props.results.ready}`}>secs:{this.props.results.time_s}</div>
        <div class={`${this.props.name}_ms_${this.props.results.ready}`}>milli:{this.props.results.time_ms}</div></div>
    </div>)
  }
}
