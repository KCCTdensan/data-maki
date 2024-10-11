import type { CellCounts } from "../types";
import { dbg } from "../workers/log";
import type { TwoDimensionalCells } from "./arrays";

export const zip = <T, U>(a: T[], b: U[]): Array<[T, U]> => a.map((e, i) => [e, b[i]]);

export const countElementsColumnWise = (b: TwoDimensionalCells, self?: Worker): Array<CellCounts> =>
  [...Array(b.height).keys()].map((i) => {
    const counts: CellCounts = [0, 0, 0, 0];

    for (const cell of b.getColumn(i)) {
      counts[cell as 0 | 1 | 2 | 3]++;
    }

    return counts;
  });

export const getDelta = (currentColumnCounts: CellCounts, goalColumnCounts: CellCounts): CellCounts =>
  zip<number, number>(currentColumnCounts as unknown as number[], goalColumnCounts as unknown as number[]).map(
    ([current, goal]) => current - goal,
  ) as unknown as CellCounts;
