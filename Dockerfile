# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
# Base image 65MB
# Alpine image 40MB
FROM oven/bun:1-alpine AS base
WORKDIR /usr/src/app

COPY . .

RUN bun install

# run the app
ENTRYPOINT [ "bun", "run", "start" ]
