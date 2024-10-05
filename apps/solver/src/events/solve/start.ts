import { UIMessageEvent } from "../base";

export class SolveStartEvent extends UIMessageEvent {
  constructor() {
    super("solve.start");
  }
}
