import type { Answer, Problem } from "@data-maki/schemas";
import { shallowEqual } from "fast-equals";
import { katanuki } from "../katanuki";
import { cellsToBoard } from "../models/answer";
import { patternToInternal } from "../models/pattern";
import { boardToCells } from "../models/problem";
import { type CellCounts, type Context, DOWN, LEFT, RIGHT, UP } from "../types";
import { dbgCells } from "../utils/arrays";
import { countElementsColumnWise, getDelta } from "../utils/board";
import { dbg } from "../workers/log";

export const createContext = (problem: Problem, self?: Worker): Context => {
  const [board, goalBoard] = boardToCells(problem.board);

  return {
    worker: self,
    board,
    goalBoard,

    currentElementCounts: countElementsColumnWise(board),

    patterns: problem.general.patterns.map(patternToInternal),
    width: problem.board.width,
    height: problem.board.height,
    n: 0,
    ops: [],
  };
};

export const solve = (c: Context): [answer: Answer, board: string[]] => {
  dbgCells(c.board, c.worker);

  const goalElementCounts = countElementsColumnWise(c.goalBoard);

  let delta: CellCounts;

  for (let i = c.height - 1; i > -1; i--) {
    const completedColumns = c.height - i - 1;

    delta = getDelta(c.currentElementCounts[c.height - 1], goalElementCounts[i]);

    dbg(c.worker, "delta", delta);

    const unfilled = [];

    // Only stripe
    for (const j of Array(c.width).keys()) {
      if (shallowEqual(delta, [0, 0, 0, 0])) {
        break;
      }

      let lookingCell = c.board.get(c.height - 1, j);

      if (delta[lookingCell] <= 0) continue;

      let isFilled = false;

      for (let k = c.height - 2; k > completedColumns - 1; k--) {
        lookingCell = c.board.get(k, j);

        if (delta[lookingCell] < 0) {
          katanuki(c, 0, j, k, UP);

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
            const lookingCell = c.board.get(m, rx);

            if (delta[lookingCell] < 0) {
              let y = m;
              let ln = k; // How long have to move
              let irregular = false;

              dbg(c.worker, `bring ${lookingCell} from ${rx} ${y}`);

              if (m % 2 === (c.height - 1) % 2) {
                dbg(c.worker, "protect confusion");

                katanuki(c, 3, rx, y, UP);

                irregular = true;
                y = c.height - 2;
              }

              let cnt = 0;

              while (ln > 0) {
                if (ln % 2 === 1) {
                  // border nukigata (else: 1 * 1)
                  katanuki(c, cnt !== 0 ? 3 * cnt - 1 : 0, rx - (1 << cnt), y, LEFT);

                  rx -= 1 << cnt;
                }

                ln >>= 1;
                cnt++;
              }

              katanuki(c, 0, rx, y, UP);

              if (irregular) {
                katanuki(c, 0, j + k, c.height - 3, UP);
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
            const lookingCell = c.board.get(m, lx);

            if (delta[lookingCell] < 0) {
              let y = m;
              let ln = k; // How long have to move
              let irregular = false;

              dbg(c.worker, `bring ${lookingCell} from ${lx} ${y}`);

              if (m % 2 === (c.height - 1) % 2) {
                dbg(c.worker, "protect confusion");

                katanuki(c, 3, lx, y, UP);

                irregular = true;
                y = c.height - 2;
              }

              let cnt = 0;

              while (ln > 0) {
                if (ln % 2 === 1) {
                  // border nukigata (else: 1 * 1)
                  katanuki(c, cnt !== 0 ? 3 * cnt - 1 : 0, lx + 1, y, RIGHT);

                  lx += 1 << cnt;
                }

                ln >>= 1;
                cnt++;
              }

              katanuki(c, 0, lx, y, UP);

              if (irregular) {
                katanuki(c, 0, j - k, c.height - 3, UP);
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
    katanuki(c, 22, 0, c.height - 1, DOWN);
    delta = getDelta(c.currentElementCounts[c.height - 1], goalElementCounts[i]);
  }

  for (let i = c.width - 1; i > -1; i--) {
    const completedColumns = c.width - i - 1;

    // Only stripe
    for (const j of Array(c.height).keys()) {
      const correctCell = c.goalBoard.get(j, i);

      if (c.board.get(j, c.width - 1) === correctCell) continue;

      for (let k = c.width - 2; k > completedColumns - 1; k--) {
        const lookingCell = c.board.get(j, k);

        if (lookingCell === correctCell) {
          // FIXME: katanuki
          katanuki(c, 0, k, j, LEFT);

          break;
        }
      }
    }

    // Next column
    katanuki(c, 22, c.width - 1, 0, RIGHT);
  }

  // c.board = reverseCells(c.board, )

  dbg(c.worker, "turns", c.n);

  return [
    {
      n: c.n,
      ops: c.ops,
    },
    cellsToBoard(c.board),
  ] as const;
};
