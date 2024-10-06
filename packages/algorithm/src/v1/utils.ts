import type { FixedLengthArray } from "type-fest";
import type { CellCounts } from "./types";

export const zip = <T, U>(a: T[], b: U[]): Array<[T, U]> => a.map((e, i) => [e, b[i]]);

export const removeStringRange = (str: string, start: number, end: number): string =>
  str.slice(0, start) + str.slice(end);

export type ReverseOperation = "reverse-90" | "reverse-up-down" | "reverse-left-right";

export const transpose = (cells: string[]): string[] => {
  const arr = cells.at(0);

  if (!arr) return [];

  return arr.split("").map((_, i) => cells.map((row) => row[i]).join(""));
};

export const reverseUpDown = (cells: string[]): string[] => cells.reverse();

export const reverseLeftRight = (cells: string[]): string[] => cells.map((row) => row.split("").reverse().join(""));

export const reverseCells = (cells: string[], op: ReverseOperation): string[] => {
  switch (op) {
    case "reverse-90":
      return transpose(cells);
    case "reverse-up-down":
      return reverseUpDown(cells);
    case "reverse-left-right":
      return reverseLeftRight(cells);
  }
};

export const countElementsColumnWise = (board: string[], h: number): Array<CellCounts> =>
  Array(h).map((_, i) => {
    const counts: CellCounts = [0, 0, 0, 0];

    for (const cell of board[i]) {
      counts[Number(cell) as 0 | 1 | 2 | 3]++;
    }

    return counts;
  });

export const getDelta = (currentColumnCounts: CellCounts, goalColumnCounts: CellCounts): CellCounts =>
  zip<number, number>(currentColumnCounts as unknown as number[], goalColumnCounts as unknown as number[]).map(
    ([current, goal]) => current - goal,
  ) as unknown as CellCounts;
