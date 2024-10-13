import type { Op } from "@data-maki/schemas";
import { type InternalPattern, getPattern } from "./models/pattern";
import { type Context, DOWN, type Direction, LEFT, type Point, UP } from "./types";
import { type TwoDimensionalCells, dbgCells, reverseCells } from "./utils/arrays";
import { countElementsColumnWise } from "./utils/board";
import { dbg } from "./workers/log";

export const addOp = (c: Context, ops: Op) => {
  c.n += 1;
  c.ops.push(ops);
};

const generatePatternData = (
  dir: Direction,
  b: TwoDimensionalCells,
  pattern: InternalPattern,
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
        pattern: reverseCells(pattern.cells, "reverse-90"),
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
        pattern: pattern.cells.clone(),
      };

export const katanuki = (c: Context, p: number, x: number, y: number, dir: Direction) => {
  const pattern_ = getPattern(p, c.patterns);

  dbg(c.worker, "katanuki", { p: pattern_.p, x, y, dir });

  if (x + pattern_.width <= 0 || x >= c.width || y + pattern_.height <= 0 || y >= c.height) {
    throw new Error("Cannot pick any cells: out of range");
  }

  // Looking point on the board
  const l: Point = { x: 0, y: 0 };

  // Stripe -> Reverse / Border -> Normal
  let { b, bx, by, pw, ph, pp, pattern } = generatePatternData(dir, c.board, pattern_, c.width, c.height, x, y);

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

    if (dir === UP || dir === LEFT) {
      currentRow.push(...picked);
    } else {
      currentRow.unshift(...picked);
    }

    b.setRow(l.y, currentRow);
  }

  if (dir === UP || dir === DOWN) {
    b = reverseCells(b, "reverse-90");
  }

  if (!c.board.equals(b)) {
    c.board = b;
    c.currentElementCounts = countElementsColumnWise(c.board, c.worker);

    const op: Op = {
      p: pattern_.p,
      x,
      y,
      s: dir,
    };

    addOp(c, op);
    dbgCells(c.board, c.worker);
  } else {
    dbg(c.worker, c.board, b);
  }
};
