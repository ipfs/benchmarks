#!/bin/bash

TESTNAME=$1

if [ -z "$TESTNAME" ]
then
  echo "Please provide the name of the test as the first argument: 'upload-ipfs.sh localAdd' "
  exit 1
fi

# doesn't work yet
# ipfs-cluster-ctl --host /dnsaddr/cluster.ipfs.io --basic-auth $IPFSUSER:$IPFSPWD add /tmp/out/$TESTNAME

# echo some sha for now
echo c3ab8ff13720e8ad9047dd39466b3c8974e592c2fa383d4a3960714caef0c4f2