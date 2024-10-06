import typia from "@ryoppippi/unplugin-typia/bun";
import { bunPluginPino } from "bun-plugin-pino";

console.time("Finished building solver");

await Bun.build({
  entrypoints: ["./src/index.ts"],
  splitting: true,
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

console.timeEnd("Finished building solver");
