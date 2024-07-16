import * as process from "node:process";
import typia from "@ryoppippi/unplugin-typia/bun";

const result = await Bun.build({
  entrypoints: ["./src/index.ts"],
  splitting: false,
  plugins: [
    typia({
      log: false,
    }),
  ],
  minify: true,
});

if (!result.success) {
  console.error(result.logs);

  process.exit(1);
}

const output = await result.outputs[0]?.text();

if (!output) {
  console.error("No output");

  process.exit(1);
}

const path = Bun.file("./dist/_worker.js");

await Bun.write(path, output);
