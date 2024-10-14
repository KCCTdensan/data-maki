import type { tags } from "typia";
import type { Answer } from "./answer";
import type { Problem } from "./problem";

export interface CellsMarkLine {
  type: "row" | "column";
  index: number & tags.Type<"uint32">;
}

export interface CellsMarkPoint {
  type: "point";
  index: number & tags.Type<"uint32">; // y
  index2: number & tags.Type<"uint32">; // x
}

export type CellsMark = CellsMarkLine | CellsMarkPoint;

export interface ExtraOpInfo {
  currentMark: CellsMark;
  goalMark: CellsMark;
  delta?: (Array<number & tags.Type<"uint32">> & tags.MinItems<4> & tags.MaxItems<4>) | null;
}

export interface ReplayInfo {
  problem: Problem;
  answer: Answer;
  extraInfo: ExtraOpInfo[];
}
