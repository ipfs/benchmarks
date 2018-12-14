#!/bin/bash

IPFS_PATH=$1

cd ${IPFS_PATH}
if [ -d js-ipfs/.git ]
then
  cd js-ipfs
  git rev-parse HEAD
else 
  echo "no commit"
fi


