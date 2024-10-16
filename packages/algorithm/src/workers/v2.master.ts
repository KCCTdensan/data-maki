import * as Comlink from "comlink";
import type { FixedLengthArray } from "type-fest";
import type { SolveFunc } from "../index";
import { Barrier } from "../utils/concurrency/barrier";
import { spawnWorker } from "../workers";

const TOTAL_WORKERS = 8;

type Flags = FixedLengthArray<FixedLengthArray<boolean, 3>, typeof TOTAL_WORKERS>;

export const solve: SolveFunc = async (problem, onStartWorker, onWorkerFinish) => {
  const barrier = new Barrier(TOTAL_WORKERS);

  onStartWorker?.(TOTAL_WORKERS);

  const flags = Array.from({ length: TOTAL_WORKERS }, () => [false, false, false]) as unknown as Flags;

  for (let i = 0; i < TOTAL_WORKERS; i++) {
    for (let j = 0; j < 3; j++) {
      if ((i >> j) & 1) {
        flags[i][2 - j] = true;
      }
    }
  }

  const workers = Array(TOTAL_WORKERS)
    .fill(null)
    .map(() => Comlink.wrap<typeof import("./v2.worker.ts")>(spawnWorker("v2.worker.ts")));

  const results = await Promise.all(
    workers.map((worker, i) =>
      worker
        .solve(problem, barrier, {
          hasReverse90: flags[i][0],
          hasReverseUpDown: flags[i][1],
          hasReverseLeftRight: flags[i][2],
        })
        .then((result) => {
          onWorkerFinish?.(i, result[0].n);

          return result;
        }),
    ),
  );

  return results.toSorted((a, b) => a[0].n - b[0].n)[0];
};
