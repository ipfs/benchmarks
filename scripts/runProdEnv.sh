#!/bin/bash

docker-compose -f infrastructure/deploy/docker-compose.yaml -f infrastructure/deploy/docker-compose.prod.yaml up -d