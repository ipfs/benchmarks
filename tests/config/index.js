'use strict'

const config = { 'unixFsAdd': [{
  'warmup': 'Off',
  'fileSet': ['OneKBFile', 'OneMBFile', 'One4MBFile', 'One64MBFile'] },
{ 'warmup': 'On',
  'fileSet': ['OneKBFile', 'OneMBFile', 'One4MBFile', 'One64MBFile'] }],
'localExtract': [{
  'warmup': 'Off',
  'fileSet': ['OneKBFile', 'OneMBFile', 'One4MBFile', 'One64MBFile'] },
{ 'warmup': 'On',
  'fileSet': ['OneKBFile', 'OneMBFile', 'One4MBFile', 'One64MBFile'] }],
'localTransfer': [{
  'warmup': 'Off',
  'fileSet': ['OneKBFile', 'OneMBFile', 'One4MBFile', 'One64MBFile'] },
{
  'warmup': 'On',
  'fileSet': ['OneKBFile', 'OneMBFile', 'One4MBFile', 'One64MBFile'] }],
'multiPeerTransfer': [{
  'warmup': 'Off',
  'fileSet': ['OneKBFile', 'OneMBFile', 'One4MBFile', 'One64MBFile'] },
{
  'warmup': 'On',
  'fileSet': ['OneKBFile', 'OneMBFile', 'One4MBFile', 'One64MBFile'] } ],
'addMultiKb': [{
  'warmup': 'Off',
  'fileSet': ['Hundred1KBFile'] },
{
  'warmup': 'On',
  'fileSet': ['Hundred1KBFile'] } ],
'initializeNode': [{
  'warmup': false,
  'fileSet': ['None'] }]
}

const fileSetParam = (process.env.FILESET && process.env.FILESET.toLowerCase()) || false
const warmup = (process.env.WARMUP && process.env.WARMUP.toLowerCase()) || false
const verify = process.env.VERIFYOFF && process.env.VERIFYOFF.toLowerCase() === 'true'
