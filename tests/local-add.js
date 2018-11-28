'use strict'

const fs = require('fs')
const NodeFactory = require('./lib/node-factory')
const { build } = require('./schema/results')
const { store } = require('./lib/output')
const fixtures = require('./lib/fixtures')
const clean = require('./lib/clean')
const testName = 'unixFS-add'
const privateKey = 'CAASqAkwggSkAgEAAoIBAQCVYamXQlPlVz7MCPISyQ+nAM4FWIhXdkKYsYWz5oR0tVqRQrP5DscxO7M+xjN3EjIi+XF3W4YTdPEwBejd3RiAMWGmuOMH5LvKpTZhKotCmR1LASSFbFbVFdNhixYz6uxWCSKMrsAZdpURb33zEt7s3mjHXBoXVm8mAWIaAvmmAkCQWzU6Oxvh6GDBWEI7Z9sdFZwLByqRXggdp6V20AUmuG57qSNsehBU4x1kDMGeJ7b1u/SI5eVT7qtcqlUmdpoXoJNK5lr7suaFnBYI1s+1W5Vl2F2OXD/cJJSH70YdMjMAiJHaZ7lOQ6cFWUw/AR3a8hAblWcHufqMmC2gOdlBAgMBAAECggEBAJSBl/jxDrjEaICtMANu8WmkiiyUXE8fGYv1iCdWNz5TgOtCdetXPr36TPNOVaG9bCyK8buoOH2lV5XXei7++7mN3jfCPKn/QpZucsZcZj/aOl3zj9w43YZPgWrKvFL27OeHg1p67C0kT4Qa5ArAKvEvFtmC/clPu4X8AAw+AvR+aIorfb/wa+ei9p0GW/VSt0xpzeyfsCRGo6ZbMaZSL2tYP2iB87q4nDfi7u0JnD0yR3l20OyR6vVtDMDeXsHp221V5nrPDWNwQJ1QX0uVwit7EDWiARBApqxLZovPO6R4hlVp3xTfcuxmhOqdsRbsIqhj9NrUFicNJMfkSa5emdUCgYEA1HVkLqaRQskt4cxtMTjLjFbwJ7/rH1FlsDDYSacoMG91wWaPuRL0FDOWeP4MgaWtuIlQkjjGuOHin3fqQo5wAeIC66jbmRVz8rKtrBijJf1UjWsFtG3Ec1hM7LN1Cl6N4fZu0IlToHk+BhJ5IjdvW96qf5B+BMlhB9Tny0LvX6MCgYEAs/7xEb7xbVd1enMwASo45WxnFiXUqK+LfSR+01Hv6M/Lt1q2M64PHlsB06e7DSqpjunYvom2fk4sXhHGT0yQFI92v5w0fiRiRp47lcjXuWpFd7NFZhcKy6KUkZ8KgiRCLWjbUGdn+ITUNbJH6ov6oU3cAF+dZcJ4UdHvlVfnIcsCgYEAy/cLP7IPgKNtFfpQ1dFlsIyCMFcSXdWiHz01V7hPX/iRfyN8VTw58O75xZx32zt4hNHm9Qnm1fWdwGS6FD10kIovLZjFgbjTwKsDClX4wu7q7n1RU7+Ruv6JkzBR66uM4OLZzgAYtdXP0rqHam73zKX+30qTgPrn2UHvafcPoasCgYAKcS3XE7a52ysLkYclaiem16UbWdJ+fsCe3/EjnUtHvFZbKr4LPXvPDQSMHNzzJJh1nAdg9mhJ54sXYfyZOR3as3/2Gb/J2Z6B7kgSpnYtYYbqLNJH2+paafIoiIt5hVT5gW3HulgDyODuxIr7hmdh2Dx9IQ7mimOki4NUrKbSBQKBgBaOxmb1+geRq2lj7n58reBZhFZbrpuMcuWo8zAVRDoIEhg0ovkUDDzWv0FlAt+z6fGqyYpnSC+K61G8IBPm1md8EUmqd5vXAgpiCR+ORgn6REM3x+silBavUc35lgmkCJ/N4krKI72mCoBXFPxQVFDUNK6uXcvmNp7F6CvAvnbV'

async function localAdd (node, name, subtest, testClass) {
  try {
    const fileStream = fs.createReadStream(fixtures[testClass])
    const start = process.hrtime()
    await node.files.add(fileStream)
    const end = process.hrtime(start)
    return build({
      name: name,
      subtest: subtest,
      file: fixtures[testClass],
      description: 'Add file to local repo using unixFS engine',
      testClass: testClass,
      duration: {
        s: end[0],
        ms: end[1] / 1000000
      }
    })
  } catch (err) {
    throw Error(err)
  }
}

async function scenarios () {
  try {
    const nodeFactory = new NodeFactory()

    const node = await nodeFactory.add()
    let arrResults = []
    arrResults.push(await localAdd(node, testName, 'add-empty-repo', 'largefile'))
    const node1 = await nodeFactory.add({
      'Addresses': {
        'API': '/ip4/127.0.0.1/tcp/5013',
        'Gateway': '/ip4/127.0.0.1/tcp/9092',
        'Swarm': [
          '/ip4/0.0.0.0/tcp/4013',
          '/ip4/127.0.0.1/tcp/4015/ws'
        ]
      },
      'Bootstrap': []
    }, { empty: true, privateKey })

    arrResults.push(await localAdd(node1, testName, 'empty-repo', 'smallfile'))

    arrResults.push(await localAdd(node1, testName, 'populated-repo', 'smallfile'))
    arrResults.push(await localAdd(node, testName, 'populated-repo', 'largefile'))

    store(arrResults)

    nodeFactory.stop()
    clean.peerRepos()
  } catch (err) {
    throw Error(err)
  }
}

scenarios()
module.exports = localAdd
