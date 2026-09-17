#!/bin/sh
set -e
cd /app

if [ ! -f node_modules/next/package.json ]; then
  echo "==> Installing npm packages into the node_modules volume..."
  npm ci
fi

exec "$@"
