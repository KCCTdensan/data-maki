import type { Answer, Board, Question } from "@data-maki/schemas";
import { solve as solveV1 } from "./v1";

export const VERSIONS = ["v1"] as const;

const solveFuncs: { [key in (typeof VERSIONS)[number]]: () => SolveFunc } = {
  v1: () => solveV1,
};

export const LATEST_VERSION = VERSIONS[VERSIONS.length - 1];

export type SolveFunc = (question: Question, onProgress: (board: Board) => void | Promise<void>) => Answer;
