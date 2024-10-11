import type { TwoDimensionalCells } from "../utils/arrays";

export const cellsToBoard = (cells: TwoDimensionalCells): string[] => {
  return [...cells.columns()].map((column) => column.join(""));
};
