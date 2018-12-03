#!/bin/sh

# get Host IP so we can route traffic for the runner to it
hostip=$(ip route show | awk '/default/ {print $3}')
echo "Host ip = $hostip"
# add host to /etc/hosts as "runner" so nginx can send traffic to it.
echo "$hostip  runner" >> /etc/hosts
cat /etc/hosts

exec nginx -g 'daemon off;'