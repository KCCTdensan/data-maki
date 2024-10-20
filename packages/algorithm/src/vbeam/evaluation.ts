import { type CellCounts, type Context, LEFT, type Point, UP } from "../types";
import { countElementsColumnWise, getDelta } from "../utils/board";
import { dbg } from "../workers/log";
import { katanukiBoard } from "./katanuki";

export const evaluateRow = (c: Context, p: number, pp: Point, goalElementCounts: CellCounts) => {
  const board = katanukiBoard(c, p, pp.x, pp.y, UP, c.board);
  const elementCounts = countElementsColumnWise(board, c.worker);
  const delta = getDelta(elementCounts[c.height - 1], goalElementCounts);

  let value = 0;

  for (const i of delta) {
    if (i >= 0) value += i;
  }

  dbg(c.worker, `evaluate: p = ${p}, evaluation = ${value}`);

  return value;
};
