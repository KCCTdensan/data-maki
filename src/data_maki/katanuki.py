from . import utils
from .global_value import g
from .models.answer import Direction, Op
from .models.problem import Pattern
from .utils import ReverseOperation
from .patterns import get_pattern
from .arrays import TwoDimensionalIntArray


def add_ops(p: int, x: int, y: int, s: Direction):
    # this function can't correct x&y confused by ud or lr
    if g.rv_op.has_reverse_left_right:
        if s == Direction.LEFT:
            s = Direction.RIGHT
        elif s == Direction.RIGHT:
            s = Direction.LEFT

    if g.rv_op.has_reverse90:
        if s == Direction.UP:
            s = Direction.LEFT
        elif s == Direction.DOWN:
            s = Direction.RIGHT
        elif s == Direction.LEFT:
            s = Direction.UP
        elif s == Direction.RIGHT:
            s = Direction.DOWN

        val = x
        x = y
        y = val

    if g.rv_op.has_reverse_up_down:
        if s == Direction.UP:
            s = Direction.DOWN
        elif s == Direction.DOWN:
            s = Direction.UP

    g.n += 1
    g.ops.append(Op(p, x, y, s))


def katanuki(p: int, x: int, y: int, s: Direction):
    pattern = get_pattern(p)

    print([p, x, y, s])

    if x + pattern["width"] <= 0 or x >= g.width or y + pattern["height"] <= 0 or y >= g.height:
        raise Exception("Nukigata can't pick any cells :(")

    # stripe -> reverse / border -> normal
    if s == Direction.UP or s == Direction.DOWN:
        b = utils.list_rv(g.board.current, ReverseOperation.Reverse90)
        bx = g.height
        by = g.width
        pw = pattern["height"]
        ph = pattern["width"]
        px = y
        py = x
        pattern = utils.list_rv_str(pattern["cells"], ReverseOperation.Reverse90)
    elif s == Direction.LEFT or s == Direction.RIGHT:
        b = g.board.current.copy()
        bx = g.width
        by = g.height
        pw = pattern["width"]
        ph = pattern["height"]
        px = x
        py = y
        pattern = pattern["cells"]
    else:
        raise Exception("the direction is not exist! :(")

    """
    pattern = utils.list_rv(pattern, g.rv_uldr, g.rv_ud, g.rv_lr)
    """

    """
    before
    3 2 1
    | | |
    | | |
    V V V

    after
    <---1
    <---2
    <---3
    """

    for i in range(ph):
        ly = py + i
        # out of range
        if ly < 0:
            continue
        if ly >= by:
            break

        now_col: list[int] = b.get_column(ly)
        # nukigata de nuita cell
        picked = []

        for j in range(pw - 1, -1, -1):
            lx = px + j
            # out of range
            if lx >= bx:
                continue
            if lx < 0:
                break

            if pattern[i][j] == "0":
                continue

            # pick and remove the cell looked at
            picked.insert(0, now_col.pop(lx))

        if s == Direction.UP or s == Direction.LEFT:
            now_col += picked
        else:
            now_col = picked + now_col

        b.set_column(ly, now_col)

    if s == Direction.UP or s == Direction.DOWN:
        b = utils.list_rv(b, ReverseOperation.Reverse90)

    if g.board.current != b:
        g.board.current = b.copy()

        add_ops(p, x, y, s)

        g.elems_now = utils.count_elements(g.board.current)

        utils.print_board(g.board.current)

    return
