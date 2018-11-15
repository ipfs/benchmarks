const fs = require('fs')
const path = require('path')
const YAML = require('yaml')

const getInventory = () => {
  return YAML.parse(fs.readFileSync(path.join(__dirname,'../infrastructure/inventory/inventory.yaml'), 'utf8'))
}

const getBenchmarkHostname = () => {
  return getInventory().all.hosts
}

const config = {
  influxdb: {
    host: process.env.INFLUX_HOST || 'localhost',
    db: 'benchmarks',
    schema: [
      {
        measurement: measurement,
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
    tests: [
      {
        name: 'Local transfer',
        measurement:  'local_transfer',
        shell: 'rm -Rf /tmp/peerb && source ~/.nvm/nvm.sh && node ipfs/tests/local-transfer.js',
        localShell: 'node $(PWD)/../benchmarks/tests/local-transfer.js'
      }
    ]
  }
}

module.exports = config