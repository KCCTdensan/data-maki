import type { Pattern } from "@data-maki/schemas";
import { shallowEqual } from "fast-equals";
import { addOps } from "./answer";
import { type Context, DOWN, type Direction, LEFT, type Point, UP } from "./types";
import { countElementsColumnWise, removeStringRange, reverseCells } from "./utils";

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
        bp: {
          x: h,
          y: w,
        },
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
        bp: {
          x: w,
          y: h,
        },
        pw: pattern.width,
        ph: pattern.height,
        pp: {
          x,
          y,
        },
        pattern: pattern.cells,
      };

export const katanuki = (c: Context, p: Pattern, x: number, y: number, dir: Direction) => {
  console.log(p.cells, x, y, dir);

  if (x + p.width <= 0 || x >= c.width || y + p.height <= 0 || y >= c.height) {
    throw new Error("Cannot pick any cells: out of range");
  }

  // Looking point on the board
  const l: Point = { x: 0, y: 0 };

  // Stripe -> Reverse / Border -> Normal
  let { b, bp, pw, ph, pp, pattern } = generatePatternData(dir, c.board, p, c.width, c.height, x, y);

  const picked: string[] = Array(ph).fill("");

  for (let i = pw; i > -1; i--) {
    l.x = pp.x + i;

    // Out of range
    if (l.x < 0) break;
    if (l.x >= bp.x) continue;

    for (const j of Array(ph).keys()) {
      l.y = pp.y + j;

      // Out of range
      if (l.y < 0) continue;
      if (l.y >= bp.y) break;

      if (pattern[j][i] === "0") continue;

      picked[j] = b[l.y][l.x] + picked[j];

      b[l.y] = removeStringRange(b[l.y], l.x, l.x + 1);
    }
  }

  for (const i of Array(ph).keys()) {
    l.y = pp.y + i;

    if (l.y < 0 || l.y >= bp.y) continue;

    b[l.y] = dir === UP || dir === LEFT ? b[l.y] + picked[i] : /* dir === DOWN || dir === RIGHT */ picked[i] + b[l.y];
  }

  if (dir === UP || dir === DOWN) {
    b = reverseCells(b, "reverse-90");
  }

  if (!shallowEqual(b, c.board)) {
    c.board = structuredClone(b);

    addOps(c, {
      p: p.p,
      x,
      y,
      s: dir,
    });

    c.currentElementCounts = countElementsColumnWise(c.board, c.height);

    // TODO: progress
  }
};
