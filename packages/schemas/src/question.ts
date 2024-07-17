import typia, { type tags } from "typia";

// Example schema

export interface Question {
  board: Board;
}

export interface Board {
  width: number & tags.Type<"uint32"> & tags.Minimum<32> & tags.Maximum<256>;
  height: number & tags.Type<"uint32"> & tags.Minimum<32> & tags.Maximum<256>;
}
