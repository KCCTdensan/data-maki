import type { Answer } from "@data-maki/schemas";
import { StateBase } from "./base.ts";

export class DoneState extends StateBase {
  static readonly stateName = "Done";

  constructor(
    readonly id: string,
    readonly answer: Answer,
  ) {
    super();
  }
}
