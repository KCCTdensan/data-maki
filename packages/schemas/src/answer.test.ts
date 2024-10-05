import { describe, expect, test } from "bun:test";

import typia from "typia";
import type { Answer } from "./answer";

const exampleJson = `
{
  "n":3,
  "ops": [
    {
      "p":4,
      "x":5,
      "y":6,
      "s":2
    },
    {
      "p":11,
      "x":3,
      "y":-12,
      "s":3
    },
    {
      "p":25,
      "x":6,
      "y":0,
      "s":0
    }
  ]
}
`;

const expectedObject = {
  n: 3,
  ops: [
    {
      p: 4,
      x: 5,
      y: 6,
      s: 2,
    },
    {
      p: 11,
      x: 3,
      y: -12,
      s: 3,
    },
    {
      p: 25,
      x: 6,
      y: 0,
      s: 0,
    },
  ],
};

describe("answer parsing", () => {
  test("example answer json correctly parses", () => {
    const object = JSON.parse(exampleJson);
    const answer = typia.assertEquals<Answer>(object);

    expect(answer).toStrictEqual(expectedObject);
  });
});
