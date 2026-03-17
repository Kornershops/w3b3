#!/bin/bash
set -e

# Remove workspaces from root package.json temporarily
cd /opt/build/repo
jq 'del(.workspaces)' package.json > package.json.tmp
mv package.json.tmp package.json

# Install and build frontend
cd frontend
npm install --legacy-peer-deps
npm run build
