import type { UIMessageEventBase } from "..";

export interface SolveFinishedEvent extends UIMessageEventBase {
  eventName: "solve.finished";
  solveId: string;
  correct: boolean;
  turns: number;
  revision: number;
}
