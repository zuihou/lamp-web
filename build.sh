#!/usr/bin/env bash
cnpm install
npm run build:docker

docker build -t zuihou-ui .
