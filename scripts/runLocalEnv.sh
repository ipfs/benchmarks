#!/bin/bash

MODE=local
SCRIPTPATH=$(dirname "$0")
source $SCRIPTPATH/common.sh
checkParam $1


mkdir -p $SCRIPTPATH/../data
docker-compose -f $SCRIPTPATH/../infrastructure/deploy/docker-compose.yaml $OP