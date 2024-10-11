from .models.problem import InternalProblem, Pattern
from .utils import ReverseOperationPatterns
from .models.answer import Op


class GlobalValue:
    height: int
    width: int
    board: InternalProblem
    n = 0
    ops: list[Op] = []
    elems_now: list[list[int]] = []
    rv_op = ReverseOperationPatterns
    patterns: list[Pattern] = []


g = GlobalValue()
