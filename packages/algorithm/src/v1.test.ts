import { describe, expect, test } from "bun:test";
import type { Answer } from "@data-maki/schemas";

import type { Problem } from "@data-maki/schemas";
import typia from "typia";
import dataExample from "../examples/input.json";
import { createContext, fromPattern } from "./v1";
import { katanuki } from "./v1/katanuki";
import type { Direction } from "./v1/types";
import { reverseCells } from "./v1/utils";
import { solve } from "./workers/v1.master";

describe("reverseCells", () => {
  test("rotate-90", () => {
    const cells = ["133", "121", "312"];
    const expected = ["113", "321", "312"];

    const actual = reverseCells(cells, "reverse-90");

    expect(actual).toStrictEqual(expected);
  });

  test("reverse-up-down", () => {
    const cells = ["133", "121", "312"];
    const expected = ["312", "121", "133"];

    const actual = reverseCells(cells, "reverse-up-down");

    expect(actual).toStrictEqual(expected);
  });

  test("reverse-left-right", () => {
    const cells = ["133", "121", "312"];
    const expected = ["331", "121", "213"];

    const actual = reverseCells(cells, "reverse-left-right");

    expect(actual).toStrictEqual(expected);
  });
});

describe("algorithm v1 tests", () => {
  let problem: Problem;
  let answer: Answer;

  test("example data correctly solves", async () => {
    problem = typia.assert<Problem>(dataExample);

    const expected = problem.board.goal;
    const [actualAnswer, actual] = await solve(structuredClone(problem));

    answer = actualAnswer;

    expect(actual).toStrictEqual(expected);
  });

  test("katanuki works", () => {
    const c = createContext(problem);

    for (const op of answer.ops) {
      katanuki(c, fromPattern(op.p, problem.general), op.x, op.y, op.s as Direction);
    }

    expect(c.board).toStrictEqual(problem.board.goal);
  });
});
