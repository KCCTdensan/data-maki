import { describe, test } from "bun:test";

import type { Problem } from "@data-maki/schemas";
import typia from "typia";
import { generateProblem } from "./gen";

describe("generated problem parsing", () => {
  test("generated problem correctly parses", () => {
    const [, problem] = generateProblem({
      widthRandom: true,
      heightRandom: true,
      width: 0,
      height: 0,
      genKindStart: "all-random",
      genKindGoal: "all-random",
    });

    typia.assert<Problem>(problem);
  });
});
