import { describe, expect, test } from "bun:test";

import typia from "typia";
import type { Problem } from "./problem";

const exampleJson = `
{
  "board": {
    "width": 6,
    "height": 4,
    "start": [
      "220103",
      "213033",
      "022103",
      "322033"
    ],
    "goal": [
      "000000",
      "111222",
      "222233",
      "333333"
    ]
  },
  "general": {
    "n": 2,
    "patterns": [
      {
        "p": 25,
        "width": 4,
        "height": 2,
        "cells": [
          "0111",
          "1001"
        ]
      },
      {
        "p": 26,
        "width": 2,
        "height": 2,
        "cells": [
          "10",
          "01"
        ]
      }
    ]
  }
}
`;

const expectedObject = {
  board: {
    width: 6,
    height: 4,
    start: ["220103", "213033", "022103", "322033"],
    goal: ["000000", "111222", "222233", "333333"],
  },
  general: {
    n: 2,
    patterns: [
      {
        p: 25,
        width: 4,
        height: 2,
        cells: ["0111", "1001"],
      },
      {
        p: 26,
        width: 2,
        height: 2,
        cells: ["10", "01"],
      },
    ],
  },
};

describe("problem parsing", () => {
  test("example problem json correctly parses", () => {
    const object = JSON.parse(exampleJson);
    const problem = typia.assertEquals<Problem>(object);

    expect(problem).toStrictEqual(expectedObject);
  });
});
