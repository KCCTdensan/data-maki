# Data maki mock server

Data maki mock server using Hono.

## Structure

- `src`: source code
  - `src/index.ts`: Entry point

## Setup

Follow the root monorepo README.md for setup instructions.

## Develop

Follow the root monorepo README.md for development instructions.

This app starts server with Hot Module Replacement (HMR) enabled, restart the `dev` script entirely if you see any issues.

## Running

Edit `resources/input.json` to change the default data that will be used by the server.

Alternatively, you can use file path as an argument to the server.

```bash
bun run src/index.ts foo.json
```
