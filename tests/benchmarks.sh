#!/bin/bash

#!  Add 100 1 KB files to local  
node add-multi-kb
#! Initialize node without pre-generated key 
node init-node
#! Add file to local repo using unixFS engine 
node local-add
#! Get file to local repo 
node local-extract
#! Transfer file between two local nodes 
node local-transfer
#! transfer files from 4 nodes
node multi-peer-transfer
