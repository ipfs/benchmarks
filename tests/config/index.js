'use strict'
const uuidv1 = require('uuid/v1')
const guid = process.env.GUID || uuidv1()
const fileSetParam = (process.env.FILESET && process.env.FILESET.toLowerCase()) || false
const verify = process.env.VERIFYOFF && process.env.VERIFYOFF.toLowerCase() === 'true'
const argv = require('minimist')(process.argv.slice(2))

const tests = { 'unixFsAdd': [{
  'warmup': 'Off',
  'fileSet': ['OneKBFile', 'OneMBFile', 'One4MBFile', 'One64MBFile'] } ],
'localExtract': [{
  'warmup': 'Off',
  'fileSet': ['OneKBFile', 'OneMBFile', 'One4MBFile', 'One64MBFile'] } ],
'localTransfer': [{
  'warmup': 'Off',
  'fileSet': ['OneKBFile', 'OneMBFile', 'One4MBFile', 'One64MBFile'] } ],
'multiPeerTransfer': [{
  'warmup': 'Off',
  'fileSet': ['OneKBFile', 'OneMBFile', 'One4MBFile', 'One64MBFile'] } ],
'addMultiKb': [{
  'warmup': 'Off',
  'fileSet': ['Hundred1KBFile'] } ],
'initializeNode': [{
  'warmup': 'Off',
  'fileSet': ['None'] }],
'initializeNodeBrowser': [{
  'warmup': 'Off',
  'fileSet': ['None'] }],
'unixFsAddBrowser': [{
  'warmup': 'Off',
  'fileSet': ['OneKBFile', 'OneMBFile', 'One4MBFile', 'One64MBFile'] }],
'addMultiKbBrowser': [{
  'warmup': 'Off',
  'fileSet': ['Hundred1KBFile'] } ],
'peerTransferBrowser': [{
  'warmup': 'Off',
  'fileSet': ['OneKBFile', 'OneMBFile'] }],
'unixFsAddGo': [{
  'warmup': 'Off',
  'fileSet': ['OneKBFile', 'OneMBFile', 'One4MBFile', 'One64MBFile'] } ],
'extractJs2Go': [{
  'warmup': 'Off',
  'fileSet': ['OneKBFile', 'OneMBFile', 'One4MBFile', 'One64MBFile'] } ],
'extractGo2Js': [{
  'warmup': 'Off',
  'fileSet': ['OneKBFile', 'OneMBFile', 'One4MBFile', 'One64MBFile'] } ],
'pubsubMessage': [{
  'warmup': 'Off',
  'fileSet': ['None'] }]
}
const parseParams = () => {
  let name = '_'
  console.log(argv)
  let desc = '('
  if (argv.s) {
    if (argv.s === 'trickle') {
      name = `${name}Trickle`
      desc = `${desc}trickle`
    } else {
      name = `${name}`
      desc = `${desc}balanced`
    }
  } else {
    if (argv.t === 'ws') {
      name = `${name}ws_`
      desc = `${desc}websocket, `
    } else {
      name = `${name}tcp_`
      desc = `${desc}tcp, `
    }
    if (argv.m === 'spdy') {
      name = `${name}spdy`
      desc = `${desc}spdy`
    } else {
      name = `${name}mplex`
      desc = `${desc}mplex`
    }
    if (argv.e === 'secio') {
      name = `${name}_secio`
      desc = `${desc}, secio`
    }
  }
 
  desc = `${desc})`
  return { name: name, description: desc }
}
const config = {
  test: tests,
  fileSetParam: fileSetParam,
  verify: verify,
  guid: guid,
  parseParams: parseParams
}

module.exports = config
