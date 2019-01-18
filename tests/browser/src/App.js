import React, { Component } from 'react'
import './App.css'
import 'react-table/react-table.css'
import Table from './components/table'
class App extends Component {
  render () {
    return <div><header class='pa2 bg-navy'>
      <h2 class='ma0 montserrat aqua'>
      IPFS Browser Benchmark
      </h2>
    </header><Table />
    </div>
  }
}
export default App
