import typia from "@ryoppippi/unplugin-typia/bun";
import { plugin } from "bun";

console.info("Preload...");
console.time("Preload done");

plugin(
  typia({
    log: false,
    cache: false,
  }),
);

console.timeEnd("Preload done");
