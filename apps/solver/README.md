# Data maki solver

Data maki problem solver using Hono.

This app uses state machine and features modular architecture, communicates with UI using SSE (Server Sent Events).

## Structure

- `src`: source code
  - `src/index.ts`: Entry point
  - `src/features`: Feature modules
  - `src/events`: SSE event definition
  - `src/state`: State machine definition

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

## Deploy

This app builds standalone binary with `Bun.build`. To deploy the binary, move the binary to the server and run it.

Environment variables can also be set with `.env` file.
