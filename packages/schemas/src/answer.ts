import type { tags } from "typia";

// Example schema

export interface Answer {
  n: number & tags.Type<"uint32">;
}
