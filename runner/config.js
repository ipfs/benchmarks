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
const params = 'OUT_FOLDER=/tmp/out '
const remotePreNode = `source ~/.nvm/nvm.sh && ${params}`
const HOME = process.env.HOME || process.env.USERPROFILE
const keyfile = path.join(HOME, '.ssh', 'id_rsa')

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
  pino.info(getInventory())
  return getInventory().all.children.minions.hosts
}

const tests = [
  {
    name: 'localTransfer',
    shell: `${remotePreNode} REMOTE=true node ${remoteTestsPath}/local-transfer.js`,
    localShell: `${params} node ${path.join(__dirname, '/../tests/local-transfer.js')}`
  },
  {
    name: 'unixFS-add',
    shell: `${remotePreNode} REMOTE=true node ${remoteTestsPath}/local-add.js`,
    localShell: `${params} node ${path.join(__dirname, '/../tests/local-add.js')}`
  },
  {
    name: 'unixFS-extract',
    shell: `${remotePreNode} REMOTE=true node ${remoteTestsPath}/local-extract.js`,
    localShell: `${params} node ${path.join(__dirname, '/../tests/local-extract.js')}`
  }
]

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
    tests: tests
  },
  ipfs: {
    path: remoteIpfsPath
  }
}

module.exports = config
