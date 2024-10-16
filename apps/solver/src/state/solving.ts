import type { Problem } from "@data-maki/schemas";
import { StateBase } from "./base.ts";

export class SolvingState extends StateBase {
  static readonly stateName = "Solving";

  workers = 1;

  constructor(
    readonly id: string,
    readonly startedAt: Date,
    readonly problem: Problem,
  ) {
    super();
  }
}
