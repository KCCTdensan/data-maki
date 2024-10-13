from threading import Barrier

from . import utils
from .context import Context
from .katanuki import katanuki, katanuki_board
from .models.answer import Answer, Direction
from .models.problem import InternalProblem, Problem
from .evaluation import evaluate_row_elem, evaluate_col_piece

TOTAL_WORKERS = 1

worker_barrier = Barrier(TOTAL_WORKERS, timeout=10)


def solve(problem: Problem):
    worker_barrier.reset()

    worker = utils.ReturnableThread(target=solve_worker, args=(problem,))

    print("start worker")
    worker.start()

    return worker.join()


def solve_worker(problem: Problem):
    c = Context()

    delta = [0, 0, 0, 0]

    worker_barrier.wait()

    rv_ul = False
    rv_ud = False
    rv_lr = False

    c.rv_op.has_reverse90 = rv_ul
    c.rv_op.has_reverse_up_down = rv_ud
    c.rv_op.has_reverse_left_right = rv_lr

    if c.rv_op.has_reverse90:
        c.width = problem["board"]["height"]
        c.height = problem["board"]["width"]
    else:
        c.width = problem["board"]["width"]
        c.height = problem["board"]["height"]

    c.board = InternalProblem.from_problem(problem)

    c.board.current = utils.reverse(c.board.current, c.rv_op)
    c.board.goal = utils.reverse(c.board.goal, c.rv_op)

    # counts of 0~3 in each of columns
    elems_goal = utils.count_elements(c.board.goal)
    c.elems_now = utils.count_elements(c.board.current)

    utils.print_board(c.board.current)

    cnt_unmoved = 0
    for i in range(c.height - 1, -1, -1):
        cmped = c.height - i - 1 - cnt_unmoved  # counts of columns completed yet
        delta = utils.get_delta(c.elems_now[c.height - 1 - cnt_unmoved], elems_goal[i])

        print(f"delta = {delta}")

        unfilled = []

        # only stripe
        for j in range(c.width):
            if delta == [0, 0, 0, 0]:
                break

            if cnt_unmoved > 0:
                katanuki(c, 22, 0, c.height - cnt_unmoved, Direction.DOWN)
                cmped += cnt_unmoved
                cnt_unmoved = 0

            cell_lk = c.board.current.get(c.height - 1, j)

            if delta[cell_lk] <= 0:
                continue

            is_filled = False

            for k in range(c.height - 2, cmped - 1, -1):
                cell_lk = c.board.current.get(k, j)

                if delta[cell_lk] < 0:
                    print(f"looking at {cell_lk} on x: {j} y: {k}")
                    cnt = 0
                    value = (0, 0, 0, 256)  # value = p, x, y, evaluation
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
                            evaluation = evaluate_row_elem(c, p, px, py, elems_goal[i])

                            if value[3] > evaluation:
                                value = (p, px, py, evaluation)

                            p = cnt * 3
                            px = x - 1 if not rv_ul and rv_lr else x
                            py = y + 1 if rv_ul and not rv_lr else y
                            evaluation = evaluate_row_elem(c, p, px, py, elems_goal[i])

                            if value[3] > evaluation:
                                value = (p, px, py, evaluation)

                        else:
                            p = 0
                            px = x
                            py = y
                            evaluation = evaluate_row_elem(c, p, px, py, elems_goal[i])

                            if value[3] > evaluation:
                                value = (p, px, py, evaluation)

                        cnt += 1

                    katanuki(c, value[0], value[1], value[2], Direction.UP)
                    is_filled = True

                    delta = utils.get_delta(c.elems_now[c.height - 1], elems_goal[i])

                    break

            if not is_filled:
                unfilled.append(j)

        print(f"unFilled = {unfilled}")

        # unFilled
        for j in unfilled:
            is_filled = False
            cell_lk = c.board.current.get(c.height - 1, j)
            if delta[cell_lk] <= 0:
                continue

            print(f"fill column {j}")

            for k in range(1, max(j, c.width - j - 1) + 1):
                # right side
                x = j + k

                if x < c.width:
                    print(f"check column {x}")
                    for m in range(c.height - 2, cmped - 1, -1):
                        cell_lk = c.board.current.get(m, x)

                        if delta[cell_lk] < 0:
                            y = m
                            ln = k
                            irregular = False

                            print(f"bring {cell_lk} from {x} {y}")

                            # if border nukigata confuse
                            if m % 2 == (c.height - 1) % 2:
                                print("protect confusing")
                                # move cell_lk the place confused and move the deepest cell the place not confused
                                katanuki(
                                    c,
                                    2 if rv_ul else 3,
                                    x if not rv_ul and not rv_lr or rv_ul and not rv_ud else x - 1,
                                    y,
                                    Direction.UP,
                                )
                                irregular = True
                                y = c.height - 2

                            cnt = 0

                            while ln > 0:
                                if ln % 2 == 1:
                                    # border nukigata (else...1*1)
                                    katanuki(
                                        c,
                                        0 if cnt == 0 else 3 * cnt if rv_ul else 3 * cnt - 1,
                                        x - (1 << cnt),
                                        y if not rv_ud and not rv_ul or not rv_lr and rv_ul or cnt == 0 else y - 1,
                                        Direction.LEFT,
                                    )
                                    x -= 1 << cnt

                                ln >>= 1
                                cnt += 1

                            katanuki(c, 0, x, y, Direction.UP)

                            if irregular:
                                katanuki(c, 0, j + k, c.height - 3, Direction.UP)

                            delta = utils.get_delta(c.elems_now[c.height - 1], elems_goal[i])

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

                        if delta[cell_lk] < 0:
                            y = m
                            ln = k
                            irregular = False

                            print(f"bring {cell_lk} from {x} {y}")

                            # if border nukigata confuse
                            if m % 2 == (c.height - 1) % 2:
                                print("protect confusing")

                                # move cell_lk the place confused and move the deepest cell the place not confused
                                katanuki(
                                    c,
                                    2 if rv_ul else 3,
                                    x if not rv_ul and not rv_lr or rv_ul and not rv_ud else x - 1,
                                    y,
                                    Direction.UP,
                                )
                                irregular = True
                                y = c.height - 2

                            cnt = 0

                            while ln > 0:
                                if ln % 2 == 1:
                                    # border nukigata (else...1*1)
                                    katanuki(
                                        c,
                                        0 if cnt == 0 else 3 * cnt if rv_ul else 3 * cnt - 1,
                                        x + 1,
                                        y if not rv_ud and not rv_ul or not rv_lr and rv_ul or cnt == 0 else y - 1,
                                        Direction.RIGHT,
                                    )

                                    x += 1 << cnt

                                ln >>= 1
                                cnt += 1

                            katanuki(c, 0, x, y, Direction.UP)

                            if irregular:
                                katanuki(c, 0, j - k, c.height - 3, Direction.UP)

                            delta = utils.get_delta(c.elems_now[c.height - 1], elems_goal[i])

                            is_filled = True

                            break

                if is_filled:
                    break

        cnt_unmoved += 1

        if i == 0:
            katanuki(c, 22, 0, c.height - cnt_unmoved, Direction.DOWN)

    cnt_unmoved = 0
    for i in range(c.width - 1, -1, -1):
        cmped = c.width - i - 1 - cnt_unmoved  # counts of columns completed yet
        column_goal = c.board.goal.get_column(i)

        # only border
        for j in range(c.height):
            cell_cr = column_goal[j]

            if c.board.current.get(j, c.width - 1 - cnt_unmoved) == cell_cr:
                continue

            if cnt_unmoved > 0:
                katanuki(c, 22, c.width - cnt_unmoved, 0, Direction.RIGHT)
                cmped += cnt_unmoved
                cnt_unmoved = 0

            for k in range(c.width - 2, cmped - 1, -1):
                cell_lk = c.board.current.get(j, k)

                if cell_cr == cell_lk:
                    cnt = 0
                    value = (0, 0, 0, 256)
                    while k - (1 << cnt) + 1 >= cmped:
                        x = k - (1 << cnt) + 1
                        y = j
                        p = 0
                        px = 0
                        py = 0
                        evaluation = 0

                        if cnt != 0:
                            p = cnt * 3 - 1
                            px = x + 1 if rv_ul and not rv_ud else x
                            py = y - 1 if not rv_ul and rv_ud else y
                            evaluation = evaluate_col_piece(c, p, px, py, column_goal)

                            if value[3] > evaluation:
                                value = (p, px, py, evaluation)

                            p = cnt * 3
                            px = x + 1 if not rv_ul and not rv_lr else x
                            py = y - 1 if rv_ul and rv_lr else y
                            evaluation = evaluate_col_piece(c, p, px, py, column_goal)

                            if value[3] > evaluation:
                                value = (p, px, py, evaluation)

                        else:
                            p = 0
                            px = x
                            py = y
                            evaluation = evaluate_col_piece(c, p, px, py, column_goal)

                            if value[3] > evaluation:
                                value = (p, px, py, evaluation)

                        cnt += 1

                    katanuki(c, value[0], value[1], value[2], Direction.LEFT)
                    break

        cnt_unmoved += 1

        if i == 0:
            katanuki(c, 22, c.width - cnt_unmoved, 0, Direction.RIGHT)

    c.board.current = utils.dereverse(c.board.current, c.rv_op)
    c.board.goal = utils.dereverse(c.board.goal, c.rv_op)

    print("dereverse")
    utils.print_board(c.board.current)

    answer = Answer(c.n, c.ops)

    return answer, c.board
