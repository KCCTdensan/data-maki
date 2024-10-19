import type { Problem } from "@data-maki/schemas";
import * as Comlink from "comlink";
import type { ReverseOperationPatterns } from "../types";
import { Barrier } from "../utils/concurrency/barrier";
import { solve as solveFunc } from "../v3";

declare const self: Worker;

export const solve = (problem: Problem, parentBarrier: Barrier, rvOp: ReverseOperationPatterns) => {
  const barrier = Barrier.connect(parentBarrier);

  barrier.wait();

  // @ts-expect-error
  return solveFunc(problem, rvOp);
};

Comlink.expose({ solve });
