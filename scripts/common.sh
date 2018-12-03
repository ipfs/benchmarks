#!/bin/bash

# Usage info
usage() {
  FILESTRING="/infrastructure/deploy/docker-compose.yaml"
  if [ "$1" = "prod" ];then
    FILESTRING+=" plus overrides from /infrastructure/deploy/docker-compose.prod.yaml"
  fi
cat << EOF

Usage: ${0##*/} [COMMAND]

Run a docker-compose COMMAND for local puposes using the compose file
$FILESTRING
    COMMAND   any of the supported COMMANDs from https://docs.docker.com/compose/reference/overview/

EOF
}

checkParam () {
  if [ -z "$1" ]; then
    usage $MODE
    exit 1
  else
    OP=$1
  fi
}

FILES="-f $SCRIPTPATH/../infrastructure/deploy/docker-compose.yaml -f $SCRIPTPATH/../infrastructure/deploy/docker-compose.prod.yaml"
