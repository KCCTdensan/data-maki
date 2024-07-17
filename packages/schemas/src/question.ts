import typia, { type tags } from "typia";

// Example schema

export interface Question {
  board: Board;
  general: General;
}

export interface Board {
  readonly width: number & tags.Type<"uint32"> & tags.Maximum<256>;
  readonly height: number & tags.Type<"uint32"> & tags.Maximum<256>;

  start: Array<string & tags.MinLength<1> & tags.MaxLength<256>> & tags.MinItems<1> & tags.MaxItems<256>;
  readonly goal: Array<string & tags.MinLength<1> & tags.MaxLength<256>> & tags.MinItems<1> & tags.MaxItems<256>;
}

export interface General {
  readonly n: number & tags.Type<"uint32"> & tags.Maximum<256>;
  readonly patterns: Array<Patterns> & tags.MaxItems<256>;
}

export interface Patterns {
  readonly p: number & tags.Type<"uint32"> & tags.Maximum<281>;
  readonly width: number & tags.Type<"uint32"> & tags.Maximum<256>;
  readonly height: number & tags.Type<"uint32"> & tags.Maximum<256>;
  readonly cells: Array<string & tags.MinLength<1> & tags.MaxLength<256>> & tags.MinItems<1> & tags.MaxItems<256>;
}
