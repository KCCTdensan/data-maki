import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  splitting: false,
  sourcemap: true,
  dts: true,
  clean: true,
  define: {
    "process.env.NODE_ENV": '"production"',
  },
});
