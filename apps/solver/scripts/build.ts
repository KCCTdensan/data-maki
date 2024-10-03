import { join } from "node:path";
import typia from "@ryoppippi/unplugin-typia/bun";

console.info("Building solver...");
console.time("Finished building solver");

const result = await Bun.build({
  entrypoints: ["./src/index.ts"],
  splitting: true,
  sourcemap: "linked",
  plugins: [
    typia({
      log: false,
    }),
  ],
  minify: true,
  target: "bun",
  define: {
    "process.env.NODE_ENV": '"production"',
  },
});

if (!result.success) {
  console.error("Failed to build solver");

  for (const message of result.logs) {
    console.error(message);
  }
}

await Promise.all(
  result.outputs
    .map((output) => [output.path, new Response(output)] as const)
    .map(([path, res]) => Bun.write(join("dist", path), res)),
);

console.timeEnd("Finished building solver");
