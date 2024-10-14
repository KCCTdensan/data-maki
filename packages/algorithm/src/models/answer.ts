import type { TwoDimensionalCells } from "../utils/arrays";

export const cellsToBoard = (cells: TwoDimensionalCells): string[] => {
  return [...cells.rows()].map((column) => column.join(""));
};
