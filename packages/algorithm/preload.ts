import typia from "@ryoppippi/unplugin-typia/bun";
import { plugin } from "bun";

plugin(
  typia({
    cache: false,
    log: false,
  }),
);
