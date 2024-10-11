import { type Answer, type Problem, fixedPatterns } from "@data-maki/schemas";
import type { General, Pattern } from "@data-maki/schemas";
import { shallowEqual } from "fast-equals";
import { dbg } from "../workers/log";
import { katanuki } from "./katanuki";
import { type CellCounts, type Context, DOWN, LEFT, RIGHT, UP } from "./types";
import { countElementsColumnWise, dbgBoard, getDelta } from "./utils";

export const createContext = (problem: Problem, self?: Worker): Context => ({
  worker: self,
  board: problem.board.start,
  goalBoard: problem.board.goal,

  currentElementCounts: countElementsColumnWise(problem.board.start, problem.board.height),

  width: problem.board.width,
  height: problem.board.height,
  n: 0,
  ops: [],
});

export const fromPattern = (index: number, general: General): Pattern => {
  if (index < 0 || index >= fixedPatterns.length + 256) {
    throw new Error(`Invalid pattern index: ${index}`);
  }

  return index < fixedPatterns.length ? fixedPatterns[index] : general.patterns[index - fixedPatterns.length];
};

export const solve = (self: Worker, problem: Problem): [answer: Answer, board: string[]] => {
  const { board } = problem;
  const c = createContext(problem, self);

  dbgBoard(c);

  const goalElementCounts = countElementsColumnWise(board.goal, board.height);

  let delta: CellCounts;

  for (let i = board.height - 1; i > -1; i--) {
    const completedColumns = board.height - i - 1;

    delta = getDelta(c.currentElementCounts[c.height - 1], goalElementCounts[i]);

    dbg(c.worker, "delta", delta);

    const unfilled = [];

    // Only stripe
    for (const j of Array(c.width).keys()) {
      if (shallowEqual(delta, [0, 0, 0, 0])) {
        break;
      }

      let lookingCell = Number(c.board[c.height - 1][j]);

      if (delta[lookingCell] <= 0) continue;

      let isFilled = false;

      for (let k = c.height - 2; k > completedColumns - 1; k--) {
        lookingCell = Number(c.board[k][j]);

        if (delta[lookingCell] < 0) {
          katanuki(c, fromPattern(0, problem.general), j, k, UP);

          isFilled = true;

          delta = getDelta(c.currentElementCounts[c.height - 1], goalElementCounts[i]);
          break;
        }
      }

      if (!isFilled) unfilled.push(j);
    }

    dbg(c.worker, "unfilled", unfilled);

    // Clear cell unfilled
    for (const j of unfilled) {
      let isFilled = false;

      dbg(c.worker, "fill row", j);

      for (let k = 1; k <= Math.max(j, c.width - j - 1); k++) {
        // TODO: compare and combine right side and left side

        // right side
        let rx = j + k;

        dbg(c.worker, "check row", rx);

        if (rx < c.width) {
          for (let m = c.height - 2; m >= completedColumns; m--) {
            const lookingCell = Number(c.board[m][rx]);

            if (delta[lookingCell] < 0) {
              let y = m;
              let ln = k; // How long have to move
              let irregular = false;

              dbg(c.worker, `bring ${lookingCell} from ${rx} ${y}`);

              if (m % 2 === (c.height - 1) % 2) {
                dbg(c.worker, "protect confusion");

                katanuki(c, fromPattern(3, problem.general), rx, y, UP);

                irregular = true;
                y = c.height - 2;
              }

              let cnt = 0;

              while (ln > 0) {
                if (ln % 2 === 1) {
                  // border nukigata (else: 1 * 1)
                  katanuki(c, fromPattern(cnt !== 0 ? 3 * cnt - 1 : 0, problem.general), rx - (1 << cnt), y, LEFT);

                  rx -= 1 << cnt;
                }

                ln >>= 1;
                cnt++;
              }

              katanuki(c, fromPattern(0, problem.general), rx, y, UP);

              if (irregular) {
                katanuki(c, fromPattern(0, problem.general), j + k, c.height - 3, UP);
              }

              delta = getDelta(c.currentElementCounts[c.height - 1], goalElementCounts[i]);

              isFilled = true;

              break;
            }
          }
        }

        if (isFilled) break;

        // left side
        let lx = j - k;

        dbg(c.worker, "check row", lx);

        if (lx >= 0) {
          for (let m = c.height - 2; m >= completedColumns; m--) {
            const lookingCell = Number(c.board[m][lx]);

            if (delta[lookingCell] < 0) {
              let y = m;
              let ln = k; // How long have to move
              let irregular = false;

              dbg(c.worker, `bring ${lookingCell} from ${lx} ${y}`);

              if (m % 2 === (c.height - 1) % 2) {
                dbg(c.worker, "protect confusion");

                katanuki(c, fromPattern(3, problem.general), lx, y, UP);

                irregular = true;
                y = c.height - 2;
              }

              let cnt = 0;

              while (ln > 0) {
                if (ln % 2 === 1) {
                  // border nukigata (else: 1 * 1)
                  katanuki(c, fromPattern(cnt !== 0 ? 3 * cnt - 1 : 0, problem.general), lx + 1, y, RIGHT);

                  lx += 1 << cnt;
                }

                ln >>= 1;
                cnt++;
              }

              katanuki(c, fixedPatterns[0], lx, y, UP);

              if (irregular) {
                katanuki(c, fixedPatterns[0], j - k, c.height - 3, UP);
              }

              delta = getDelta(c.currentElementCounts[c.height - 1], goalElementCounts[i]);

              isFilled = true;

              break;
            }
          }
        }

        if (isFilled) break;
      }
    }

    // Next column
    katanuki(c, fixedPatterns[22], 0, c.height - 1, DOWN);
    delta = getDelta(c.currentElementCounts[c.height - 1], goalElementCounts[i]);
  }

  for (let i = c.width - 1; i > -1; i--) {
    const completedColumns = c.width - i - 1;

    // Only stripe
    for (const j of Array(c.height).keys()) {
      const correctCell = Number(c.goalBoard[j][i]);

      if (Number(c.board[j][c.width - 1]) === correctCell) continue;

      for (let k = c.width - 2; k > completedColumns - 1; k--) {
        const lookingCell = Number(c.board[j][k]);

        if (lookingCell === correctCell) {
          // FIXME: katanuki
          katanuki(c, fixedPatterns[0], k, j, LEFT);

          break;
        }
      }
    }

    // Next column
    katanuki(c, fixedPatterns[22], c.width - 1, 0, RIGHT);
  }

  // c.board = reverseCells(c.board, )

  dbg(c.worker, "turns", c.n);

  return [
    {
      n: c.n,
      ops: c.ops,
    },
    c.board,
  ] as const;
};
