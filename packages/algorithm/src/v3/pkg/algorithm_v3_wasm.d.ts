/* tslint:disable */
/* eslint-disable */
/**
 * @param {Problem} problem
 * @param {ReverseOperationPatterns} rv_op
 * @returns {AnswerSet}
 */
export function solve(problem: Problem, rv_op: ReverseOperationPatterns): AnswerSet;
export class Answer {
  free(): void;
  n: number;
  ops: Op[];
}
export class AnswerSet {
  free(): void;
  answer: Answer;
  board: string[];
}
export class Board {
  free(): void;
  goal: string[];
  height: number;
  start: string[];
  width: number;
}
export class General {
  free(): void;
  n: number;
  patterns: Pattern[];
}
export class Op {
  free(): void;
  p: number;
  s: number;
  x: number;
  y: number;
}
export class Pattern {
  free(): void;
  cells: string[];
  height: number;
  p: number;
  width: number;
}
export class Problem {
  free(): void;
  board: Board;
  general: General;
}
export class ReverseOperationPatterns {
  free(): void;
  has_reverse90: boolean;
  has_reverse_left_right: boolean;
  has_reverse_up_down: boolean;
}
