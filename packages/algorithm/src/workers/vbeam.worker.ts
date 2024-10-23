import type { Problem } from "@data-maki/schemas";
import * as Comlink from "comlink";
import type { ReverseOperationPatterns } from "../types";
import { Barrier } from "../utils/concurrency/barrier";
import { createContext } from "../v1";
import { solve as solveFunc } from "../vbeam";

declare const self: Worker;

export const solve = (problem: Problem, parentBarrier: Barrier, rvOp: ReverseOperationPatterns) => {
  const barrier = Barrier.connect(parentBarrier);
  const c = createContext(problem, self);

  c.rvOp = rvOp;

  if (c.rvOp.hasReverse90) {
    c.width = problem.board.height;
    c.height = problem.board.width;
  }

  // Other data is modified in the beginning of solveFunc

  barrier.wait();

  return solveFunc(c);
};

Comlink.expose({ solve });
