from .models.answer import Op
from .models.problem import InternalPattern, InternalProblem, Pattern
from .utils import ReverseOperationPatterns
from .models.replay import ExtraOpInfo

class Context:
    height: int
    width: int
    board: InternalProblem
    n = 0
    ops: list[Op] = []
    info_now: ExtraOpInfo
    info: list[ExtraOpInfo] = []
    elems_now: list[list[int]] = []
    rv_op = ReverseOperationPatterns
    patterns: list[InternalPattern] = []
