from .models.answer import Op
from .models.problem import InternalPattern, InternalProblem, Pattern
from .utils import ReverseOperationPatterns


class Context:
    height: int
    width: int
    board: InternalProblem
    n = 0
    ops: list[Op] = []
    elems_now: list[list[int]] = []
    rv_op = ReverseOperationPatterns
    patterns: list[InternalPattern] = []
