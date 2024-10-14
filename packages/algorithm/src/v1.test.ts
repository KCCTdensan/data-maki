import { describe, expect, test } from "bun:test";
import type { Answer, Problem } from "@data-maki/schemas";
import typia from "typia";
import dataExample from "../examples/input.json";
import { katanuki } from "./katanuki";
import { cellsToBoard } from "./models/answer";
import type { Direction } from "./types";
import { createContext } from "./v1";
import { solve } from "./workers/v1.master";

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
      katanuki(c, op.p, op.x, op.y, op.s as Direction);
    }

    expect(cellsToBoard(c.board)).toStrictEqual(problem.board.goal);
  });
});
