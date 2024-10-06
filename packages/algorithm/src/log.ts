import { isProduction } from "./env";

export const dbg = (...args: unknown[]) => {
  if (!isProduction) {
    console.debug(...args);
  }
};
