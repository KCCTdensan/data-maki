import type { UIMessageEventBase } from "..";
import type { SolveFinishedEvent } from "./finished";
import type { SolveProgressEvent } from "./progress";
import type { SolveStartEvent } from "./start";

export type SolveEvents = SolveStartEvent | SolveProgressEvent | SolveFinishedEvent;

export * from "./finished";
export * from "./progress";
export * from "./start";

export const isSolverEvent = (event: UIMessageEventBase): event is SolveEvents => event.eventName.startsWith("solve.");

export const isUIMessageEvent = (event: unknown): event is UIMessageEventBase =>
  typeof event === "object" && event !== null && "eventName" in event;
