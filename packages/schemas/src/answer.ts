import typia, { type tags } from "typia";

export interface Answer {
  n: number & tags.Type<"uint32"> & tags.Maximum<320000>;
  ops: Array<Op> & tags.MaxItems<320000>;
}

export interface Op {
  p: number & tags.Type<"uint32"> & tags.Maximum<281>;
  x: number & tags.Type<"int32"> & tags.Minimum<-255> & tags.Maximum<255>;
  y: number & tags.Type<"int32"> & tags.Minimum<-255> & tags.Maximum<255>;
  s: number & tags.Type<"uint32"> & tags.Maximum<3>;
}

export interface AnswerResponse {
  revision: number & tags.Type<"uint64">;
}
