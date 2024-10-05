# Data maki frontend

Data maki UI frontend using Remix.

This app uses SPA Mode and fully works on client-side.

## Structure

- `src`: Source code
  - `src/app`: React-specific code and routes
  - `src/lib`: Utility functions
  - `src/atoms`: Jotai atoms
- `public`: Public assets

## Setup

Follow the root monorepo README.md for setup instructions.

## Develop

Follow the root monorepo README.md for development instructions.

## Deploy

This app uses Cloudflare Pages for deployment.
To deploy to production, push to the `main` branch.

Alternatively, you can deploy with `CF_ACCOUNT_ID` environment variable and logged-in Wrangler:

```sh
bun run deploy
```
