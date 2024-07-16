import typia from "@ryoppippi/unplugin-typia/bun";
import { plugin } from "bun";

plugin(
  typia({
    log: false,
  }),
);
