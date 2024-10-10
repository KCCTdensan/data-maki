import { describe, expect, test } from "bun:test";
import type { Answer } from "@data-maki/schemas";

import type { Question } from "@data-maki/schemas";
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
});

describe("algorithm v1 tests", () => {
  let question: Question;
  let answer: Answer;

  test("example data correctly solves", async () => {
    question = typia.assert<Question>(dataExample);

    const expected = question.board.goal;
    const [actualAnswer, actual] = await solve(structuredClone(question));

    answer = actualAnswer;

    expect(actual).toStrictEqual(expected);
  });

  test("katanuki works", () => {
    const c = createContext(question);

    for (const op of answer.ops) {
      katanuki(c, fromPattern(op.p, question.general), op.x, op.y, op.s as Direction);
    }

    expect(c.board).toStrictEqual(question.board.goal);
  });
});
