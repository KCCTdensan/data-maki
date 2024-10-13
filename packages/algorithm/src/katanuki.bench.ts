import type { Problem } from "@data-maki/schemas";
import { bench, describe } from "vitest";
import dataExample from "../examples/input.json";
import { katanuki } from "./katanuki";
import type { Direction } from "./types";
import { createContext } from "./v1";

// Example ops data with example data, v1 algorithm, revision b2b1e22b1b
const v1Ops = [
  {
    p: 0,
    x: 2,
    y: 1,
    s: 0,
  },
  {
    p: 3,
    x: 4,
    y: 1,
    s: 0,
  },
  {
    p: 0,
    x: 3,
    y: 2,
    s: 2,
  },
  {
    p: 2,
    x: 1,
    y: 2,
    s: 2,
  },
  {
    p: 0,
    x: 1,
    y: 2,
    s: 0,
  },
  {
    p: 0,
    x: 4,
    y: 1,
    s: 0,
  },
  {
    p: 0,
    x: 3,
    y: 2,
    s: 3,
  },
  {
    p: 0,
    x: 3,
    y: 2,
    s: 0,
  },
  {
    p: 22,
    x: 0,
    y: 3,
    s: 1,
  },
  {
    p: 0,
    x: 0,
    y: 2,
    s: 0,
  },
  {
    p: 0,
    x: 1,
    y: 1,
    s: 0,
  },
  {
    p: 2,
    x: 3,
    y: 2,
    s: 2,
  },
  {
    p: 0,
    x: 3,
    y: 2,
    s: 0,
  },
  {
    p: 3,
    x: 5,
    y: 1,
    s: 0,
  },
  {
    p: 0,
    x: 4,
    y: 2,
    s: 2,
  },
  {
    p: 0,
    x: 4,
    y: 2,
    s: 0,
  },
  {
    p: 0,
    x: 5,
    y: 1,
    s: 0,
  },
  {
    p: 22,
    x: 0,
    y: 3,
    s: 1,
  },
  {
    p: 0,
    x: 1,
    y: 2,
    s: 0,
  },
  {
    p: 0,
    x: 3,
    y: 2,
    s: 0,
  },
  {
    p: 5,
    x: 1,
    y: 2,
    s: 3,
  },
  {
    p: 0,
    x: 4,
    y: 2,
    s: 0,
  },
  {
    p: 22,
    x: 0,
    y: 3,
    s: 1,
  },
  {
    p: 22,
    x: 0,
    y: 3,
    s: 1,
  },
  {
    p: 0,
    x: 4,
    y: 2,
    s: 2,
  },
  {
    p: 22,
    x: 5,
    y: 0,
    s: 3,
  },
  {
    p: 0,
    x: 4,
    y: 2,
    s: 2,
  },
  {
    p: 22,
    x: 5,
    y: 0,
    s: 3,
  },
  {
    p: 0,
    x: 4,
    y: 1,
    s: 2,
  },
  {
    p: 22,
    x: 5,
    y: 0,
    s: 3,
  },
  {
    p: 22,
    x: 5,
    y: 0,
    s: 3,
  },
  {
    p: 22,
    x: 5,
    y: 0,
    s: 3,
  },
  {
    p: 22,
    x: 5,
    y: 0,
    s: 3,
  },
];

describe("algorithm v1 tests", () => {
  const problem = dataExample as Problem;

  bench("katanuki", () => {
    const c = createContext(problem);

    for (const op of v1Ops) {
      katanuki(c, op.p, op.x, op.y, op.s as Direction);
    }
  });
});
