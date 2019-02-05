'use strict'

const fs = require('fs')
const os = require('os')
const path = require('path')
const YAML = require('yaml')
const Influx = require('influx')
const Pino = require('pino')
const PinoPretty = require('pino-pretty')
const pinoms = require('pino-multi-stream').multistream
const PinoGetPrettyStream = require('pino/lib/tools').getPrettyStream
const uuidv1 = require('uuid/v1')
const util = require('util')
const mkDir = util.promisify(fs.mkdir)

let pino

const inventoryPath = process.env.INVENTORY || path.join(__dirname, '../infrastructure/inventory/inventory.yaml')
const playbookPath = path.join(__dirname, '../infrastructure/playbooks/benchmarks.yaml')
const remoteTestsPath = process.env.REMOTE_FOLDER || '~/ipfs/tests/'
const remoteIpfsPath = process.env.REMOTE_FOLDER || '~/ipfs/'
const tmpOut = '/tmp/out'
const params = `OUT_FOLDER=${tmpOut} REMOTE=true GUID=${uuidv1()} `
const remotePreNode = `killall node 2>/dev/null; killall ipfs 2>/dev/null; source ~/.nvm/nvm.sh && `
const HOME = process.env.HOME || process.env.USERPROFILE
const keyfile = path.join(HOME, '.ssh', 'id_rsa')
const tests = []
const locations = ['local', 'remote']
const clinicOperations = ['doctor', 'flame', 'bubbleProf']
const memorySuffix = '_memory'

const ipfsAddress = process.env.IPFS_ADDRESS || '/dnsaddr/cluster.ipfs.io'
const ipfsUser = process.env.IPFS_USER || 'ipfsbenchmarks'
const ipfsPassword = process.env.IPFS_PASSWORD || false
const now = Date.now()
const logDir = `${os.tmpdir()}/${now}`
const logFile = `${logDir}/stdout.log`

mkDir(`${logDir}`, { recursive: true })

// pretty logs in local
if (process.env.NODE_ENV === 'test') {
  pino = Pino({
    enabled: false
  })
} else {
  let streams
  if (process.env.LOG_PRETTY && process.env.LOG_PRETTY === 'true') {
    let prettyStream = PinoGetPrettyStream({
      levelFirst: false,
      translateTime: true,
      colorize: true
    }, PinoPretty, process.stdout)

    streams = [
      { stream: fs.createWriteStream(logFile) },
      { stream: prettyStream }
    ]
  } else {
    streams = [
      { stream: fs.createWriteStream(logFile) },
      { stream: process.stdout }
    ]
  }
  pino = Pino({ name: 'runner' }, pinoms(streams))
}
pino.info(`logFile: ${logFile}`)

const getInventory = () => {
  return YAML.parse(fs.readFileSync(inventoryPath, 'utf8'))
}

const getBenchmarkHostname = () => {
  return getInventory().all.children.minions.hosts
}

const getCommand = (test, loc) => {
  return `${loc === 'remote' ? remotePreNode : ''} ${testDefaults.params} node ${testDefaults.path[loc]}/${test.file}`
}

const getClinicCommands = (test, operation, loc) => {
  if (locations.includes(loc) && clinicOperations.includes(operation)) {
    let variations = []
    for (let fileSet of clinicRuns[operation].fileSets) {
      let shellCommand = `${loc === 'remote' ? remotePreNode : ''} FILESET="${fileSet}" clinic ${operation} --dest ${tmpOut}/${test.name}/ -- node ${testDefaults.path[loc]}/${test.file}`
      variations.push({
        command: shellCommand,
        fileSet: fileSet,
        benchmarkName: test.name,
        operation: operation
      })
    }
    return variations
  } else {
    throw Error(`getClinicCommands requires an operation from ${clinicOperations} and a location from ${locations}`)
  }
}

const clinicRuns = {
  doctor: {
    fileSets: ['One4MBFile', 'One64MBFile']
  },
  flame: {
    fileSets: ['One4MBFile', 'One64MBFile']
  },
  bubbleProf: {
    fileSets: ['One4MBFile']
  }
}

const testDefaults = {
  path: {
    remote: remoteTestsPath,
    local: path.join(__dirname, '/../tests')
  },
  params: params,
  remotePreCommand: remotePreNode
}

const testAbstracts = [
  {
    name: 'localTransfer_tcp_mplex',
    file: 'local-transfer.js -t tcp -m mplex'
  },
  {
    name: 'localTransfer_ws_mplex',
    file: 'local-transfer.js -t ws -m mplex'
  },
  {
    name: 'localTransfer_ws_mplex',
    file: 'local-transfer.js -t ws -m mplex'
  },
  {
    name: 'localTransfer_tcp_mplex_secio',
    file: 'local-transfer.js -t tcp -m mplex -e secio'
  },
  {
    name: 'localTransfer_ws_mplex_secio',
    file: 'local-transfer.js -t ws -m mplex -e secio'
  },
  {
    name: 'localTransfer_tcp_spdy',
    file: 'local-transfer.js -t tcp -m spdy'
  },
  {
    name: 'localTransfer_ws_spdy',
    file: 'local-transfer.js -t ws -m spdy'
  },
  {
    name: 'localTransfer_tcp_spdy_secio',
    file: 'local-transfer.js -t tcp -m spdy -e secio'
  },
  {
    name: 'localTransfer_ws_spdy_secio',
    file: 'local-transfer.js -t ws -m spdy -e secio'
  },
  {
    name: 'unixFsAdd_balanced',
    file: 'local-add.js -s balanced'
  },
  {
    name: 'unixFsAdd_trickle',
    file: 'local-add.js -s trickle'
  },
  {
    name: 'localExtract',
    file: 'local-extract.js'
  },
  {
    name: 'multiPeerTransfer_tcp_mplex',
    file: 'multi-peer-transfer.js -t tcp -m mplex'
  },
  {
    name: 'multiPeerTransfer_ws_mplex',
    file: 'multi-peer-transfer.js -t ws -m mplex'
  },
  {
    name: 'multiPeerTransfer_ws_mplex',
    file: 'multi-peer-transfer.js -t ws -m mplex'
  },
  {
    name: 'multiPeerTransfer_tcp_mplex_secio',
    file: 'multi-peer-transfer.js -t tcp -m mplex -e secio'
  },
  {
    name: 'addMultiKb',
    file: 'add-multi-kb.js'
  },
  {
    name: 'addMultiKbTrickle',
    file: 'add-multi-kb.js trickle'
  },
  {
    name: 'initializeNodeBrowser',
    file: 'init-node.browser.js'
  },
  {
    name: 'unixFsAddBrowser',
    file: 'local-add.browser.js'
  },
  {
    name: 'addMultiKbBrowser',
    file: 'add-multi-kb.browser.js'
  },
  {
    name: 'unixFsAddGo',
    file: 'local-add.go.js'
  },
  {
    name: 'peerTransferBrowser',
    file: 'peer-transfer.browser.js'
  },
  {
    name: 'pubsubMessage',
    file: 'pubsub-message.js'
  }
]

for (let test of testAbstracts) {
  let loc = 'remote'
  if (process.env.STAGE === 'local') {
    loc = 'local'
  }
  tests.push({
    name: test.name,
    benchmark: getCommand(test, loc),
    doctor: getClinicCommands(test, 'doctor', loc),
    flame: getClinicCommands(test, 'flame', loc),
    bubbleProf: getClinicCommands(test, 'bubbleProf', loc)
  })
}

const runClinic = (process.env.CLINIC && (process.env.CLINIC === 'ON' || process.env.CLINIC === true)) || false

const config = {
  provison: {
    command: `ansible-playbook -i ${inventoryPath} --key-file ${keyfile} ${playbookPath}`
  },
  log: pino,
  stage: process.env.STAGE || 'local',
  outFolder: process.env.OUT_FOLDER || tmpOut,
  dataDir: process.env.DATADIR || './data/',
  logFile: logFile, // where we store all the stuff that is to be sent to IPFS
  now: now,
  db: 'ipfs-db',
  server: {
    port: 9000,
    apikey: process.env.API_KEY || 'supersecret'
  },
  influxdb: {
    host: process.env.INFLUX_HOST || 'localhost',
    db: 'benchmarks',
    schema: [
      {
        measurement: tests[0].measurement,
        fields: {
          duration: Influx.FieldType.FLOAT,
          ipfs_sha: Influx.FieldType.STRING
        },
        tags: [
          'warmup',
          'commit',
          'project',
          'file_set',
          'branch',
          'guid',
          'version',
          'repo',
          'sha',
          'nightly'
        ]
      },
      {
        measurement: `${tests[0].measurement}${memorySuffix}`,
        fields: {
          memory: Influx.FieldType.INTEGER,
          ipfs_sha: Influx.FieldType.STRING
        },
        tags: [
          'warmup',
          'commit',
          'project',
          'file_set',
          'branch',
          'guid',
          'version',
          'repo',
          'sha',
          'nightly'
        ]
      }
    ]
  },
  benchmarks: {
    clinic: runClinic,
    host: getBenchmarkHostname(),
    user: process.env.BENCHMARK_USER || 'elexy',
    key: process.env.BENCHMARK_KEY || keyfile,
    path: path.join(__dirname, '../tests'),
    remotePath: remoteTestsPath,
    tests: tests,
    cleanup: `rm -Rf ${tmpOut}/*`,
    measurements: {
      memory: memorySuffix
    }
  },
  ipfs: {
    path: remoteIpfsPath,
    network: {
      address: ipfsAddress,
      user: ipfsUser,
      password: ipfsPassword
    }
  }
}

config.log.debug(config.benchmarks.tests)

module.exports = config
