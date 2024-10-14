import type { Board } from "@data-maki/schemas";
import { TwoDimensionalCells } from "../utils/arrays";

export const boardToCells = (b: Board): [start: TwoDimensionalCells, goal: TwoDimensionalCells] => {
  const start = b.start.flatMap((row) => row.split("").map((cell) => Number(cell)));
  const goal = b.goal.flatMap((row) => row.split("").map((cell) => Number(cell)));

  return [new TwoDimensionalCells(start, b.width, b.height), new TwoDimensionalCells(goal, b.width, b.height)];
};
