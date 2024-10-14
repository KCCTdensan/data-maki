import type { SolveEvents } from "@data-maki/schemas";

export const localizeSolverEvent = (event: SolveEvents): string => {
  switch (event.eventName) {
    case "solve.start":
      return "Solve started";
    case "solve.progress":
      return "Solve in progress";
    case "solve.finished":
      return "Solve finished";
  }
};
