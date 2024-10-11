import type { Board, Op } from "@data-maki/schemas";
import type { FixedLengthArray } from "type-fest";

export const UP = 0;
export const DOWN = 1;
export const LEFT = 2;
export const RIGHT = 3;

export type Point = { x: number; y: number };
export type Direction = typeof UP | typeof DOWN | typeof LEFT | typeof RIGHT;
export type CellCounts = FixedLengthArray<number, 4>;

export interface Context {
  worker?: Worker;
  board: string[];
  goalBoard: string[];
  // Element counts per column
  currentElementCounts: Array<FixedLengthArray<number, 4>>;
  width: number;
  height: number;

  // Answer
  n: number;
  ops: Array<Op>;
}
