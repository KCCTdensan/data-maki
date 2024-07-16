# Data maki

> 寿司が好きなコンピューターは何て言うか知ってる？  
  「データ巻き」ってね。

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `backend`: a Hono mock server
- `frontend`: a Remix frontend
- `@data-maki/biome-config`: `biome` configurations
- `@data-maki/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Setup

To get started, clone the repository and install the dependencies:

```
bun install
```

### Utilities

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [Biome](https://biomejs.dev) for code linting and formatting

### Build

To build all apps and packages, run the following command:

```
bun build
```

### Develop

To develop all apps and packages, run the following command:

```
bun dev
```

### Remote Caching

Turborepo can use a technique known as [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup), then enter the following commands:

```
bun turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
bun turbo link
```
