import { UIMessageEvent } from "../base";

export class SolveFinishedEvent extends UIMessageEvent {
  constructor() {
    super("solve.finished");
  }
}
