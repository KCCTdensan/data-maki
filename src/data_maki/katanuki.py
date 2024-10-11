from . import utils
from .context import Context
from .models.answer import Direction, Op
from .patterns import get_pattern
from .utils import ReverseOperation


def add_ops(c: Context, p: int, x: int, y: int, s: Direction):
    # this function can't correct x&y confused by ud or lr
    if c.rv_op.has_reverse_left_right:
        if s == Direction.LEFT:
            s = Direction.RIGHT
        elif s == Direction.RIGHT:
            s = Direction.LEFT

    if c.rv_op.has_reverse90:
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

    if c.rv_op.has_reverse_up_down:
        if s == Direction.UP:
            s = Direction.DOWN
        elif s == Direction.DOWN:
            s = Direction.UP

    c.n += 1
    c.ops.append(Op(p, x, y, s))


def katanuki(c: Context, p: int, x: int, y: int, s: Direction):
    pattern = get_pattern(p, c.patterns)

    print([p, x, y, s])

    if x + pattern.width <= 0 or x >= c.width or y + pattern.height <= 0 or y >= c.height:
        raise Exception("Nukigata can't pick any cells :(")

    # stripe -> reverse / border -> normal
    if s == Direction.UP or s == Direction.DOWN:
        b = utils.list_rv(c.board.current, ReverseOperation.Reverse90)
        bx = c.height
        by = c.width
        pw = pattern.height
        ph = pattern.width
        px = y
        py = x
        pattern = utils.list_rv(pattern.cells, ReverseOperation.Reverse90)
    elif s == Direction.LEFT or s == Direction.RIGHT:
        b = c.board.current.copy()
        bx = c.width
        by = c.height
        pw = pattern.width
        ph = pattern.height
        px = x
        py = y
        pattern = pattern.cells.copy()
    else:
        raise Exception("the direction is not exist! :(")

    """
    pattern = utils.list_rv(pattern, c.rv_uldr, c.rv_ud, c.rv_lr)
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

            if pattern.get(i, j) == 0:
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

    if c.board.current != b:
        c.board.current = b.copy()

        add_ops(c, p, x, y, s)

        c.elems_now = utils.count_elements(c.board.current)

        utils.print_board(c.board.current)

    return