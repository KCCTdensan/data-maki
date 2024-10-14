from . import utils
from .context import Context
from .models.answer import Direction, Op
from .patterns import get_pattern
from .utils import ReverseOperation
from .models.replay import MarkType, CellsMark, ExtraOpInfo, ReplayInfo


def add_ops(c: Context, p: int, x: int, y: int, s: Direction):
    pattern = get_pattern(p, c.patterns)

    # this function can't correct x&y confused by ud or lr
    if c.rv_op.has_reverse90:
        x, y = y, x

        if c.rv_op.has_reverse_up_down:
            y -= pattern.height - 1

            if s == Direction.LEFT:
                s = Direction.RIGHT
            elif s == Direction.RIGHT:
                s = Direction.LEFT

        if c.rv_op.has_reverse_left_right:
            x -= pattern.width - 1

            if s == Direction.UP:
                s = Direction.DOWN
            elif s == Direction.DOWN:
                s = Direction.UP

        if s == Direction.UP:
            s = Direction.LEFT
        elif s == Direction.DOWN:
            s = Direction.RIGHT
        elif s == Direction.LEFT:
            s = Direction.UP
        elif s == Direction.RIGHT:
            s = Direction.DOWN

    else:
        if c.rv_op.has_reverse_up_down:
            y -= pattern.height - 1

            if s == Direction.UP:
                s = Direction.DOWN
            elif s == Direction.DOWN:
                s = Direction.UP

        if c.rv_op.has_reverse_left_right:
            x -= pattern.width - 1

            if s == Direction.LEFT:
                s = Direction.RIGHT
            elif s == Direction.RIGHT:
                s = Direction.LEFT

    c.n += 1
    c.ops.append(Op(p, x, y, s))


def add_info(c: Context):
    gl_type = c.info_now.goalMark.type
    gl_idx = c.info_now.goalMark.index
    cr_type = c.info_now.currentMark.type
    cr_y = c.info_now.currentMark.index
    cr_x = c.info_now.currentMark.index2

    if c.rv_op.has_reverse90:
        if gl_type == MarkType.ROW:
            gl_type = MarkType.COLUMN
        else:
            gl_type = MarkType.ROW

        cr_x, cr_y = cr_y, cr_x

    if c.rv_op.has_reverse_up_down:
        if gl_type == MarkType.ROW:
            gl_idx = c.height - gl_idx - 1

        cr_y = c.height - cr_y - 1

    if c.rv_op.has_reverse_left_right:
        if gl_type == MarkType.COLUMN:
            gl_idx = c.width - gl_idx - 1

        cr_x = c.width - cr_x - 1

    if c.info_now.goalMark.type == MarkType.ROW:
        c.info.append(ExtraOpInfo(CellsMark(cr_type, cr_y, cr_x), CellsMark(gl_type, gl_idx, None), c.info_now.delta))
    else:
        c.info.append(ExtraOpInfo(CellsMark(cr_type, cr_y, cr_x), CellsMark(gl_type, gl_idx, None), None))


def katanuki_board(c: Context, p: int, x: int, y: int, s: Direction):
    pattern_ = get_pattern(p, c.patterns)
    pattern = utils.reverse(pattern_.cells, c.rv_op)

    if x + pattern_.width <= 0 or x >= c.width or y + pattern_.height <= 0 or y >= c.height:
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
        pattern = utils.list_rv(pattern, ReverseOperation.Reverse90)
    elif s == Direction.LEFT or s == Direction.RIGHT:
        b = c.board.current.copy()
        bx = c.width
        by = c.height
        pw = pattern.width
        ph = pattern.height
        px = x
        py = y
        # pattern: do nothing
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

        now_col: list[int] = b.get_row(ly)
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

        b.set_row(ly, now_col)

    if s == Direction.UP or s == Direction.DOWN:
        b = utils.list_rv(b, ReverseOperation.Reverse90)

    return b


def katanuki(c: Context, p: int, x: int, y: int, s: Direction):
    print([p, x, y, s])

    b = katanuki_board(c, p, x, y, s)

    if c.board.current != b:
        c.board.current = b

        add_ops(c, p, x, y, s)

        c.elems_now = utils.count_elements(c.board.current)

        utils.print_board(c.board.current)

        add_info(c)

    return
