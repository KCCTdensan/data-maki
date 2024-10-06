import { describe, expect, test } from "bun:test";

import type { Question } from "@data-maki/schemas";
import typia from "typia";
import dataExample from "../examples/input.json";
import { solve } from "./v1";

describe("algorithm v1 tests", () => {
  test("example data correctly solves", () => {
    const question = typia.assert<Question>(dataExample);

    const expected = question.board.goal;
    let actual: string[];

    const answer = solve(
      question,
      () => {},
      (finalBoard) => {
        actual = finalBoard;
      },
    );

    expect(actual).toStrictEqual(expected);
  });
});
