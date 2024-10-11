import { type General, type Pattern, fixedPatterns as fixedPatterns_ } from "@data-maki/schemas";
import { TwoDimensionalCells } from "../utils/arrays";

export interface InternalPattern {
  p: number;
  width: number;
  height: number;
  cells: TwoDimensionalCells;
}

export const patternToInternal = (pattern: Pattern): InternalPattern => {
  return {
    p: pattern.p,
    width: pattern.width,
    height: pattern.height,
    cells: new TwoDimensionalCells(
      pattern.cells.flatMap((row) => row.split("").map((cell) => Number(cell))),
      pattern.width,
      pattern.height,
    ),
  };
};

const fixedPatterns = fixedPatterns_.map(patternToInternal);

export const getPattern = (index: number, general: InternalPattern[]): InternalPattern => {
  if (index < 0 || index >= fixedPatterns.length + 256) {
    throw new Error(`Invalid pattern index: ${index}`);
  }

  return index < fixedPatterns.length ? fixedPatterns[index] : general[index - fixedPatterns.length];
};
