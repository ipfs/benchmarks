'use strict'

const fs = require('fs')
const path = require('path')
const YAML = require('yaml')
const Influx = require('influx')
const Pino = require('pino')
let pino = {}

const inventoryPath = path.join(__dirname, '../infrastructure/inventory/inventory.yaml')
const playbookPath = path.join(__dirname, '../infrastructure/playbooks/benchmarks.yaml')
const remoteTestsPath = process.env.REMOTE_FOLDER || '~/ipfs/tests/'

// pretty logs in local
if (process.env.LOG_PRETTY === 'true') {
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
    name: 'Local transfer',
    measurement: 'local_transfer',
    shell: `rm -Rf /tmp/peerb && source ~/.nvm/nvm.sh && node ${remoteTestsPath}/local-transfer.js`,
    localShell: 'node ' + path.join(__dirname, '/../tests/local-transfer.js')
  }
]

const config = {
  provison: {
    command: `ansible-playbook -i ${inventoryPath} ${playbookPath}`
  },
  log: pino,
  stage: process.env.STAGE || 'local',
  influxdb: {
    host: process.env.INFLUX_HOST || 'localhost',
    db: 'benchmarks',
    schema: [
      {
        measurement: tests[0].measurement,
        fields: {
          filesize: Influx.FieldType.FLOAT,
          duration: Influx.FieldType.INTEGER
        },
        tags: [
          'commit',
          'project'
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
