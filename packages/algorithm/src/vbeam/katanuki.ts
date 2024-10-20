import type { Op } from "@data-maki/schemas";
import { getPattern } from "../models/pattern";
import { type Context, DOWN, type Direction, LEFT, type Point, RIGHT, UP } from "../types";
import { type TwoDimensionalCells, dbgCells, multiReverse, reverseCells } from "../utils/arrays";
import { countElementsColumnWise } from "../utils/board";
import { dbg } from "../workers/log";

export const addOp = (c: Context, op: Op) => {
  let { p, x, y, s } = op;

  const pattern = getPattern(op.p, c.patterns);

  if (c.rvOp.hasReverse90) {
    const tmp = x;
    x = y;
    y = tmp;

    if (c.rvOp.hasReverseUpDown) {
      y = c.width - y - 1;
      y -= pattern.height - 1;

      if (s === LEFT) s = RIGHT;
      else if (s === RIGHT) s = LEFT;
    }

    if (c.rvOp.hasReverseLeftRight) {
      x = c.height - x - 1;
      x -= pattern.width - 1;

      if (s === UP) s = DOWN;
      else if (s === DOWN) s = UP;
    }

    if (s === UP) s = LEFT;
    else if (s === DOWN) s = RIGHT;
    else if (s === LEFT) s = UP;
    else if (s === RIGHT) s = DOWN;
  } else {
    if (c.rvOp.hasReverseUpDown) {
      y = c.height - y - 1;
      y -= pattern.height - 1;

      if (s === UP) s = DOWN;
      else if (s === DOWN) s = UP;
    }

    if (c.rvOp.hasReverseLeftRight) {
      x = c.width - x - 1;
      x -= pattern.width - 1;

      if (s === LEFT) s = RIGHT;
      else if (s === RIGHT) s = LEFT;
    }
  }

  c.n += 1;
  c.ops.push({ p, x, y, s });
};

const generatePatternData = (
  dir: Direction,
  b: TwoDimensionalCells,
  pattern: TwoDimensionalCells,
  w: number,
  h: number,
  x: number,
  y: number,
) =>
  dir === UP || dir === DOWN
    ? {
        b: reverseCells(b, "reverse-90"),
        bx: h,
        by: w,
        pw: pattern.height,
        ph: pattern.width,
        pp: {
          x: y,
          y: x,
        },
        pattern: reverseCells(pattern, "reverse-90"),
      }
    : /* dir === LEFT || dir === RIGHT */ {
        b: b.clone(),
        bx: w,
        by: h,
        pw: pattern.width,
        ph: pattern.height,
        pp: {
          x,
          y,
        },
        pattern,
      };

export const katanukiBoard = (c: Context, p: number, x: number, y: number, s: Direction, _b: TwoDimensionalCells) => {
  const pattern_ = getPattern(p, c.patterns);

  dbg(c.worker, "katanuki", { p: pattern_.p, x, y, s });

  if (x + pattern_.width <= 0 || x >= c.width || y + pattern_.height <= 0 || y >= c.height) {
    throw new Error(
      `Cannot pick any cells: out of range (x: ${c.width} > [${x}, ${x + pattern_.width}), y: ${c.height} > [${y}, ${y + pattern_.height})`,
    );
  }

  // Looking point on the board
  const l: Point = { x: 0, y: 0 };

  // Stripe -> Reverse / Border -> Normal
  let { b, bx, by, pw, ph, pp, pattern } = generatePatternData(
    s,
    _b,
    multiReverse(pattern_.cells, c.rvOp),
    c.width,
    c.height,
    x,
    y,
  );

  for (const i of Array(ph).keys()) {
    l.y = pp.y + i;

    // Out of range
    if (l.y < 0) continue;
    if (l.y >= by) break;

    const currentRow = b.getRow(l.y);
    const picked: number[] = [];

    for (let j = pw - 1; j > -1; j--) {
      l.x = pp.x + j;

      if (l.x >= bx) continue;
      if (l.x < 0) break;

      if (pattern.get(i, j) === 0) continue;

      picked.unshift(currentRow.splice(l.x, 1)[0]);
    }

    if (s === UP || s === LEFT) {
      currentRow.push(...picked);
    } else {
      currentRow.unshift(...picked);
    }

    b.setRow(l.y, currentRow);
  }

  if (s === UP || s === DOWN) {
    b = reverseCells(b, "reverse-90");
  }

  return b;
};

export const katanuki = (c: Context, p: number, x: number, y: number, s: Direction) => {
  const b = katanukiBoard(c, p, x, y, s, c.board);

  if (!c.board.equals(b)) {
    c.board = b;
    c.currentElementCounts = countElementsColumnWise(c.board, c.worker);

    addOp(c, { p, x, y, s });
    dbgCells(c.board, c.worker);
  } else {
    dbg(c.worker, c.board, b);
  }
};
