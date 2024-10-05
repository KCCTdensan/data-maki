from data_maki.global_value import g
import data_maki.constant_numbers as cn
import data_maki.utils as utils
from data_maki.create_answer import add_ops


def katanuki(p, x, y, s):
    print([p[cn.P_N], x, y, s])
    if (
        x + p[cn.P_W] <= 0
        or x >= g.board["width"]
        or y + p[cn.P_H] <= 0
        or y >= g.board["height"]
    ):
        exit(print("Nukigata can't pick any cells :("))

    # looking point on board
    lx = 0
    ly = 0

    # stripe -> reverse / border -> normal
    if s == cn.UP or s == cn.DOWN:
        b = utils.list_rv(g.board_now, True, False, False)
        bx = g.board["height"]
        by = g.board["width"]
        pw = p[cn.P_H]
        ph = p[cn.P_W]
        px = y
        py = x
        pattern = utils.list_rv(p[cn.P_P], True, False, False)
    elif s == cn.LEFT or s == cn.RIGHT:
        b = g.board_now[:]
        bx = g.board["width"]
        by = g.board["height"]
        pw = p[cn.P_W]
        ph = p[cn.P_H]
        px = x
        py = y
        pattern = p[cn.P_P]
    else:
        exit(print("the direction is not exist! :("))

    pattern = utils.list_rv(pattern, g.rv_uldr, g.rv_ud, g.rv_lr)

    # nukigata de nuita cell
    picked = ["" for _ in range(ph)]

    """
    3 2 1
    | | |
    | | |
    V V V
    """
    for i in range(pw - 1, -1, -1):
        lx = px + i
        # out of range
        if lx < 0:
            break
        if lx >= bx:
            continue

        for j in range(ph):
            ly = py + j
            # out of range
            if ly < 0:
                continue
            if ly >= by:
                break

            if pattern[j][i] == "0":
                continue

            # pick the cell looked at
            picked[j] = b[ly][lx] + picked[j]
            b[ly] = utils.str_delete(b[ly], lx, lx + 1)

    for i in range(0, ph):
        # up/left -> add at end / down/right -> add at begin
        ly = py + i
        if ly < 0 or ly >= by:
            continue
        if s == cn.UP or s == cn.LEFT:
            b[ly] = b[ly] + picked[i]
        else:
            b[ly] = picked[i] + b[ly]

    if s == cn.UP or s == cn.DOWN:
        b = utils.list_rv(b, True, False, False)

    if g.board_now != b:
        g.board_now = b[:]
        add_ops(p[cn.P_N], x, y, s)

        g.elems_now = utils.count_elements(g.board_now[:])
        utils.print_board()

    return
