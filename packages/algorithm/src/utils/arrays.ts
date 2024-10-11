import type { TypedArray } from "type-fest";
import { dbg } from "../workers/log";

const sliceJump = <T extends TypedArray>(arr: T, start: number, jump: number) => {
  const result = new (arr.constructor as { new (length: number): T })(Math.ceil(arr.length / jump));

  for (let i = 0; i < result.length; i++) {
    result[i] = arr[start + i * jump];
  }

  return result;
};

export class TwoDimensionalCells {
  #inner: Uint8Array;

  constructor(
    init: number[],
    public readonly width: number,
    public readonly height: number,
  ) {
    if (init.length !== width * height) {
      throw new Error(`Invalid size: ${init.length} !== ${width} * ${height}`);
    }

    this.#inner = new Uint8Array(init);
  }

  [Symbol.iterator]() {
    return this.#inner[Symbol.iterator]();
  }

  equals(other: TwoDimensionalCells) {
    return this.#inner.every((v, i) => v === other.#inner[i]);
  }

  clone() {
    return new TwoDimensionalCells([...this.#inner], this.width, this.height);
  }

  get(idx_column: number, idx_row: number) {
    if (idx_column < 0 || idx_column >= this.height || idx_row < 0 || idx_row >= this.width) {
      throw new Error(`Index out of bounds: ${idx_column}, ${idx_row}`);
    }

    return this.#inner[idx_column * this.width + idx_row];
  }

  getMultiple(offset: number, length: number) {
    if (offset < 0 || offset >= this.#inner.length || offset + length > this.#inner.length) {
      throw new Error(`Index out of bounds: ${offset}, ${length}`);
    }

    return [...this.#inner.slice(offset, offset + length)];
  }

  getColumn(idx: number) {
    if (idx < 0 || idx >= this.height) {
      throw new Error(`Index out of bounds: ${idx}`);
    }

    return this.getMultiple(idx * this.width, this.width);
  }

  *columns() {
    for (let i = 0; i < this.height; i++) {
      yield this.getColumn(i);
    }
  }

  getRow(idx: number) {
    if (idx < 0 || idx >= this.width) {
      throw new Error(`Index out of bounds: ${idx}`);
    }

    return [...sliceJump(this.#inner, idx, this.width)];
  }

  *rows() {
    for (let i = 0; i < this.width; i++) {
      yield this.getRow(i);
    }
  }

  set(idx_column: number, idx_row: number, value: number) {
    if (idx_column < 0 || idx_column >= this.height || idx_row < 0 || idx_row >= this.width) {
      throw new Error(`Index out of bounds: ${idx_column}, ${idx_row}`);
    }

    this.#inner[idx_column * this.width + idx_row] = value;
  }

  setMultiple(offset: number, ...values: number[]) {
    if (offset < 0 || offset >= this.#inner.length || offset + values.length > this.#inner.length) {
      throw new Error(`Index out of bounds: ${offset}, ${values.length}`);
    }

    this.#inner.set(values, offset);
  }

  setColumn(idx: number, column: number[]) {
    if (idx < 0 || idx >= this.height) {
      throw new Error(`Index out of bounds: ${idx}`);
    }

    if (column.length !== this.width) {
      throw new Error(`Invalid column size: ${column.length} !== ${this.width}`);
    }

    this.setMultiple(idx * this.width, ...column);
  }

  transpose() {
    return new TwoDimensionalCells([...this.rows()].flat(), this.height, this.width);
  }

  reverseColumnWise() {
    return new TwoDimensionalCells([...this.columns()].reverse().flat(), this.width, this.height);
  }

  reverseRowWise() {
    return new TwoDimensionalCells(
      [...this.columns()].map((column) => column.reverse()).flat(),
      this.width,
      this.height,
    );
  }
}

export const dbgCells = (cells: TwoDimensionalCells, self?: Worker) => {
  for (const col of cells.columns()) {
    dbg(self, col);
  }
};

export type ReverseOperation = "reverse-90" | "reverse-up-down" | "reverse-left-right";

export const reverseCells = (cells: TwoDimensionalCells, op: ReverseOperation): TwoDimensionalCells => {
  switch (op) {
    case "reverse-90":
      return cells.transpose();
    case "reverse-up-down":
      return cells.reverseColumnWise();
    case "reverse-left-right":
      return cells.reverseRowWise();
  }
};
