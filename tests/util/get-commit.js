'use strict'


const path = require('path')
const util = require('util')
const execute = util.promisify(util.promisify(require('child_process').exec))
var appDir = path.dirname(require.main.filename)

const shell = async (command) => {
  const out = await execute(command)
  return out
}
const getIpfsCommit = async () => {
  const out = await shell(`${appDir}/util/getCommit.sh ${appDir}/../../`)
  return out.stdout
}
const getBranchName = async () => {
  const out = await shell(`${appDir}/util/getBranch.sh ${appDir}/../../`)
  return out.stdout
}
module.exports = {
  getIpfsCommit,
  getBranchName }
