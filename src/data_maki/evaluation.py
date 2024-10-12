from . import utils
from .context import Context
from .models.answer import Direction
from .katanuki import katanuki_board

def evaluate_col_elem(c: Context, p: int, x: int, y: int, elem_goal: list[int]):
    board = katanuki_board(c, p, x, y, Direction.UP)
    elems = utils.count_elements(board)
    delta = utils.get_delta(elems[c.height - 1], elem_goal)

    value = 0
    for i in delta:
        if i >= 0:
            value += i

    print(f"evaluate: p = {p}, evaluation = {value}")

    return value


def evaluate_row_piece(c: Context, p: int, x: int, y: int, row_goal: list[int]):
    board = katanuki_board(c, p, x, y, Direction.LEFT)
    row = board.get_row(c.width - 1)

    value = 0
    for i in range(c.height):
        if row[i] != row_goal[i]:
            value += 1

    print(f"evaluate: p = {p}, evaluation = {value}")

    return value



