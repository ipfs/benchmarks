'use strict'

const rimraf = require('rimraf')
const { repoPath } = require('../package.json').config

const peerRepos = () => {
  rimraf(repoPath, function () {
    console.log(`Removed ${repoPath}`)
  })
}

const all = () => {
  peerRepos()
}

module.exports = {
  peerRepos,
  all
}
