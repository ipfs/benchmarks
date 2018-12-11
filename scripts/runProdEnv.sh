#!/bin/bash

MODE=prod
SCRIPTPATH=$(dirname "$0")
source $SCRIPTPATH/common.sh
checkParam $1

docker-compose $FILES $OP