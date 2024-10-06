import type { Question } from "@data-maki/schemas";
import { StateBase } from "./base.ts";

export class SolvingState extends StateBase {
  static readonly stateName = "Solving";

  constructor(
    readonly id: string,
    readonly question: Question,
  ) {
    super();
  }
}
