import { cloudflareDevProxyVitePlugin, vitePlugin as remix } from "@remix-run/dev";
import typia from "@ryoppippi/unplugin-typia/vite";
import { flatRoutes } from "remix-flat-routes";
import { remixRoutes } from "remix-routes/vite";
import { defineConfig } from "vite";
import { denyImports, envOnlyMacros } from "vite-env-only";
import env from "vite-plugin-env-compatible";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  build: {
    minify: true,
    sourcemap: true,
  },
  envPrefix: "SOLVER_",
  plugins: [
    cloudflareDevProxyVitePlugin(),
    remix({
      appDirectory: "src/app",
      buildDirectory: "dist",
      ignoredRouteFiles: ["**/*"],
      ssr: false,
      routes: async (defineRoutes) =>
        flatRoutes("routes", defineRoutes, {
          appDir: "src/app",
        }),
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
    }),
    remixRoutes(),
    tsconfigPaths(),
    denyImports({
      client: {
        specifiers: [/^node:/],
        files: ["**/.server/*", "**/*.server.*"],
      },
      server: {
        files: ["**/.client/*", "**/*.client.*"],
      },
    }),
    envOnlyMacros(),
    typia({
      log: false,
    }),
    env({ prefix: "SOLVER", mountedPath: "process.env" }),
  ],
  ssr: {
    resolve: {
      conditions: ["workerd", "worker", "browser"],
    },
  },
  resolve: {
    mainFields: ["browser", "module", "main"],
  },
});
