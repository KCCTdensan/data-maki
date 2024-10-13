import type { UIMessageEventBase } from "..";
import type { Board } from "../../problem";

export interface SolveStartEvent extends UIMessageEventBase {
  eventName: "solve.start";
  solveId: string;
  workers: number;
  startedAt: Date;
  board: Board;
}
