from data_maki.global_value import g
import data_maki.constant_numbers as cn


def add_ops(p, x, y, s):
    # this function can't correct x&y confused by ud or lr
    p = p
    if g.rv_lr:
        if s == cn.LEFT:
            s == cn.RIGHT
        elif s == cn.RIGHT:
            s == cn.LEFT

    if g.rv_uldr:
        if s == cn.UP:
            s == cn.LEFT
        elif s == cn.DOWN:
            s == cn.RIGHT
        elif s == cn.LEFT:
            s == cn.UP
        elif s == cn.RIGHT:
            s == cn.DOWN

        val = x
        x = y
        y = val

    if g.rv_ud:
        if s == cn.UP:
            s == cn.DOWN
        elif s == cn.DOWN:
            s == cn.UP

    g.n += 1
    g.ops.append([p, x, y, s])

    return
