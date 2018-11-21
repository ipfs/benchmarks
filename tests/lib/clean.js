'use strict'

const rimraf = require('rimraf')
const repoPath = '.tmp/.ipfs'

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
