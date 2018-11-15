#!/bin/bash

HOST=$(sed -n '/hosts:/{n;p;}' infrastructure/inventory/inventory.yaml | tr -d '[:space:]')
NVM_PATH='source ~/.nvm/nvm.sh'
TEST='node ipfs/tests/local-transfer.js'
RM_CACHE='rm -Rf /tmp/peera && rm -Rf /tmp/peerb'
OP=$1
if [ -z "$OP" ]; then
  echo "provide clinic operation [doctor,flame,bubbleprof] as first argument"
  exit 1
fi
COMMAND="${RM_CACHE} && ${NVM_PATH} && clinic ${OP} -- ${TEST}"

ssh ${HOST} "( ${COMMAND} )"
UPLOAD=$(echo $(!!) | grep "clinic upload")
ssh ${HOST} "( ${NVM_PATH} && ${UPLOAD} )"
