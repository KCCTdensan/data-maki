import { UIMessageEvent } from "../base";

export class SolveProgressEvent extends UIMessageEvent {
  constructor() {
    super("solve.progress");
  }
}
