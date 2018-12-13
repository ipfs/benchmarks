'use strict'

var exec = require('child_process').exec
const path = require('path')
const util = require('util')
const execute = util.promisify(exec)
var appDir = path.dirname(require.main.filename)

const shell = async (command) => {
  console.log(await execute(command))
}
const getIpfsCommit = () => {
  shell(`${appDir}/gtCommit.sh ${appDir}/../../`)
}
const getBrancName = () => {
  shell(`${appDir}/getBranch.sh ${appDir}/../../`)
}
module.exports = { getIpfsCommit, getBrancName }
