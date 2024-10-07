from .create_patterns import create_patterns
from .models.answer import Op


class GlobalValue:
    height: int
    width: int
    board: list[str] = []
    board_goal: list[str] = []
    n = 0
    ops: list[Op] = []
    elems_now: list[list[int]] = []
    rv_ud = False
    rv_lr = False
    rv_uldr = False
    patterns = create_patterns()


g = GlobalValue()
