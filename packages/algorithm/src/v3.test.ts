import { describe, expect, test } from "bun:test";
import type { Answer, Problem } from "@data-maki/schemas";
import typia from "typia";
import dataExample from "../examples/input.json";
import { solve } from "./workers/v3.master";

describe("algorithm v3 tests", () => {
  let problem: Problem;
  let answer: Answer;

  test("example data correctly solves", async () => {
    problem = typia.assert<Problem>(dataExample);

    const expected = problem.board.goal;
    const [actualAnswer, actual] = await solve(structuredClone(problem));

    answer = actualAnswer;

    expect(actual).toStrictEqual(expected);
  });
});
