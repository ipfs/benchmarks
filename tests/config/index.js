'use strict'
const uuidv1 = require('uuid/v1')
const guid = process.env.GUID || uuidv1()
const fileSetParam = (process.env.FILESET && process.env.FILESET.toLowerCase()) || false
const warmup = (process.env.WARMUP && process.env.WARMUP.toLowerCase()) || false
const verify = process.env.VERIFYOFF && process.env.VERIFYOFF.toLowerCase() === 'true'

const tests = { 'unixFsAdd': [{
  'warmup': 'Off',
  'fileSet': ['OneKBFile', 'One62KBFile', 'One64KBFile', 'OneMBFile', 'One512KBFile', 'One768KBFile', 'One1023KBFile', 'OneMBFile', 'One4MBFile', 'One8MBFile', 'One64MBFile'] }],
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
  'fileSet': ['OneKBFile', 'OneMBFile', 'One4MBFile', 'One64MBFile'] } ],
'initializeNode': [{
  'warmup': 'Off',
  'fileSet': ['None'] }],
'initializeNodeBrowser': [{
  'warmup': 'Off',
  'fileSet': ['None'] }],
'unixFsAddGo': [{
  'warmup': 'Off',
  'fileSet': ['OneKBFile', 'OneMBFile', 'One4MBFile', 'One64MBFile'] } ]
}

const config = {
  test: tests,
  fileSetParam: fileSetParam,
  warmup: warmup,
  verify: verify,
  guid: guid
}

module.exports = config
