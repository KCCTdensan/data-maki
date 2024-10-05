import typia from "@ryoppippi/unplugin-typia/bun";

console.time("Finished building mock server");

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

console.timeEnd("Finished building mock server");
