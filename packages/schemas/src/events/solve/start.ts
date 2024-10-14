import type { UIMessageEventBase } from "..";
import type { Board, General } from "../../problem";

export interface SolveStartEvent extends UIMessageEventBase {
  eventName: "solve.start";
  solveId: string;
  workers: number;
  startedAt: Date;
  board: Board;
  general: General;
}
