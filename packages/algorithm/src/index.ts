import type { Answer, Problem } from "@data-maki/schemas";
import { solve as solveV1 } from "./workers/v1.master";
import { solve as solveV2 } from "./workers/v2.master";
import { solve as solveVBeam } from "./workers/vbeam.master";
export { easyKatanuki } from "./katanuki";

export const VERSIONS = ["vbeam", "v1", "v2"] as const;

const solveFuncs: { [key in (typeof VERSIONS)[number]]: SolveFunc } = {
  vbeam: solveVBeam,
  v1: solveV1,
  v2: solveV2,
};

export const isSolveFuncVersion = (version: string): version is (typeof VERSIONS)[number] =>
  VERSIONS.includes(version as unknown as (typeof VERSIONS)[number]);

export const getSolveFunc = (version: (typeof VERSIONS)[number]): SolveFunc => solveFuncs[version];
export const LATEST_VERSION = VERSIONS[VERSIONS.length - 1];

export type SolveFunc = (
  problem: Problem,
  onStartWorker?: ((totalWorkers: number) => void | Promise<void>) | undefined,
  onWorkerFinish?: ((workerId: number, answer: Answer) => void | Promise<void>) | undefined,
) => Promise<[answer: Answer, board: string[]]>;
