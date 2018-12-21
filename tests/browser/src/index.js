import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { HashRouter, Route, Switch } from 'react-router-dom'

ReactDOM.render(<HashRouter><Switch> <Route exact path='/' component={App}/> </Switch></HashRouter>, document.getElementById('root'))
