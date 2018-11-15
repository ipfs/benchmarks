#!/bin/bash

HOST=$(sed -n '/hosts:/{n;p;}' infrastructure/inventory/inventory.yaml | tr -d '[:space:]')
TEST='node ipfs/tests/local-transfer.js'
NVM_PATH='source ~/.nvm/nvm.sh'
RM_CACHE='rm -Rf /tmp/peerb'

ssh ${HOST} "( ${RM_CACHE} && ${NVM_PATH} && ${TEST} )"
