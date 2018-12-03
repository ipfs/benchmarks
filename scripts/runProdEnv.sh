#!/bin/bash

MODE=prod
SCRIPTPATH=$(dirname "$0")
source $SCRIPTPATH/common.sh
checkParam

docker-compose $FILES $OP