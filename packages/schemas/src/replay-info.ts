import type { tags } from "typia";
import type { Answer } from "./answer";
import type { Problem } from "./problem";

export interface ExtraOpInfo {
  type: "row" | "column";
  index: number & tags.Type<"uint32">;
  delta: Array<number & tags.Type<"uint32">> & tags.MinItems<4> & tags.MaxItems<4>;
}

export interface ReplayInfo {
  problem: Problem;
  answer: Answer;
  extraInfo: ExtraOpInfo[];
}
