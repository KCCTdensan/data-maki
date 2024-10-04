import typia from "@ryoppippi/unplugin-typia/bun";

console.info("Building solver...");
console.time("Finished building solver");

await Bun.build({
  entrypoints: ["./src/index.ts"],
  splitting: true,
  sourcemap: "linked",
  plugins: [
    typia({
      log: false,
    }),
  ],
  minify: true,
  outdir: "./dist",
  target: "bun",
  define: {
    "process.env.NODE_ENV": '"production"',
  },
});

console.timeEnd("Finished building solver");
