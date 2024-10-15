from dataclasses import dataclass

from .answer import Answer
from .problem import InternalProblem
from .replay import ReplayInfo


@dataclass
class Result:
    answer: Answer
    board: InternalProblem
    replay: ReplayInfo
