import type { Ops, Pattern } from "@data-maki/schemas";
import { shallowEqual } from "fast-equals";
import { dbg } from "../workers/log";
import { type Context, DOWN, type Direction, LEFT, type Point, UP } from "./types";
import { countElementsColumnWise, dbgBoard, removeStringRange, reverseCells } from "./utils";

export const addOps = (c: Context, ops: Ops) => {
  c.n += 1;
  c.ops.push(ops);
};

const generatePatternData = (
  dir: Direction,
  b: string[],
  pattern: Pattern,
  w: number,
  h: number,
  x: number,
  y: number,
) =>
  dir === UP || dir === DOWN
    ? {
        b: reverseCells(b, "reverse-90"),
        bw: h,
        bh: w,
        pw: pattern.height,
        ph: pattern.width,
        pp: {
          x: y,
          y: x,
        },
        pattern: reverseCells(pattern.cells, "reverse-90"),
      }
    : /* dir === LEFT || dir === RIGHT */ {
        b,
        bw: w,
        bh: h,
        pw: pattern.width,
        ph: pattern.height,
        pp: {
          x,
          y,
        },
        pattern: pattern.cells,
      };

export const katanuki = (c: Context, p: Pattern, x: number, y: number, dir: Direction) => {
  dbg(c.worker, "katanuki", { p: p.p, x, y, dir });

  if (x + p.width <= 0 || x >= c.width || y + p.height <= 0 || y >= c.height) {
    throw new Error("Cannot pick any cells: out of range");
  }

  // Looking point on the board
  const l: Point = { x: 0, y: 0 };

  // Stripe -> Reverse / Border -> Normal
  let { b, bw, bh, pw, ph, pp, pattern } = generatePatternData(
    dir,
    [...c.board] /* NOTE: Must be cloned */,
    p,
    c.width,
    c.height,
    x,
    y,
  );

  const picked: string[] = Array(ph).fill("");

  for (let i = pw - 1; i > -1; i--) {
    l.x = pp.x + i;

    // Out of range
    if (l.x < 0) break;
    if (l.x >= bw) continue;

    for (const j of Array(ph).keys()) {
      l.y = pp.y + j;

      // Out of range
      if (l.y < 0) continue;
      if (l.y >= bh) break;

      if (pattern[j][i] === "0") continue;

      picked[j] = b[l.y][l.x] + picked[j];

      b[l.y] = removeStringRange(b[l.y], l.x, l.x + 1);
    }
  }

  for (const i of Array(ph).keys()) {
    // Up / Left: Add at the end, Down / Right: Add at the beginning

    l.y = pp.y + i;

    if (l.y < 0 || l.y >= bh) continue;

    b[l.y] = dir === UP || dir === LEFT ? b[l.y] + picked[i] : /* dir === DOWN || dir === RIGHT */ picked[i] + b[l.y];
  }

  if (dir === UP || dir === DOWN) {
    b = reverseCells(b, "reverse-90");
  }

  if (!shallowEqual(b, c.board)) {
    c.board = [...b];
    c.currentElementCounts = countElementsColumnWise(c.board, c.height);

    const op: Ops = {
      p: p.p,
      x,
      y,
      s: dir,
    };

    addOps(c, op);
    dbgBoard(c);
  } else {
    dbg(c.worker, c.board, b);
  }
};
