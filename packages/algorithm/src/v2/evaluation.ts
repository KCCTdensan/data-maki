import { katanukiBoard } from "../katanuki";
import { type CellCounts, type Context, LEFT, type Point, UP } from "../types";
import { countElementsColumnWise, getDelta } from "../utils/board";
import { dbg } from "../workers/log";

export const evaluateRow = (c: Context, p: number, pp: Point, goalElementCounts: CellCounts) => {
  const board = katanukiBoard(c, p, pp.x, pp.y, UP);
  const elementCounts = countElementsColumnWise(board, c.worker);
  const delta = getDelta(elementCounts[c.height - 1], goalElementCounts);

  let value = 0;

  for (const i of delta) {
    if (i >= 0) value += i;
  }

  dbg(c.worker, `evaluate: p = ${p}, evaluation = ${value}`);

  return value;
};

export const evaluateColumnPiece = (c: Context, p: number, pp: Point, goalColumn: number[]) => {
  const board = katanukiBoard(c, p, pp.x, pp.y, LEFT);
  const column = board.getColumn(c.width - 1);

  let value = 0;

  for (let i = 0; i < c.height; i++) {
    if (column[i] !== goalColumn[i]) value++;
  }

  dbg(c.worker, `evaluate: p = ${p}, evaluation = ${value}`);

  return value;
};
