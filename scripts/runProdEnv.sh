#!/bin/bash

MODE=prod
SCRIPTPATH=$(dirname "$0")
source $SCRIPTPATH/common.sh

docker-compose -f $SCRIPTPATH/../infrastructure/deploy/docker-compose.yaml -f $SCRIPTPATH/../infrastructure/deploy/docker-compose.prod.yaml $OP -d