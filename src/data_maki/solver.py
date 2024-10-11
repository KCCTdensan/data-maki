from threading import Barrier

from . import utils
from .context import Context
from .katanuki import katanuki
from .models.answer import Answer, Direction
from .models.problem import InternalProblem, Problem

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

    for i in range(c.height - 1, -1, -1):
        cmped = c.height - i - 1  # counts of columns completed yet
        delta = utils.get_delta(c.elems_now[c.height - 1], elems_goal[i])

        print(f"delta = {delta}")

        unfilled = []

        # only stripe
        for j in range(c.width):
            if delta == [0, 0, 0, 0]:
                break

            cell_lk = c.board.current.get(c.height - 1, j)

            if delta[cell_lk] <= 0:
                continue

            is_filled = False

            for k in range(c.height - 2, cmped - 1, -1):
                cell_lk = c.board.current.get(k, j)

                if delta[cell_lk] < 0:
                    # now, only nukigata 0 is used. I can't imagine how to use other nukigata:(
                    katanuki(c, 0, j, k, Direction.UP)
                    is_filled = True

                    delta = utils.get_delta(c.elems_now[c.height - 1], elems_goal[i])

                    break

            if not is_filled:
                unfilled.append(j)

        print(f"unFilled = {unfilled}")

        # unFilled
        for j in unfilled:
            is_filled = False

            print(f"fill row {j}")

            for k in range(1, max(j, c.width - j - 1) + 1):
                # right side
                x = j + k
                print(f"check row {x}")

                if x < c.width:
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

                print(f"check row {x}")

                if x >= 0:
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

        # next column
        katanuki(c, 22, 0, c.height - 1, Direction.DOWN)

        delta = utils.get_delta(c.elems_now[c.height - 1], elems_goal[i])

    """
    c.rv_uldr = True
    c.board.goal = func.list_rv(c.board.goal, c.rv_uldr, c.rv_ud, c.rv_lr)
    c.board_now = func.list_rv(c.board_now, c.rv_uldr, c.rv_ud, c.rv_lr)

    print(f"reversed ULDR: {c.rv_uldr}, UD: {c.rv_ud}, LR: {c.rv_lr},")
    func.print_board()

    """

    for i in range(c.width - 1, -1, -1):
        cmped = c.width - i - 1  # counts of columns completed yet

        # only stripe
        for j in range(c.height):
            cell_cr = c.board.goal.get(j, i)

            if c.board.current.get(j, c.width - 1) == cell_cr:
                continue

            for k in range(c.width - 2, cmped - 1, -1):
                cell_lk = c.board.current.get(j, k)

                if cell_cr == cell_lk:
                    # now, only nukigata 0 is used. I can't imagine how to use other nukigata:(
                    katanuki(c, 0, k, j, Direction.LEFT)
                    break

        # next column
        katanuki(c, 22, c.width - 1, 0, Direction.RIGHT)

    """
    c.board = utils.list_rv(c.board, c.rv_uldr, c.rv_ud, c.rv_lr)
    """

    answer = Answer(c.n, c.ops)

    return answer, c.board