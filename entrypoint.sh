#!/bin/bash
set -e

nginx
# npm start
pm2 start pm2.json
