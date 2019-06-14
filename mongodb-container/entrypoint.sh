#!/bin/sh
set -e -x

# is it a first time start (folder count)
FILES_FOLDERS_COUNT=$(ls -1 /home/data/db | wc -l)

# if it's the first time, don't run auth
if [ $FILES_FOLDERS_COUNT -eq 0 ]; then
    mongod --dbpath=/home/data/db
else
    mongod --auth --dbpath=/home/data/db
fi
