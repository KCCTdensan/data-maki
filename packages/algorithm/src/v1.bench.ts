import { bench, describe } from "vitest";
import { TwoDimensionalCells, reverseCells } from "./utils/arrays";

const createFixedRandomStringArray = (x: number, y: number) =>
  new TwoDimensionalCells(
    Array.from({ length: x * y }, () => Math.floor(Math.random() * 4)),
    x,
    y,
  );

describe("benchmark reverseCells", () => {
  const list = createFixedRandomStringArray(256, 256);

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
