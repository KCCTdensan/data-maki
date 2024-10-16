import type { TypedArray } from "type-fest";
import { isUint8Array } from "uint8array-extras";
import type { ReverseOperationPatterns } from "../types";
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
    init: number[] | Uint8Array,
    public width: number,
    public height: number,
  ) {
    if (init.length !== width * height) {
      throw new Error(`Invalid size: ${init.length} !== ${width} * ${height}`);
    }

    this.#inner = isUint8Array(init) ? init : new Uint8Array(init);
  }

  get length() {
    return this.#inner.length;
  }

  [Symbol.iterator]() {
    return this.#inner[Symbol.iterator]();
  }

  equals(other: TwoDimensionalCells) {
    for (let i = 0; i < this.#inner.length; i++) {
      if (this.#inner[i] !== other.#inner[i]) {
        return false;
      }
    }

    return true;
  }

  clone() {
    return new TwoDimensionalCells(Uint8Array.from(this.#inner), this.width, this.height);
  }

  get(rowIndex: number, columnIndex: number) {
    if (rowIndex < 0 || rowIndex >= this.height || columnIndex < 0 || columnIndex >= this.width) {
      throw new Error(`Index out of bounds: ${rowIndex}, ${columnIndex}`);
    }

    return this.#inner[rowIndex * this.width + columnIndex];
  }

  getMultiple(offset: number, length: number) {
    if (offset < 0 || offset >= this.#inner.length || offset + length > this.#inner.length) {
      throw new Error(`Index out of bounds: ${offset}, ${length}`);
    }

    return Array.from(this.#inner.subarray(offset, offset + length));
  }

  getMultipleView(offset: number, length: number) {
    if (offset < 0 || offset >= this.#inner.length || offset + length > this.#inner.length) {
      throw new Error(`Index out of bounds: ${offset}, ${length}`);
    }

    return this.#inner.subarray(offset, offset + length);
  }

  getRow(idx: number) {
    if (idx < 0 || idx >= this.height) {
      throw new Error(`Index out of bounds: ${idx}`);
    }

    return this.getMultiple(idx * this.width, this.width);
  }

  getRowView(idx: number) {
    if (idx < 0 || idx >= this.height) {
      throw new Error(`Index out of bounds: ${idx}`);
    }

    return this.#inner.subarray(idx * this.width, (idx + 1) * this.width);
  }

  *rows() {
    for (let i = 0; i < this.height; i++) {
      yield this.getRow(i);
    }
  }

  *rowViews() {
    for (let i = 0; i < this.height; i++) {
      yield this.getRowView(i);
    }
  }

  getColumn(idx: number) {
    if (idx < 0 || idx >= this.width) {
      throw new Error(`Index out of bounds: ${idx}`);
    }

    return Array.from(sliceJump(this.#inner, idx, this.width));
  }

  *columns() {
    for (let i = 0; i < this.width; i++) {
      yield this.getColumn(i);
    }
  }

  set(rowIndex: number, columnIndex: number, value: number) {
    if (rowIndex < 0 || rowIndex >= this.height || columnIndex < 0 || columnIndex >= this.width) {
      throw new Error(`Index out of bounds: ${rowIndex}, ${columnIndex}`);
    }

    this.#inner[rowIndex * this.width + columnIndex] = value;
  }

  setMultiple(offset: number, ...values: number[]) {
    if (offset < 0 || offset >= this.#inner.length || offset + values.length > this.#inner.length) {
      throw new Error(`Index out of bounds: ${offset}, ${values.length}`);
    }

    this.#inner.set(values, offset);
  }

  setRow(idx: number, row: number[]) {
    if (idx < 0 || idx >= this.height) {
      throw new Error(`Index out of bounds: ${idx}`);
    }

    if (row.length !== this.width) {
      throw new Error(`Invalid column size: ${row.length} !== ${this.width}`);
    }

    this.setMultiple(idx * this.width, ...row);
  }

  #transposeInner() {
    const newInner = new Uint8Array(this.#inner.length);

    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        newInner[j * this.height + i] = this.#inner[i * this.width + j];
      }
    }

    return newInner;
  }

  transposeInPlace() {
    this.#inner = this.#transposeInner();

    const tmp = this.width;
    this.height = this.width;
    this.width = tmp;

    return this;
  }

  transpose() {
    return new TwoDimensionalCells(this.#transposeInner(), this.height, this.width);
  }

  reverseRowWiseInPlace() {
    for (let i = 0; i < this.height / 2; i++) {
      for (let j = 0; j < this.width; j++) {
        const tmp = this.#inner[i * this.width + j];

        this.#inner[i * this.width + j] = this.#inner[(this.height - 1 - i) * this.width + j];
        this.#inner[(this.height - 1 - i) * this.width + j] = tmp;
      }
    }

    return this;
  }

  reverseRowWise() {
    return this.clone().reverseRowWiseInPlace();
  }

  reverseColumnWiseInPlace() {
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width / 2; j++) {
        const tmp = this.#inner[i * this.width + j];

        this.#inner[i * this.width + j] = this.#inner[i * this.width + this.width - 1 - j];
        this.#inner[i * this.width + this.width - 1 - j] = tmp;
      }
    }

    return this;
  }

  reverseColumnWise() {
    return this.clone().reverseColumnWiseInPlace();
  }
}

export const dbgCells = (cells: TwoDimensionalCells, self?: Worker) => {
  for (const row of cells.rows()) {
    dbg(self, row);
  }
};

export type ReverseOperation = "reverse-90" | "reverse-up-down" | "reverse-left-right";

export const reverseCells = (cells: TwoDimensionalCells, op: ReverseOperation): TwoDimensionalCells => {
  switch (op) {
    case "reverse-90":
      return cells.transpose();
    case "reverse-up-down":
      return cells.reverseRowWise();
    case "reverse-left-right":
      return cells.reverseColumnWise();
  }
};

export const multiReverse = (cells_: TwoDimensionalCells, rvOp: ReverseOperationPatterns) => {
  let cells = cells_;

  if (rvOp.hasReverse90) {
    cells = cells.transpose();

    if (rvOp.hasReverseLeftRight) {
      cells = cells.reverseRowWise();
    }

    if (rvOp.hasReverseUpDown) {
      cells = cells.reverseColumnWise();
    }
  } else {
    if (rvOp.hasReverseLeftRight) {
      cells = cells.reverseColumnWise();
    }

    if (rvOp.hasReverseUpDown) {
      cells = cells.reverseRowWise();
    }
  }

  return cells;
};

export const multiDereverse = (cells_: TwoDimensionalCells, rvOp: ReverseOperationPatterns) => {
  let cells = cells_;

  if (rvOp.hasReverse90) {
    if (rvOp.hasReverseLeftRight) {
      cells = cells.reverseRowWise();
    }

    if (rvOp.hasReverseUpDown) {
      cells = cells.reverseColumnWise();
    }

    cells = cells.transpose();
  } else {
    if (rvOp.hasReverseLeftRight) {
      cells = cells.reverseColumnWise();
    }

    if (rvOp.hasReverseUpDown) {
      cells = cells.reverseRowWise();
    }
  }

  return cells;
};
