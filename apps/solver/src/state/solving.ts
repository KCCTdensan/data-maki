import type { Question } from "@data-maki/schemas";
import { StateBase } from "./base.ts";

export class SolvingState extends StateBase {
  constructor(
    readonly id: string,
    readonly question: Question,
  ) {
    super("Solving");
  }
}
