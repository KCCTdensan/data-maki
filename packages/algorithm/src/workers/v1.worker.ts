import type { Problem } from "@data-maki/schemas";
import * as Comlink from "comlink";
import { Barrier } from "../utils/concurrency/barrier";
import { createContext, solve as solveFunc } from "../v1";

declare const self: Worker;

export const solve = (problem: Problem, parentBarrier: Barrier) => {
  const barrier = Barrier.connect(parentBarrier);
  const c = createContext(problem, self);

  barrier.wait();

  return solveFunc(c);
};

Comlink.expose({ solve });
