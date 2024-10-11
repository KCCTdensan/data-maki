import type { Problem } from "@data-maki/schemas";
import type { tags } from "typia";

export interface Config {
  teams: string[];
  duration: number & tags.Type<"uint32">;
  problem: Problem;
}
