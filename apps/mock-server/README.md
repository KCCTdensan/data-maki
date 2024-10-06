# Data maki mock server

Data maki mock server using Hono.

## Structure

- `src`: source code
  - `src/index.ts`: Entry point

## Setup

This app has `.env` file for setting some information.
Copy `.env.example` to `.env.local` and edit the file.

```
SERVER_URL=http://localhost:4000
SERVER_TOKEN=token1
```

## Develop

Follow the root monorepo README.md for development instructions.

This app starts server with Hot Module Replacement (HMR) enabled, restart the `dev` script entirely if you see any issues.

## Running

Edit `resources/input.json` to change the default data that will be used by the server.

Alternatively, you can use file path as an argument to the server.

```bash
bun run src/index.ts foo.json
```
