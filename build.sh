#!/bin/bash

## TIP: `chmod 777 ./build.sh` - If it doesn't work. Use sudo

## Start the processes
echo "Starting..."
docker-compose build
docker-compose up -d
