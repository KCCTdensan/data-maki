# Data maki

> 寿司が好きなコンピューターは何て言うか知ってる？  
> 「データ巻き」ってね。

## Apps and Packages

- [`frontend`](apps/frontend): a Remix frontend
- [`solver`](apps/solver): a Hono solver
- [`mock-server`](apps/mock-server): a Hono mock server
- [`@data-maki/algorithm`](packages/algorithm): Main algorithm implementation
- [`@data-maki/schemas`](packages/schemas): Typia schemas used throughout the monorepo
- [`@data-maki/biome-config`](packages/biome-config): `biome` configurations
- [`@data-maki/typescript-config`](packages/typescript-config): `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

## Setup

To get started, clone the repository and install the dependencies:

```
bun install
```

## Utilities

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [Biome](https://biomejs.dev) for code linting and formatting

## Build

To build all apps and packages, run the following command:

```
bun build
```

## Develop

To develop all apps and packages, run the following command:

```
bun dev
```

## Linting

To lint all apps and packages, run the following command:

```
bun lint
```

## Formatting

To format all apps and packages, run the following command:

```
bun format
```
