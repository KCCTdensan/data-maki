from . import utils
from .global_value import g
from .katanuki import katanuki
from .models.answer import Direction, Answer
from .models.problem import Problem

delta = [0, 0, 0, 0]


def solve(problem: Problem):
    g.width = problem["board"]["width"]
    g.height = problem["board"]["height"]
    g.board = problem["board"]["start"][:]
    g.board_goal = problem["board"]["goal"][:]

    # counts of 0~3 in each of columns
    elems_goal = utils.count_elements(g.board_goal)
    g.elems_now = utils.count_elements(g.board)

    utils.print_board()
    global delta

    for i in range(g.height - 1, -1, -1):
        cmped = g.height - i - 1  # counts of columns completed yet
        delta = utils.get_delta(g.elems_now[g.height - 1], elems_goal[i])

        print(f"delta = {delta}")

        un_filled = []
        # only stripe
        for j in range(g.width):
            if delta == [0, 0, 0, 0]:
                break

            cell_lk = int(g.board[g.height - 1][j])
            if delta[cell_lk] <= 0:
                continue

            is_filled = False
            for k in range(g.height - 2, cmped - 1, -1):
                cell_lk = int(g.board[k][j])

                if delta[cell_lk] < 0:
                    # now, only nukigata 0 is used. I can't imagine how to use other nukigata:(
                    katanuki(g.patterns[0], j, k, Direction.UP)
                    is_filled = True

                    delta = utils.get_delta(g.elems_now[g.height - 1], elems_goal[i])

                    break

            if not is_filled:
                un_filled.append(j)

        print(f"unFilled = {un_filled}")
        # unFilled
        for j in un_filled:
            is_filled = False

            print(f"fill row {j}")
            for k in range(1, max(j, g.width - j - 1) + 1):
                # right side
                x = j + k
                print(f"check row {x}")
                if x < g.width:
                    for m in range(g.height - 2, cmped - 1, -1):
                        cell_lk = int(g.board[m][x])

                        if delta[cell_lk] < 0:
                            y = m
                            ln = k
                            irregular = False

                            print(f"bring {cell_lk} from {x} {y}")

                            # if border nukigata confuse
                            if m % 2 == 1:
                                print("protect confusing")
                                # move cell_lk the place confused and move the deepest cell the place not confused
                                katanuki(g.patterns[3], x, y, Direction.UP)
                                irregular = True
                                y = g.height - 2

                            cnt = 0
                            while ln > 0:
                                if ln % 2 == 1:
                                    # border nukigata (else...1*1)
                                    katanuki(
                                        g.patterns[3 * cnt - 1 if cnt != 0 else 0],
                                        x - (1 << cnt),
                                        y,
                                        Direction.LEFT,
                                    )
                                    x -= 1 << cnt

                                ln >>= 1
                                cnt += 1

                            katanuki(g.patterns[0], x, y, Direction.UP)
                            if irregular:
                                katanuki(
                                    g.patterns[0], j + k, g.height - 3, Direction.UP
                                )

                            delta = utils.get_delta(
                                g.elems_now[g.height - 1], elems_goal[i]
                            )

                            is_filled = True
                            break

                if is_filled:
                    break

                # left side
                x = j - k
                print(f"check row {x}")
                if x >= 0:
                    for m in range(g.height - 2, cmped - 1, -1):
                        cell_lk = int(g.board[m][x])

                        if delta[cell_lk] < 0:
                            y = m
                            ln = k
                            irregular = False

                            print(f"bring {cell_lk} from {x} {y}")

                            # if border nukigata confuse
                            if m % 2 == 1:
                                print("protect confusing")
                                # move cell_lk the place confused and move the deepest cell the place not confused
                                katanuki(g.patterns[3], x, y, Direction.UP)
                                irregular = True
                                y = g.height - 2

                            cnt = 0
                            while ln > 0:
                                if ln % 2 == 1:
                                    # border nukigata (else...1*1)
                                    katanuki(
                                        g.patterns[3 * cnt - 1 if cnt != 0 else 0],
                                        x + 1,
                                        y,
                                        Direction.RIGHT,
                                    )
                                    x += 1 << cnt

                                ln >>= 1
                                cnt += 1

                            katanuki(g.patterns[0], x, y, Direction.UP)
                            if irregular:
                                katanuki(
                                    g.patterns[0], j - k, g.height - 3, Direction.UP
                                )

                            delta = utils.get_delta(
                                g.elems_now[g.height - 1], elems_goal[i]
                            )

                            is_filled = True
                            break

                if is_filled:
                    break

        # next column
        katanuki(g.patterns[22], 0, g.height - 1, Direction.DOWN)

        delta = utils.get_delta(g.elems_now[g.height - 1], elems_goal[i])

    """
    g.rv_uldr = True
    g.board_goal = func.list_rv(g.board_goal, g.rv_uldr, g.rv_ud, g.rv_lr)
    g.board_now = func.list_rv(g.board_now, g.rv_uldr, g.rv_ud, g.rv_lr)

    print(f"reversed ULDR: {g.rv_uldr}, UD: {g.rv_ud}, LR: {g.rv_lr},")
    func.print_board()

    """

    for i in range(g.width - 1, -1, -1):
        cmped = g.width - i - 1  # counts of columns completed yet

        # only stripe
        for j in range(g.height):
            cell_cr = int(g.board_goal[j][i])

            if int(g.board[j][g.width - 1]) == cell_cr:
                continue
            for k in range(g.width - 2, cmped - 1, -1):
                cell_lk = int(g.board[j][k])

                if cell_cr == cell_lk:
                    # now, only nukigata 0 is used. I can't imagine how to use other nukigata:(
                    katanuki(g.patterns[0], k, j, Direction.LEFT)
                    break

        # next column
        katanuki(g.patterns[22], g.width - 1, 0, Direction.RIGHT)

    """
    g.board = utils.list_rv(g.board, g.rv_uldr, g.rv_ud, g.rv_lr)
    """

    answer = Answer(g.n, g.ops)

    return answer
