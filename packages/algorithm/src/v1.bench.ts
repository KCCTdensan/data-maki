import { bench, describe } from "vitest";
import { reverseCells } from "./v1/utils";

const createFixedRandomStringArray = (x: number, y: number) =>
  Array.from({ length: x }, () => Array.from({ length: y }, () => Math.random().toString(36).substring(2)).join(""));

describe("benchmark reverseCells", () => {
  const list = createFixedRandomStringArray(1000, 1000);

  bench("reverse-90", () => {
    reverseCells(list, "reverse-90");
  });

  bench("reverse-up-down", () => {
    reverseCells(list, "reverse-up-down");
  });

  bench("reverse-left-right", () => {
    reverseCells(list, "reverse-left-right");
  });
});
