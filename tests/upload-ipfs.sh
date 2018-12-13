#!/bin/bash

OUTPATH=$1
TESTNAME=$2

# Usage info
usage() {
cat << EOF

Usage: ${0##*/} <ouputPath> <TestName>

Upload a directory to ipfs and store the SHA in a json file at <ouput path>/<Test name>.json

    outputPath    something like '/tmp/out'
    TestName      something like 'localAdd'

EOF
}

if [ -z "$TESTNAME" ] || [ -z "$OUTPATH" ]
then
  usage
  exit 1
fi

# doesn't work yet
# ipfs-cluster-ctl --host /dnsaddr/cluster.ipfs.io --basic-auth $IPFSUSER:$IPFSPWD add /tmp/out/$TESTNAME
SHA="c3ab8ff13720e8ad9047dd39466b3c8974e592c2fa383d4a3960714caef0c4f2"
mkdir -p $OUTPATH
# echo some sha for now
echo "Writing IPFS sha to $OUTPATH/$TESTNAME.json"
echo "{ \"sha\": \"$SHA\" }" > $OUTPATH/$TESTNAME.json