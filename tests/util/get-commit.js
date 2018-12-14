'use strict'

const util = require('util')
const execute = util.promisify(util.promisify(require('child_process').exec))

const shell = async (command) => {
  const out = await execute(command)
  return out
}
const getIpfsCommit = async () => {
  const out = await shell(`${__dirname}/getCommit.sh ${__dirname}/../../`)
  return out.stdout.replace(/\n$/, '')
}
const getBranchName = async () => {
  const out = await shell(`${__dirname}/getBranch.sh ${__dirname}/../../`)
  return out.stdout.replace(/\n$/, '')
}
module.exports = {
  getIpfsCommit,
  getBranchName }
