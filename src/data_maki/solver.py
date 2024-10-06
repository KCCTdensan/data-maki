from data_maki.global_value import g
import data_maki.constant_numbers as cn
import data_maki.utils as utils
from data_maki.katanuki import katanuki
from data_maki.create_patterns import create_patterns


def solve():
    g.board_goal = g.board["goal"][:]
    g.board_now = g.board["start"][:]

    create_patterns()

    # counts of 0~3 in each of columns
    elems_goal = utils.count_elements(g.board_goal)
    g.elems_now = utils.count_elements(g.board_now)

    utils.print_board()

    for i in range(g.board["height"] - 1, -1, -1):
        cmped = g.board["height"] - i - 1  # counts of columns completed yet
        utils.get_delta(g.elems_now[g.board["height"] - 1], elems_goal[i])

        print(f"delta = {g.delta}")

        unFilled = []
        # only stripe
        for j in range(g.board["width"]):
            if g.delta == [0, 0, 0, 0]:
                break

            cell_lk = int(g.board_now[g.board["height"] - 1][j])
            if g.delta[cell_lk] <= 0:
                continue

            isFilled = False
            for k in range(g.board["height"] - 2, cmped - 1, -1):
                cell_lk = int(g.board_now[k][j])

                if g.delta[cell_lk] < 0:
                    # now, only nukigata 0 is used. i can't imagine how to use other nukigata:(
                    katanuki(g.patterns[0], j, k, cn.UP)
                    isFilled = True

                    utils.get_delta(g.elems_now[g.board["height"] - 1], elems_goal[i])
                    break

            if not isFilled:
                unFilled.append(j)

        print(f"unFilled = {unFilled}")
        # unFilled
        for j in unFilled:
            isFilled = False

            print(f"fill row {j}")
            for k in range(1, max(j, g.board["width"] - j - 1) + 1):
                # right side
                x = j + k
                print(f"check row {x}")
                if x < g.board["width"]:
                    for m in range(g.board["height"] - 2, cmped - 1, -1):
                        cell_lk = int(g.board_now[m][x])

                        if g.delta[cell_lk] < 0:
                            y = m
                            ln = k
                            irregular = False

                            print(f"bring {cell_lk} from {x} {y}")

                            # if border nukigata confuse
                            if m % 2 == 1:
                                print("protect confusing")
                                # move cell_lk the place confused and move deepest cell the place not confused
                                katanuki(g.patterns[3], x, y, cn.UP)
                                irregular = True
                                y = g.board["height"] - 2

                            cnt = 0
                            while ln > 0:
                                if ln % 2 == 1:
                                    # border nukigata (else...1*1)
                                    katanuki(
                                        g.patterns[3 * cnt - 1 if cnt != 0 else 0],
                                        x - 2**cnt,
                                        y,
                                        cn.LEFT,
                                    )
                                    x -= 2**cnt

                                ln //= 2
                                cnt += 1

                            katanuki(g.patterns[0], x, y, cn.UP)
                            if irregular:
                                katanuki(
                                    g.patterns[0], j + k, g.board["height"] - 3, cn.UP
                                )

                            utils.get_delta(
                                g.elems_now[g.board["height"] - 1], elems_goal[i]
                            )

                            isFilled = True
                            break

                if isFilled:
                    break

                # left side
                x = j - k
                print(f"check row {x}")
                if x >= 0:
                    for m in range(g.board["height"] - 2, cmped - 1, -1):
                        cell_lk = int(g.board_now[m][x])

                        if g.delta[cell_lk] < 0:
                            y = m
                            ln = k
                            irregular = False

                            print(f"bring {cell_lk} from {x} {y}")

                            # if border nukigata confuse
                            if m % 2 == 1:
                                print("protect confusing")
                                # move cell_lk the place confused and move deepest cell the place not confused
                                katanuki(g.patterns[3], x, y, cn.UP)
                                irregular = True
                                y = g.board["height"] - 2

                            cnt = 0
                            while ln > 0:
                                if ln % 2 == 1:
                                    # border nukigata (else...1*1)
                                    katanuki(
                                        g.patterns[3 * cnt - 1 if cnt != 0 else 0],
                                        x + 1,
                                        y,
                                        cn.RIGHT,
                                    )
                                    x += 2**cnt

                                ln //= 2
                                cnt += 1

                            katanuki(g.patterns[0], x, y, cn.UP)
                            if irregular:
                                katanuki(
                                    g.patterns[0], j - k, g.board["height"] - 3, cn.UP
                                )

                            utils.get_delta(
                                g.elems_now[g.board["height"] - 1], elems_goal[i]
                            )

                            isFilled = True
                            break

                if isFilled:
                    break

        # next column
        katanuki(g.patterns[22], 0, g.board["height"] - 1, cn.DOWN)
        utils.get_delta(g.elems_now[g.board["height"] - 1], elems_goal[i])

    """
    g.rv_uldr = True
    g.board_goal = func.list_rv(g.board_goal, g.rv_uldr, g.rv_ud, g.rv_lr)
    g.board_now = func.list_rv(g.board_now, g.rv_uldr, g.rv_ud, g.rv_lr)

    print(f"reversed ULDR: {g.rv_uldr}, UD: {g.rv_ud}, LR: {g.rv_lr},")
    func.print_board()

    """

    for i in range(g.board["width"] - 1, -1, -1):
        cmped = g.board["width"] - i - 1  # counts of columns completed yet

        # only stripe
        for j in range(g.board["height"]):
            cell_cr = int(g.board_goal[j][i])

            if int(g.board_now[j][g.board["width"] - 1]) == cell_cr:
                continue
            for k in range(g.board["width"] - 2, cmped - 1, -1):
                cell_lk = int(g.board_now[j][k])

                if cell_cr == cell_lk:
                    # now, only nukigata 0 is used. i can't imagine how to use other nukigata:(
                    katanuki(g.patterns[0], k, j, cn.LEFT)
                    break

        # next column
        katanuki(g.patterns[22], g.board["width"] - 1, 0, cn.RIGHT)

    g.board_now = utils.list_rv(g.board_now, g.rv_uldr, g.rv_ud, g.rv_lr)

    answer = [g.n, g.ops]

    return answer
