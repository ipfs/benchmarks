'use strict'

const fs = require('fs')
const path = require('path')
const YAML = require('yaml')
const Influx = require('influx')
const Pino = require('pino')
let pino

const inventoryPath = process.env.INVENTORY || path.join(__dirname, '../infrastructure/inventory/inventory.yaml')
const playbookPath = path.join(__dirname, '../infrastructure/playbooks/benchmarks.yaml')
const remoteTestsPath = process.env.REMOTE_FOLDER || '~/ipfs/tests/'
const remoteIpfsPath = process.env.REMOTE_FOLDER || '~/ipfs/'
const params = 'OUT_FOLDER=/tmp/out REMOTE=true '
const remotePreNode = `killall node 2>/dev/null; source ~/.nvm/nvm.sh && `
const HOME = process.env.HOME || process.env.USERPROFILE
const keyfile = path.join(HOME, '.ssh', 'id_rsa')
const tests = []

// pretty logs in local
if (process.env.NODE_ENV === 'test') {
  pino = Pino({
    enabled: false
  })
} else if (process.env.LOG_PRETTY === 'true') {
  pino = Pino({
    prettyPrint: {
      levelFirst: true
    },
    prettifier: require('pino-pretty')
  })
} else {
  pino = Pino()
}

const getInventory = () => {
  return YAML.parse(fs.readFileSync(inventoryPath, 'utf8'))
}

const getBenchmarkHostname = () => {
  return getInventory().all.children.minions.hosts
}

const getLocalCommand = (test) => {
  return `${test.params} node ${test.path.local}/${test.file}`
}

const getRemoteCommand = (test) => {
  return `${remotePreNode} ${test.params} node ${test.path.local}/${test.file}`
}

const getLocalClinicCommand = (test, operation) => {
  return `${test.params} clinic ${operation} -- node ${test.path.local}/${test.file}`
}

const getRemoteClinicCommand = (test, operation) => {
  return `${remotePreNode} ${test.params} clinic ${operation} -- node ${test.path.local}/${test.file}`
}

const testAbstracts = [
  // {
  //   name: 'localTransfer',
  //   shell: `${remotePreNode} node ${remoteTestsPath}/local-transfer.js`,
  //   localShell: `${params} node ${path.join(__dirname, '/../tests/local-transfer.js')}`
  // },
  {
    name: 'unixFsAdd',
    file: 'local-add.js',
    path: {
      remote: remoteTestsPath,
      local: path.join(__dirname, '/../tests')
    },
    params: params,
    remotePreCommand: remotePreNode
    // shell: `${remotePreNode} node ${remoteTestsPath}/local-add.js`,
    // localShell: `${params} node ${path.join(__dirname, '/../tests/local-add.js')}`
  },
  // {
  //   name: 'localExtract',
  //   shell: `${remotePreNode} node ${remoteTestsPath}/local-extract.js`,
  //   localShell: `${params} node ${path.join(__dirname, '/../tests/local-extract.js')}`
  // },
  // {
  //   name: 'multiPeerTransfer',
  //   shell: `${remotePreNode} node ${remoteTestsPath}/multi-peer-transfer.js`,
  //   localShell: `${params} node ${path.join(__dirname, '/../tests/multi-peer-transfer.js')}`
  // }
]

for (let test of testAbstracts) {
  if (process.env.STAGE === 'local') {
    tests.push({
      name: test.name,
      benchmark: getLocalCommand(test),
      doctor: getLocalClinicCommand(test, 'doctor'),
      flame: getLocalClinicCommand(test, 'flame'),
      bubbleProf: getLocalClinicCommand(test, 'bubbleProf')
    })
  } else {
    tests.push({
      name: test.name,
      benchmark: getRemoteCommand(test),
      doctor: getRemoteClinicCommand(test, 'doctor'),
      flame: getRemoteClinicCommand(test, 'flame'),
      bubbleProf: getRemoteClinicCommand(test, 'bubbleProf')
    })
  }
}

const config = {
  provison: {
    command: `ansible-playbook -i ${inventoryPath} --key-file ${keyfile} ${playbookPath}`
  },
  log: pino,
  stage: process.env.STAGE || 'local',
  outFolder: process.env.OUT_FOLDER || '/tmp/out',
  nodePre: remotePreNode,
  influxdb: {
    host: process.env.INFLUX_HOST || 'localhost',
    db: 'benchmarks',
    schema: [
      {
        measurement: tests[0].measurement,
        fields: {
          duration: Influx.FieldType.INTEGER
        },
        tags: [
          'subTest',
          'commit',
          'project',
          'testClass'
        ]
      }
    ]
  },
  benchmarks: {
    host: getBenchmarkHostname(),
    user: process.env.BENCHMARK_USER || 'elexy',
    key: process.env.BENCHMARK_KEY || keyfile,
    path: path.join(__dirname, '../tests'),
    remotePath: remoteTestsPath,
    tests: tests,
    clinicOperations: ['doctor', 'flame', 'bubleprof']
  },
  ipfs: {
    path: remoteIpfsPath
  }
}

console.log(config.benchmarks.tests)

module.exports = config
