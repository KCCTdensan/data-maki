import typia from "@ryoppippi/unplugin-typia/esbuild";
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  splitting: false,
  sourcemap: true,
  dts: true,
  clean: true,
  plugins: [typia()],
});