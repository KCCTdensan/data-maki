import { describe, expect, test } from "bun:test";

import type { Question } from "@data-maki/schemas";
import typia from "typia";
import dataExample from "../examples/input.json";
import { solve } from "./v1";
import { reverseCells } from "./v1/utils";

describe("reverseCells", () => {
  test("rotate-90", () => {
    const cells = ["133", "121", "312"];
    const expected = ["113", "321", "312"];

    const actual = reverseCells(cells, "reverse-90");

    expect(actual).toStrictEqual(expected);
  });
});

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
