import { mkdir, stat } from "node:fs/promises";
import * as path from "node:path";
import typia from "@ryoppippi/unplugin-typia/bun";
import { Glob } from "bun";
import { bunPluginPino } from "bun-plugin-pino";

const mkdirp = async (dir: string) => {
  const exists = await Bun.file(dir).exists();

  if (!exists) {
    await mkdir(dir, { recursive: true });
  }
};

const copyFiles = async (from: string[], to: string) => {
  const toIsDir = (await stat(to)).isDirectory();

  for (const [fname, file] of from.map((f) => [path.basename(f), Bun.file(f)] as const)) {
    if (toIsDir) {
      await Bun.write(`${to}/${fname}`, file);
    } else {
      await Bun.write(to, file);
    }
  }
};

console.time("Finished building solver");

const results = await Bun.build({
  entrypoints: ["./src/index.ts"],
  sourcemap: "linked",
  plugins: [
    typia({
      log: false,
    }),
    bunPluginPino({
      transports: ["pino-pretty", "pino-roll"],
    }),
  ],
  minify: true,
  outdir: "./dist",
  target: "bun",
  define: {
    "process.env.NODE_ENV": '"production"',
  },
});

if (!results.success) {
  console.error("Failed to build solver");
  console.error(results.logs);

  process.exit(1);
}

console.log("Copying files...");

const files = await Array.fromAsync(new Glob("../../packages/algorithm/dist/workers/*.worker.js*").scan());
const wasmFiles = await Array.fromAsync(new Glob("../../packages/algorithm/dist/workers/*.wasm").scan());
await mkdirp("./dist/workers");
await copyFiles(files, "./dist/workers");
await copyFiles(wasmFiles, "./dist");

console.timeEnd("Finished building solver");
