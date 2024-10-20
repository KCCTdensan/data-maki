import cProfile
from copy import deepcopy
from threading import Barrier

from . import utils
from .context import Context
from .evaluation import evaluate_row_elem
from .katanuki import katanuki, katanuki_board
from .models.answer import Answer, Direction
from .models.problem import InternalProblem, Problem
from .models.replay import CellsMark, ExtraOpInfo, MarkType, ReplayInfo
from .models.result import Result

TOTAL_WORKERS = 8

worker_barrier = Barrier(TOTAL_WORKERS, timeout=10)


def solve(problem: Problem):
    worker_barrier.reset()

    flgs: list[list[bool]] = []

    for i in range(TOTAL_WORKERS):
        flgs.append([False, False, False])
        for j in range(3):
            if (i >> j) & 1:
                flgs[i][2 - j] = True

    workers: list[(int, utils.ReturnableThread)] = []
    c = list(Context() for _ in range(TOTAL_WORKERS))
    for i, flg in enumerate(flgs):
        workers.append(
            (
                i,
                utils.ReturnableThread(
                    target=solve_worker,
                    args=(deepcopy(problem), c[i], flg[0], flg[1], flg[2]),
                ),
            ),
        )
        print(flg[0], flg[1], flg[2])

        print(f"start worker {i}")
        workers[i][1].start()

    # datas: list[list[Answer, InternalProblem, ReplayInfo]] = []
    datas: list[Result] = [None] * TOTAL_WORKERS

    cnt = TOTAL_WORKERS

    while cnt > 0:
        del_idx = []
        for j, (i, worker) in enumerate(workers):
            if not worker._is_alive():
                datas[i] = worker.join()
                # print(json.dumps(datas[TOTAL_WORKERS-cnt], indent=2, cls=EnhancedJSONEncoder))
                print(datas[i].answer.n)
                cnt -= 1
                del_idx.append(j)
        del_idx.sort(reverse=True)
        for idx in del_idx:
            workers.pop(idx)

    return datas


def solve_worker(problem: Problem, c: Context, rv_ul: bool, rv_ud: bool, rv_lr: bool):
    worker_barrier.wait()

    # rv_ul = False
    # rv_ud = False
    # rv_lr = False

    c.rv_op.has_reverse90 = rv_ul
    c.rv_op.has_reverse_up_down = rv_ud
    c.rv_op.has_reverse_left_right = rv_lr

    if c.rv_op.has_reverse90:
        c.width = problem["board"]["height"]
        c.height = problem["board"]["width"]
    else:
        c.width = problem["board"]["width"]
        c.height = problem["board"]["height"]

    c.info_now = ExtraOpInfo(
        CellsMark(MarkType.POINT, 0, 0), CellsMark(MarkType.ROW, 0, None), [0, 0, 0, 0]
    )

    c.board = InternalProblem.from_problem(problem)

    c.board.current = utils.reverse(c.board.current, c.rv_op)
    c.board.goal = utils.reverse(c.board.goal, c.rv_op)

    # counts of 0~3 in each of columns
    elems_goal = utils.count_elements(c.board.goal)
    c.elems_now = utils.count_elements(c.board.current)

    print(
        f"My rv_op: {c.rv_op.has_reverse90}, {c.rv_op.has_reverse_up_down}, {c.rv_op.has_reverse_left_right}"
    )

    utils.print_board(c.board.current)

    # ---------------------------------------------------------------------------------------

    cnt_unmoved = 0
    c.info_now.goalMark.type = MarkType.ROW
    for i in range(c.height - 1, -1, -1):
        c.info_now.goalMark.index = i
        cmped = c.height - i - 1 - cnt_unmoved  # counts of columns completed yet
        c.info_now.delta = utils.get_delta(
            c.elems_now[c.height - 1 - cnt_unmoved], elems_goal[i]
        )

        print(f"delta = {c.info_now.delta}")

        if cnt_unmoved > 0 and c.info_now.delta != [0, 0, 0, 0]:
            c.info_now.currentMark.index = c.height - cnt_unmoved
            c.info_now.currentMark.index2 = 0
            katanuki(c, 22, 0, c.height - cnt_unmoved, Direction.DOWN)
            cmped += cnt_unmoved
            cnt_unmoved = 0
            c.info_now.currentMark.index = c.height - 1

        paths = [([], c.board.current.copy(), 0, c.info_now.delta)]
        beam_size = 3

        # only stripe
        for j in range(c.width):
            temp = []
            # print(f"j = {j}, num = {len(paths)}")
            for path in paths:
                # print(path[0])
                # utils.print_board(path[1])
                if path[3] == [0, 0, 0, 0]:
                    temp.append(path)
                    break

                cell_lk = path[1].get(c.height - 1, j)

                if path[3][cell_lk] <= 0:
                    temp.append(path)
                    print("added")
                    continue

                is_filled = False

                for k in range(c.height - 2, cmped - 1, -1):
                    cell_lk = path[1].get(k, j)

                    if path[3][cell_lk] < 0:
                        print(f"looking at {cell_lk} on x: {j} y: {k}")
                        cnt = 0
                        values = []
                        while k - (1 << cnt) + 1 >= cmped:
                            x = j
                            y = k - (1 << cnt) + 1
                            p = 0
                            px = 0
                            py = 0
                            evaluation = 0

                            if cnt != 0:
                                p = cnt * 3 - 1
                                px = x - 1 if rv_ul and rv_ud else x
                                py = y + 1 if not rv_ul and not rv_ud else y
                                evaluation = evaluate_row_elem(
                                    c, p, px, py, elems_goal[i]
                                )

                                values.append((p, px, py, evaluation))

                                p = cnt * 3
                                px = x - 1 if not rv_ul and rv_lr else x
                                py = y + 1 if rv_ul and not rv_lr else y
                                evaluation = evaluate_row_elem(
                                    c, p, px, py, elems_goal[i]
                                )

                                values.append((p, px, py, evaluation))

                            else:
                                p = 0
                                px = x
                                py = y
                                evaluation = evaluate_row_elem(
                                    c, p, px, py, elems_goal[i]
                                )

                                values.append((p, px, py, evaluation))

                            cnt += 1

                        for value in values:
                            b = katanuki_board(
                                c, value[0], value[1], value[2], Direction.UP, path[1]
                            )
                            temp.append(
                                (
                                    [*path[0], value],
                                    b,
                                    value[3],
                                    utils.get_delta(
                                        utils.count_elements(b)[c.height - 1],
                                        elems_goal[i],
                                    ),
                                )
                            )
                        is_filled = True

                        break

                if not is_filled:
                    print("added")
                    temp.append(path)

            temp.sort(key=lambda x: x[2])
            paths = temp[:beam_size]

        paths.sort(key=lambda x: x[2])

        for value in paths[0][0]:
            c.info_now.currentMark.index = value[2]
            c.info_now.currentMark.index2 = value[1]
            katanuki(c, value[0], value[1], value[2], Direction.UP)

        c.info_now.delta = utils.get_delta(
            c.elems_now[c.height - 1 - cnt_unmoved], elems_goal[i]
        )

        # unFilled
        for j in range(c.width):
            is_filled = False
            cell_lk = c.board.current.get(c.height - 1, j)
            if c.info_now.delta[cell_lk] <= 0:
                continue

            print(f"fill column {j}")

            for k in range(1, max(j, c.width - j - 1) + 1):
                # right side
                x = j + k

                if x < c.width:
                    print(f"check column {x}")
                    for m in range(c.height - 2, cmped - 1, -1):
                        cell_lk = c.board.current.get(m, x)

                        if c.info_now.delta[cell_lk] < 0:
                            y = m
                            ln = k
                            irregular = False

                            print(f"bring {cell_lk} from {x} {y}")

                            # if border nukigata confuse
                            if m % 2 == (c.height - 1) % 2:
                                print("protect confusing")

                                c.info_now.currentMark.index = y
                                c.info_now.currentMark.index2 = x
                                # move cell_lk the place confused and move the deepest cell the place not confused
                                katanuki(
                                    c,
                                    2 if rv_ul else 3,
                                    x
                                    if not rv_ul and not rv_lr or rv_ul and not rv_ud
                                    else x - 1,
                                    y,
                                    Direction.UP,
                                )
                                c.info_now.delta = utils.get_delta(
                                    c.elems_now[c.height - 1], elems_goal[i]
                                )
                                irregular = True
                                y = c.height - 2

                            cnt = 0

                            while ln > 0:
                                if ln % 2 == 1:
                                    # border nukigata (else...1*1)
                                    c.info_now.currentMark.index = y
                                    c.info_now.currentMark.index2 = x
                                    katanuki(
                                        c,
                                        0
                                        if cnt == 0
                                        else 3 * cnt
                                        if rv_ul
                                        else 3 * cnt - 1,
                                        x - (1 << cnt),
                                        y
                                        if not rv_ud
                                        and not rv_ul
                                        or not rv_lr
                                        and rv_ul
                                        or cnt == 0
                                        else y - 1,
                                        Direction.LEFT,
                                    )
                                    x -= 1 << cnt

                                ln >>= 1
                                cnt += 1

                            c.info_now.currentMark.index = y
                            c.info_now.currentMark.index2 = x
                            katanuki(c, 0, x, y, Direction.UP)

                            if irregular:
                                c.info_now.delta = utils.get_delta(
                                    c.elems_now[c.height - 1], elems_goal[i]
                                )
                                c.info_now.currentMark.index = c.height - 3
                                c.info_now.currentMark.index2 = j + k
                                katanuki(c, 0, j + k, c.height - 3, Direction.UP)

                            c.info_now.delta = utils.get_delta(
                                c.elems_now[c.height - 1], elems_goal[i]
                            )

                            is_filled = True

                            break

                if is_filled:
                    break

                # left side
                x = j - k

                if x >= 0:
                    print(f"check column {x}")
                    for m in range(c.height - 2, cmped - 1, -1):
                        cell_lk = c.board.current.get(m, x)

                        if c.info_now.delta[cell_lk] < 0:
                            y = m
                            ln = k
                            irregular = False

                            print(f"bring {cell_lk} from {x} {y}")

                            # if border nukigata confuse
                            if m % 2 == (c.height - 1) % 2:
                                print("protect confusing")

                                c.info_now.currentMark.index = y
                                c.info_now.currentMark.index2 = x
                                # move cell_lk the place confused and move the deepest cell the place not confused
                                katanuki(
                                    c,
                                    2 if rv_ul else 3,
                                    x
                                    if not rv_ul and not rv_lr or rv_ul and not rv_ud
                                    else x - 1,
                                    y,
                                    Direction.UP,
                                )
                                c.info_now.delta = utils.get_delta(
                                    c.elems_now[c.height - 1], elems_goal[i]
                                )
                                irregular = True
                                y = c.height - 2

                            cnt = 0

                            while ln > 0:
                                if ln % 2 == 1:
                                    # border nukigata (else...1*1)
                                    c.info_now.currentMark.index = y
                                    c.info_now.currentMark.index2 = x
                                    katanuki(
                                        c,
                                        0
                                        if cnt == 0
                                        else 3 * cnt
                                        if rv_ul
                                        else 3 * cnt - 1,
                                        x + 1,
                                        y
                                        if not rv_ud
                                        and not rv_ul
                                        or not rv_lr
                                        and rv_ul
                                        or cnt == 0
                                        else y - 1,
                                        Direction.RIGHT,
                                    )

                                    x += 1 << cnt

                                ln >>= 1
                                cnt += 1

                            c.info_now.currentMark.index = y
                            c.info_now.currentMark.index2 = x
                            katanuki(c, 0, x, y, Direction.UP)

                            if irregular:
                                c.info_now.delta = utils.get_delta(
                                    c.elems_now[c.height - 1], elems_goal[i]
                                )
                                c.info_now.currentMark.index = c.height - 3
                                c.info_now.currentMark.index2 = j - k
                                katanuki(c, 0, j - k, c.height - 3, Direction.UP)

                            c.info_now.delta = utils.get_delta(
                                c.elems_now[c.height - 1], elems_goal[i]
                            )

                            is_filled = True

                            break

                if is_filled:
                    break

        cnt_unmoved += 1

        if i == 0:
            c.info_now.currentMark.index = c.height - cnt_unmoved
            c.info_now.currentMark.index2 = 0
            katanuki(c, 22, 0, c.height - cnt_unmoved, Direction.DOWN)

    c.info_now.delta = None

    for i in range(c.height - 1, -1, -1):
        c.info_now.goalMark.index = i
        row_goal = c.board.goal.get_row(i)

        if c.board.current.get_row(i) == row_goal:
            continue

        # only border
        for j in range(c.width - 1, -1, -1):
            cmped = c.width - j - 1
            cell_cr = row_goal[j]

            for k in range(c.width - 1, cmped - 1, -1):
                cell_lk = c.board.current.get(i, k)

                if cell_cr == cell_lk:
                    c.info_now.currentMark.index = i
                    c.info_now.currentMark.index2 = k
                    katanuki(c, 0, k, i, Direction.RIGHT)
                    break

    c.board.current = utils.dereverse(c.board.current, c.rv_op)
    c.board.goal = utils.dereverse(c.board.goal, c.rv_op)

    print("dereverse")
    utils.print_board(c.board.current)

    answer = Answer(c.n, c.ops)

    replay = ReplayInfo(problem, answer, c.info)

    result = Result(answer, c.board, replay)

    # print(json.dumps(replay, indent=2, cls=EnhancedJSONEncoder))

    return result
