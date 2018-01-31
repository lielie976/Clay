#!/bin/bash
set -e

nginx
npm start
# pm2-docker start pm2.json
# pm2-docker reload all
