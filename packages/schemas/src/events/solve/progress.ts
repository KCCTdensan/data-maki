import type { UIMessageEventBase } from "..";

export interface SolveProgressEvent extends UIMessageEventBase {
  eventName: "solve.progress";
  solveId: string;
  workerId: number;
  turns: number;
}
