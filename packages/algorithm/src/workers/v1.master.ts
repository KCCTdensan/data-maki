import * as Comlink from "comlink";
import type { SolveFunc } from "../index";
import { Barrier } from "../utils/concurrency/barrier";
import { spawnWorker } from "../workers";

export const solve: SolveFunc = async (problem) => {
  const barrier = new Barrier(1);
  const worker = Comlink.wrap<typeof import("./v1.worker.ts")>(spawnWorker("v1.worker.ts"));

  return worker.solve(problem, barrier);
};
