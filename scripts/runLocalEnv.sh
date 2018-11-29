#!/bin/bash

MODE=local
SCRIPTPATH=$(dirname "$0")
source $SCRIPTPATH/common.sh

docker-compose -f $SCRIPTPATH/../infrastructure/deploy/docker-compose.yaml $OP