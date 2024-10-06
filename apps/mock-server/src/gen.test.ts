import { describe, test } from "bun:test";

import type { Question } from "@data-maki/schemas";
import typia from "typia";
import { generateProblem } from "./gen";

describe("generated question parsing", () => {
  test("generated question correctly parses", () => {
    const [, question] = generateProblem();

    typia.assert<Question>(question);
  });
});
