
var util = require('util')
require('util.promisify').shim()
const getId = async (node, delta, state) => {
  const id = util.promisify(node.id)
  const res = await id()
  const results = { ...state }
  results.id = res.id
  results.version = res.agentVersion
  results.protocol_version = res.protocolVersion
  results.time_s = delta[0]
  results.time_ms = delta[1]
  results.ready = 'ready'
  return results
}

export default getId
