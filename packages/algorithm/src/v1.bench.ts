import { bench, describe } from "vitest";
import { TwoDimensionalCells, reverseCells, reverseCellsInPlace } from "./utils/arrays";

const createRandomTwoDimensionalCells = (x: number, y: number) =>
  new TwoDimensionalCells(
    Array.from({ length: x * y }, () => Math.floor(Math.random() * 4)),
    x,
    y,
  );

describe("benchmark TwoDimensionalCells", () => {
  const cells = createRandomTwoDimensionalCells(256, 256);

  bench("get", () => {
    for (let i = 0; i < 256; i++) {
      for (let j = 0; j < 256; j++) {
        cells.get(i, j);
      }
    }
  });

  bench("getMultiple", () => {
    for (let i = 0; i < 256; i++) {
      cells.getMultiple(i, 256 - i);
    }
  });

  bench("getMultipleView", () => {
    for (let i = 0; i < 256; i++) {
      cells.getMultipleView(i, 256 - i);
    }
  });

  bench("getRow", () => {
    for (let i = 0; i < 256; i++) {
      cells.getRow(i);
    }
  });

  bench("getRowView", () => {
    for (let i = 0; i < 256; i++) {
      cells.getRowView(i);
    }
  });

  bench("clone", () => {
    cells.clone();
  });
});

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

  bench("in-place reverse-90", () => {
    reverseCellsInPlace(list, "reverse-90");
  });

  bench("in-place reverse-up-down", () => {
    reverseCellsInPlace(list, "reverse-up-down");
  });

  bench("in-place reverse-left-right", () => {
    reverseCellsInPlace(list, "reverse-left-right");
  });
});
