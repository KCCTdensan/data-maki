import type { SolverApp } from "@data-maki/solver";
import { hc } from "hono/client";

let solverClient: ReturnType<typeof hc<SolverApp>> | undefined;

export const getSolverClient = (baseUrl: string) => {
  if (!solverClient) {
    solverClient = hc<SolverApp>(baseUrl);
  }

  return solverClient;
};
