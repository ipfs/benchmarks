'use strict'

const config = require('./config')

const retrieveCommand = () => {

  try {
    return JSON.parse(strResult)
  } catch (e) {
    throw e
  }
}