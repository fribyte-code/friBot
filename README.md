# friBot

This repository contians the source code for the friBot on Mattermost.

## Getting started

1. Install [Bun](https://bun.sh/) (JavaScript runtime-alternative to Node.js)
1. Install node modules: `bun install`
1. Copy `.env.example` to `.env`, using: `cp .env.example .env`.
1. Add the `TOKEN` in your `.env`-file.
1. If deploying to production, change `NODE_ENV` in your `.env`-file to `"production"`
1. Start bot using: `bun run start`

## Configuration file

There is a config file set up, [config.ts](./config.ts).
