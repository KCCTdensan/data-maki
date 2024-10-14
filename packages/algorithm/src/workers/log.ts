import { isProduction, isTest } from "../env";

export const dbg = (self?: Worker, ...args: unknown[]) => {
  if (!(isProduction || isTest) || process.env.SOLVER_DEBUG) {
    self?.postMessage({
      type: "dbg",
      args,
    });
  }
};
