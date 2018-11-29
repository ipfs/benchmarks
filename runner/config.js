'use strict'

const fs = require('fs')
const path = require('path')
const YAML = require('yaml')
const Influx = require('influx')
const Pino = require('pino')
let pino

const inventoryPath = path.join(__dirname, '../infrastructure/inventory/inventory.yaml')
const playbookPath = path.join(__dirname, '../infrastructure/playbooks/benchmarks.yaml')
const remoteTestsPath = process.env.REMOTE_FOLDER || '~/ipfs/tests/'
const params = 'OUT_FOLDER=/tmp/out REMOTE=true'
const remotePreCommand = `source ~/.nvm/nvm.sh && ${params}`

// pretty logs in local
if (process.env.NODE_ENV === 'test') {
  pino = Pino({
    enabled: false
  })
  console.log('NODE_ENV=test')
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
  return getInventory().all.hosts
}

const tests = [
  {
    name: 'localTransfer',
    shell: `${remotePreCommand} REMOTE=true node ${remoteTestsPath}/local-transfer.js`,
    localShell: `${params} node ${path.join(__dirname, '/../tests/local-transfer.js')}`
  },
  {
    name: 'unixFS-add',
    shell: `${remotePreCommand} REMOTE=true node ${remoteTestsPath}/local-add.js`,
    localShell: `${params} node ${path.join(__dirname, '/../tests/local-add.js')}`
  },
  {
    name: 'unixFS-extract',
    shell: `${remotePreCommand} REMOTE=true node ${remoteTestsPath}/local-extract.js`,
    localShell: `${params} node ${path.join(__dirname, '/../tests/local-extract.js')}`
  }
]

const config = {
  provison: {
    command: `ansible-playbook -i ${inventoryPath} ${playbookPath}`
  },
  log: pino,
  stage: process.env.STAGE || 'local',
  outFolder: process.env.OUT_FOLDER || '/tmp/out',
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
    path: path.join(__dirname, '../tests'),
    remotePath: remoteTestsPath,
    tests: tests
  }
}

module.exports = config
