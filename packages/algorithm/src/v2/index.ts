import type { Answer } from "@data-maki/schemas";
import { shallowEqual } from "fast-equals";
import type { FixedLengthArray } from "type-fest";
import { katanuki } from "../katanuki";
import { cellsToBoard } from "../models/answer";
import { type CellCounts, type Context, DOWN, LEFT, type Point, RIGHT, UP } from "../types";
import { dbgCells, multiDereverse, multiReverse } from "../utils/arrays";
import { countElementsColumnWise, getDelta } from "../utils/board";
import { dbg } from "../workers/log";
import { evaluateColumnPiece, evaluateRow } from "./evaluation";

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

    const unfilled = [];

    // Only stripe
    for (const j of Array(c.width).keys()) {
      if (shallowEqual(delta, [0, 0, 0, 0])) break;

      if (cntUnmoved > 0) {
        katanuki(c, 22, 0, c.height - cntUnmoved, DOWN);

        completedRows += cntUnmoved;
        cntUnmoved = 0;
      }

      let lookingCell = c.board.get(c.height - 1, j);

      if (delta[lookingCell] <= 0) continue;

      let isFilled = false;

      for (let k = c.height - 2; k > completedRows - 1; k--) {
        lookingCell = c.board.get(k, j);

        if (delta[lookingCell] < 0) {
          dbg(c.worker, `looking at ${lookingCell} at x: ${j} y: ${k}`);

          let cnt = 0;
          let value: FixedLengthArray<number, 4> = [0, 0, 0, 256];

          while (k - (1 << cnt) + 1 >= completedRows) {
            const x = j;
            const y = k - (1 << cnt) + 1;

            let p = 0;
            let pp: Point = { x: 0, y: 0 };

            let evaluation = 0;

            if (cnt !== 0) {
              p = 3 * cnt - 1;
              pp.x = rvUl && rvUd ? x - 1 : x;
              pp.y = !rvUl && !rvUd ? y + 1 : y;

              evaluation = evaluateRow(c, p, pp, goalElementCounts[i]);

              if (value[3] > evaluation) {
                value = [p, pp.x, pp.y, evaluation];
              }

              p = 3 * cnt;
              pp.x = !rvUl && rvLr ? x - 1 : x;
              pp.y = rvUl && !rvLr ? y + 1 : y;

              evaluation = evaluateRow(c, p, pp, goalElementCounts[i]);

              if (value[3] > evaluation) {
                value = [p, pp.x, pp.y, evaluation];
              }
            } else {
              p = 0;
              pp = { x, y };

              evaluation = evaluateRow(c, p, pp, goalElementCounts[i]);

              if (value[3] > evaluation) {
                value = [p, pp.x, pp.y, evaluation];
              }
            }

            cnt++;
          }

          katanuki(c, value[0], value[1], value[2], UP);

          isFilled = true;

          delta = getDelta(c.currentElementCounts[c.height - 1], goalElementCounts[i]);

          break;
        }
      }

      if (!isFilled) unfilled.push(j);
    }

    dbg(c.worker, "unfilled", unfilled);

    // unfilled
    for (const j of unfilled) {
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

  cntUnmoved = 0;

  for (let i = c.width - 1; i > -1; i--) {
    let completedColumns = c.width - i - 1 - cntUnmoved;
    const goalColumn = c.goalBoard.getColumn(i);

    // Only stripe
    for (const j of Array(c.height).keys()) {
      const correctCell = goalColumn[j];

      if (c.board.get(j, c.width - 1 - cntUnmoved) === correctCell) continue;

      if (cntUnmoved > 0) {
        katanuki(c, 22, c.width - cntUnmoved, 0, RIGHT);

        completedColumns += cntUnmoved;
        cntUnmoved = 0;
      }

      for (let k = c.width - 2; k > completedColumns - 1; k--) {
        const lookingCell = c.board.get(j, k);

        if (lookingCell === correctCell) {
          let cnt = 0;
          let value: FixedLengthArray<number, 4> = [0, 0, 0, 256];

          while (k - (1 << cnt) + 1 >= completedColumns) {
            const x = k - (1 << cnt) + 1;
            const y = j;

            let p = 0;
            let pp: Point = { x: 0, y: 0 };

            let evaluation = 0;

            if (cnt !== 0) {
              p = 3 * cnt - 1;
              pp.x = rvUl && !rvUd ? x + 1 : x;
              pp.y = !rvUl && rvUd ? y - 1 : y;

              evaluation = evaluateColumnPiece(c, p, pp, goalColumn);

              if (value[3] > evaluation) {
                value = [p, pp.x, pp.y, evaluation];
              }

              p = 3 * cnt;
              pp.x = !rvUl && !rvLr ? x + 1 : x;
              pp.y = rvUl && rvLr ? y - 1 : y;

              evaluation = evaluateColumnPiece(c, p, pp, goalColumn);

              if (value[3] > evaluation) {
                value = [p, pp.x, pp.y, evaluation];
              }
            } else {
              p = 0;
              pp = { x, y };

              evaluation = evaluateColumnPiece(c, p, pp, goalColumn);

              if (value[3] > evaluation) {
                value = [p, pp.x, pp.y, evaluation];
              }
            }

            cnt++;
          }

          katanuki(c, value[0], value[1], value[2], LEFT);

          break;
        }
      }
    }

    cntUnmoved++;

    if (i === 0) {
      katanuki(c, 22, c.width - cntUnmoved, 0, RIGHT);
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
