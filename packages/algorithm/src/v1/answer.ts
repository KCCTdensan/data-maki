import type { Ops } from "@data-maki/schemas";
import type { Context } from "./types";

export const addOps = (c: Context, ops: Ops) => {
  c.n += 1;
  c.ops.push(ops);
};
