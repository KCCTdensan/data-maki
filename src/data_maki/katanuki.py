from . import utils
from .create_answer import add_ops
from .global_value import g
from .models.answer import Direction
from .models.problem import Pattern
from .utils import ListReverseStrategy


def katanuki(p: Pattern, x: int, y: int, s: Direction):
    print([p["cells"], x, y, s])

    if x + p["width"] <= 0 or x >= g.width or y + p["height"] <= 0 or y >= g.height:
        raise Exception("Nukigata can't pick any cells :(")

    # stripe -> reverse / border -> normal
    if s == Direction.UP or s == Direction.DOWN:
        b = utils.list_rv(g.board, ListReverseStrategy.Reverse90)
        bx = g.height
        by = g.width
        pw = p["height"]
        ph = p["width"]
        px = y
        py = x
        pattern = utils.list_rv(p["cells"], ListReverseStrategy.Reverse90)
    elif s == Direction.LEFT or s == Direction.RIGHT:
        b = g.board[:]
        bx = g.width
        by = g.height
        pw = p["width"]
        ph = p["height"]
        px = x
        py = y
        pattern = p["cells"]
    else:
        raise Exception("the direction is not exist! :(")

    """
    pattern = utils.list_rv(pattern, g.rv_uldr, g.rv_ud, g.rv_lr)
    """

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
        if s == Direction.UP or s == Direction.LEFT:
            b[ly] = b[ly] + picked[i]
        else:
            b[ly] = picked[i] + b[ly]

    if s == Direction.UP or s == Direction.DOWN:
        b = utils.list_rv(b, ListReverseStrategy.Reverse90)

    if g.board != b:
        g.board = b[:]
        add_ops(p["p"], x, y, s)

        g.elems_now = utils.count_elements(g.board[:])
        utils.print_board()

    return
