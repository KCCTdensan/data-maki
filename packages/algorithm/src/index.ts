import type { Answer, Board, Ops, Question } from "@data-maki/schemas";
import { solve as solveV1 } from "./v1";
import type { ProgressFn } from "./v1/types";

export const VERSIONS = ["v1"] as const;

const solveFuncs: { [key in (typeof VERSIONS)[number]]: SolveFunc } = {
  v1: solveV1,
};

export const isSolveFuncVersion = (version: string): version is (typeof VERSIONS)[number] =>
  VERSIONS.includes(version as unknown as (typeof VERSIONS)[number]);

export const getSolveFunc = (version: (typeof VERSIONS)[number]): SolveFunc => solveFuncs[version];
export const LATEST_VERSION = VERSIONS[VERSIONS.length - 1];

export type SolveFunc = (
  question: Question,
  onProgress: ProgressFn,
  onFinish: (finalBoard: string[]) => void | Promise<void>,
) => Answer;
