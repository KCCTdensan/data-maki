import { StateBase } from "./base.ts";

export class SolvingState extends StateBase {
  readonly id = crypto.randomUUID();

  constructor() {
    super("Solving");
  }
}
