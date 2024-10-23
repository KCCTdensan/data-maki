import type { Answer } from "@data-maki/schemas";
import { shallowEqual } from "fast-equals";
import type { FixedLengthArray } from "type-fest";
import { cellsToBoard } from "../models/answer";
import { type CellCounts, type Context, DOWN, LEFT, type Point, RIGHT, UP } from "../types";
import { dbgCells, multiDereverse, multiReverse } from "../utils/arrays";
import { countElementsColumnWise, getDelta } from "../utils/board";
import { dbg } from "../workers/log";
import { evaluateRow } from "./evaluation";
import { katanuki, katanukiBoard } from "./katanuki";

export const solve = (c: Context): [answer: Answer, board: string[]] => {
  c.board = multiReverse(c.board, c.rvOp);
  c.goalBoard = multiReverse(c.goalBoard, c.rvOp);

  c.currentElementCounts = countElementsColumnWise(c.board);
  const goalElementCounts = countElementsColumnWise(c.goalBoard);

  dbg(c.worker, "My rvOp", c.rvOp);

  dbgCells(c.board, c.worker);

  const rvUl = c.rvOp.hasReverse90;
  const rvUd = c.rvOp.hasReverseUpDown;
  const rvLr = c.rvOp.hasReverseLeftRight;

  let delta: CellCounts;
  let cntUnmoved = 0;

  for (let i = c.height - 1; i > -1; i--) {
    let completedRows = c.height - i - 1 - cntUnmoved;

    delta = getDelta(c.currentElementCounts[c.height - 1 - cntUnmoved], goalElementCounts[i]);

    dbg(c.worker, "delta", delta);

    if (cntUnmoved > 0 && !shallowEqual(delta, [0, 0, 0, 0])) {
      katanuki(c, 22, 0, c.height - cntUnmoved, DOWN);

      completedRows += cntUnmoved;
      cntUnmoved = 0;
    }

    let paths = [[[], c.board.clone(), 0, delta] as const];
    const beamSize = 3;

    for (let j = 0; j < c.width; j++) {
      const temp = [];

      for (const path of paths) {
        if (shallowEqual(path[3], [0, 0, 0, 0])) {
          temp.push(path);

          break;
        }

        let lookingCell = path[1].get(c.height - 1, j);

        if (path[3][lookingCell] <= 0) {
          temp.push(path);

          continue;
        }

        let isFilled = false;

        for (let k = c.height - 2; k > completedRows - 1; k--) {
          lookingCell = path[1].get(k, j);

          if (path[3][lookingCell] < 0) {
            let cnt = 0;
            const values = [];

            while (k - (1 << cnt) + 1 >= completedRows) {
              const x = j;
              const y = k - (1 << cnt) + 1;

              let p = 0;
              let pp: Point = { x: 0, y: 0 };

              let evaluation = 0;

              if (cnt != 0) {
                p = 3 * cnt - 1;
                pp.x = rvUl && rvUd ? x - 1 : x;
                pp.y = !rvUl && !rvUd ? y + 1 : y;

                evaluation = evaluateRow(c, p, pp, goalElementCounts[i]);

                values.push([p, pp.x, pp.y, evaluation]);

                p = 3 * cnt;
                pp.x = !rvUl && rvLr ? x - 1 : x;
                pp.y = rvUl && !rvLr ? y + 1 : y;

                evaluation = evaluateRow(c, p, pp, goalElementCounts[i]);

                values.push([p, pp.x, pp.y, evaluation]);
              } else {
                p = 0;
                pp = { x, y };

                evaluation = evaluateRow(c, p, pp, goalElementCounts[i]);

                values.push([p, pp.x, pp.y, evaluation]);
              }

              cnt++;
            }

            for (const value of values) {
              const b = katanukiBoard(c, value[0], value[1], value[2], UP, path[1]);

              temp.push([
                [...path[0], value],
                b,
                value[3],
                getDelta(countElementsColumnWise(b)[c.height - 1], goalElementCounts[i]),
              ] as const);
            }

            isFilled = true;

            break;
          }
        }

        if (!isFilled) {
          temp.push(path);
        }
      }

      temp.sort((a, b) => a[2] - b[2]);

      // @ts-expect-error
      paths = temp.slice(0, beamSize);
    }

    paths.sort((a, b) => a[2] - b[2]);

    for (const value of paths[0][0]) {
      katanuki(c, value[0], value[1], value[2], UP);
    }

    delta = getDelta(c.currentElementCounts[c.height - 1 - cntUnmoved], goalElementCounts[i]);

    // unfilled
    for (const j of Array(c.width).keys()) {
      let isFilled = false;

      const lookingCell = c.board.get(c.height - 1, j);

      if (delta[lookingCell] <= 0) continue;

      dbg(c.worker, "fill column", j);

      for (let k = 1; k < Math.max(j, c.width - j - 1) + 1; k++) {
        // right side
        let rx = j + k;

        if (rx < c.width) {
          dbg(c.worker, "check column", rx);

          for (let m = c.height - 2; m > completedRows - 1; m--) {
            const lookingCell = c.board.get(m, rx);

            if (delta[lookingCell] < 0) {
              let y = m;
              let ln = k;
              let irregular = false;

              dbg(c.worker, `bring ${lookingCell} from ${rx} ${y}`);

              // If border nukigata confuse
              if (m % 2 === (c.height - 1) % 2) {
                dbg(c.worker, "protect confusion");

                // Move lookingCell to the place which is confused and move the deepest cell to the place which is not confused
                katanuki(c, rvUl ? 2 : 3, (!rvUl && !rvLr) || (rvUl && !rvUd) ? rx : rx - 1, y, UP);

                irregular = true;
                y = c.height - 2;
              }

              let cnt = 0;

              while (ln > 0) {
                if (ln % 2 === 1) {
                  // border nukigata (else: 1 * 1)
                  katanuki(
                    c,
                    cnt === 0 ? 0 : rvUl ? 3 * cnt : 3 * cnt - 1,
                    rx - (1 << cnt),
                    (!rvUd && !rvUl) || (!rvLr && rvUl) || cnt === 0 ? y : y - 1,
                    LEFT,
                  );

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

        if (lx >= 0) {
          dbg(c.worker, "check column", lx);

          for (let m = c.height - 2; m > completedRows - 1; m--) {
            const lookingCell = c.board.get(m, lx);

            if (delta[lookingCell] < 0) {
              let y = m;
              let ln = k;
              let irregular = false;

              dbg(c.worker, `bring ${lookingCell} from ${lx} ${y}`);

              // If border nukigata confuse
              if (m % 2 === (c.height - 1) % 2) {
                dbg(c.worker, "protect confusion");

                // Move lookingCell to the place which is confused and move the deepest cell to the place which is not confused
                katanuki(c, rvUl ? 2 : 3, (!rvUl && !rvLr) || (rvUl && !rvUd) ? lx : lx - 1, y, UP);

                irregular = true;
                y = c.height - 2;
              }

              let cnt = 0;

              while (ln > 0) {
                if (ln % 2 === 1) {
                  // border nukigata (else: 1 * 1)
                  katanuki(
                    c,
                    cnt === 0 ? 0 : rvUl ? 3 * cnt : 3 * cnt - 1,
                    lx + 1,
                    (!rvUd && !rvUl) || (!rvLr && rvUl) || cnt === 0 ? y : y - 1,
                    RIGHT,
                  );

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

              cntUnmoved = 0;

              break;
            }
          }
        }

        if (isFilled) break;
      }
    }

    cntUnmoved++;

    if (i === 0) {
      katanuki(c, 22, 0, c.height - cntUnmoved, DOWN);
    }
  }

  for (let i = c.height - 1; i > -1; i--) {
    const goalRow = c.goalBoard.getRow(i);

    if (shallowEqual(c.board.getRow(i), goalRow)) continue;

    // Only stripe
    for (let j = c.width - 1; j > -1; j--) {
      const completedRows = c.width - j - 1;
      const correctCell = goalRow[j];

      for (let k = c.width - 1; k > completedRows - 1; k--) {
        const lookingCell = c.board.get(i, k);

        if (lookingCell === correctCell) {
          katanuki(c, 0, k, i, RIGHT);

          break;
        }
      }
    }
  }

  dbg(c.worker, "dereverse");

  c.board = multiDereverse(c.board, c.rvOp);
  c.goalBoard = multiDereverse(c.goalBoard, c.rvOp);

  dbgCells(c.board, c.worker);

  dbg(c.worker, "turns", c.n);

  return [
    {
      n: c.n,
      ops: c.ops,
    },
    cellsToBoard(c.board),
  ] as const;
};
