from threading import Barrier

from . import utils
from .context import Context
from .katanuki import katanuki, katanuki_board
from .models.answer import Answer, Direction
from .models.problem import InternalProblem, Problem
from .evaluation import evaluate_col_elem, evaluate_row_piece

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

    c.width = problem["board"]["width"]
    c.height = problem["board"]["height"]
    c.board = InternalProblem.from_problem(problem)

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
                    cnt = 0
                    value = (0, 0, 0, 256) # value = p, x, y, evaluation
                    while k - (1 << cnt) + 1 >= cmped:
                        x = j
                        y = k - (1 << cnt) + 1
                        p = 0
                        evaluation = 0

                        if cnt != 0:
                            p = cnt * 3 - 1
                            evaluation = evaluate_col_elem(c, p, x, y + 1, elems_goal[i])

                            if value[3] > evaluation:
                                value = (p, x, y + 1, evaluation)

                        p = cnt * 3
                        evaluation = evaluate_col_elem(c, p, x, y, elems_goal[i])

                        if value[3] > evaluation:
                            value = (p, x, y, evaluation)

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

            print(f"fill row {j}")

            for k in range(1, max(j, c.width - j - 1) + 1):
                # right side
                x = j + k

                if x < c.width:
                    print(f"check row {x}")
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
                                katanuki(c, 3, x, y, Direction.UP)
                                irregular = True
                                y = c.height - 2

                            cnt = 0

                            while ln > 0:
                                if ln % 2 == 1:
                                    # border nukigata (else...1*1)
                                    katanuki(
                                        c,
                                        3 * cnt - 1 if cnt != 0 else 0,
                                        x - (1 << cnt),
                                        y,
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
                    print(f"check row {x}")
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
                                katanuki(c, 3, x, y, Direction.UP)
                                irregular = True
                                y = c.height - 2

                            cnt = 0

                            while ln > 0:
                                if ln % 2 == 1:
                                    # border nukigata (else...1*1)
                                    katanuki(
                                        c,
                                        3 * cnt - 1 if cnt != 0 else 0,
                                        x + 1,
                                        y,
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
        cmped = c.width - i - 1 - cnt_unmoved  # counts of rows completed yet
        row_goal = c.board.goal.get_row(i)

        # only border
        for j in range(c.height):
            cell_cr = row_goal[j]

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
                        evaluation = 0

                        if cnt != 0:
                            p = cnt * 3 - 1
                            evaluation = evaluate_row_piece(c, p, x, y, row_goal)

                            if value[3] > evaluation:
                                value = (p, x, y, evaluation)

                            p = cnt * 3
                            evaluation = evaluate_row_piece(c, p, x + 1, y, row_goal)

                            if value[3] > evaluation:
                                value = (p, x + 1, y, evaluation)

                        else:
                            p = 0
                            evaluation = evaluate_row_piece(c, p, x, y, row_goal)

                            if value[3] > evaluation:
                                value = (p, x, y, evaluation)

                        cnt += 1

                    katanuki(c, value[0], value[1], value[2], Direction.LEFT)
                    break

        cnt_unmoved += 1

        if i == 0:
            katanuki(c, 22, c.width - cnt_unmoved, 0, Direction.RIGHT)

    """
    c.board = utils.list_rv(c.board, c.rv_uldr, c.rv_ud, c.rv_lr)
    """

    answer = Answer(c.n, c.ops)

    return answer, c.board
