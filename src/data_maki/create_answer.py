from .global_value import g
from .models.answer import Direction, Op


def add_ops(p: int, x: int, y: int, s: Direction):
    # this function can't correct x&y confused by ud or lr
    p = p
    if g.rv_lr:
        if s == Direction.LEFT:
            s = Direction.RIGHT
        elif s == Direction.RIGHT:
            s = Direction.LEFT

    if g.rv_uldr:
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

    if g.rv_ud:
        if s == Direction.UP:
            s = Direction.DOWN
        elif s == Direction.DOWN:
            s = Direction.UP

    g.n += 1
    g.ops.append(Op(p, x, y, s))
