from .models.answer import Op
from .models.problem import InternalPattern, InternalProblem
from .models.replay import ExtraOpInfo
from .utils import ReverseOperationPatterns


class Context:
    height: int
    width: int
    board: InternalProblem
    n: int
    ops: list[Op]
    info_now: ExtraOpInfo
    info: list[ExtraOpInfo]
    elems_now: list[list[int]]
    rv_op: ReverseOperationPatterns
    patterns: list[InternalPattern]

    def __init__(self):
        self.n = 0
        self.ops = []
        self.info = []
        self.elems_now = []
        self.rv_op = ReverseOperationPatterns()
        self.patterns = []
