import * as Comlink from "comlink";
import type { SolveFunc } from "../index";
import { spawnWorker } from "../workers";

export const solve: SolveFunc = async (question) => {
  const worker = Comlink.wrap<typeof import("./v1.worker.ts")>(spawnWorker("v1.worker.ts"));

  return worker.solve(question);
};
