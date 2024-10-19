import { Glob } from "bun";
import { wasmLoader } from "esbuild-plugin-wasm";
import { defineConfig } from "tsup";

const entry: string[] = [];

for await (const workerEntry of new Glob("src/workers/*.worker.ts").scan()) {
  entry.push(workerEntry);
}

export default defineConfig({
  entry,
  format: ["esm"],
  splitting: false,
  sourcemap: true,
  clean: true,
  outDir: "dist/workers",
  define: {
    "process.env.NODE_ENV": '"production"',
  },
  esbuildPlugins: [wasmLoader()],
});
