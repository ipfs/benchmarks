'use srict'

const tap = require('tap')

const outString =
`{
  "name": "localAdd/15967.clinic-doctor/15967.clinic-doctor-processstat",
  "cid": "QmV4SAi1Ynz3BcRb2KjSTGgDVMN1mRCy7GJkC8nvW3TkmP",
  "size": 6566
}
{
  "name": "localAdd/15967.clinic-doctor/15967.clinic-doctor-systeminfo",
  "cid": "QmePZR5RKWquWP4b642E2Ffu3MDTLEUzcdprq8GMfPuVUb",
  "size": 481
}
{
  "name": "localAdd/15967.clinic-doctor/15967.clinic-doctor-traceevent",
  "cid": "QmPhn82fiHVDtz3RysWK3zryge4bfNEjsr5Frh2gQSb692",
  "size": 2225617
}
{
  "name": "localAdd/15967.clinic-doctor.html",
  "cid": "QmUJpPekYvP5zrULE6u9oG1Uww7ZeD7wbpRX2Qe2TjTAo4",
  "size": 260252
}
{
  "name": "localAdd/15967.clinic-doctor",
  "cid": "QmNTfogTCu7v6f3XaghhcmvpiC3RqnLhs9AeBoKqDjTeyU",
  "size": 2232890
}
{
  "name": "localAdd",
  "cid": "QmWvMq2tkQJUqUs5pyBWQ2fCVR714pSN285fqd2rFwYti6",
  "size": 2493278
}`

const outString2 =
`{
  "name": "1546104181577",
  "cid": "QmUNLLsPACCz1vLxQVkXqqLX5R1X345qqfHbsf67hvA3Nn",
  "size": 4
}`

// the test subject
const ipfs = require('../ipfs.js')

tap.test('multi object string', async (t) => {
  const sha = ipfs.parse(outString, 'localAdd')
  tap.equal(sha, 'QmWvMq2tkQJUqUs5pyBWQ2fCVR714pSN285fqd2rFwYti6')
  t.end()
})

tap.test('single object string', async (t) => {
  const sha = ipfs.parse(outString2, '1546104181577')
  tap.equal(sha, 'QmUNLLsPACCz1vLxQVkXqqLX5R1X345qqfHbsf67hvA3Nn')
  t.end()
})
