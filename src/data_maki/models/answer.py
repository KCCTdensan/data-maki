from dataclasses import dataclass
from enum import IntEnum

from dataclasses_json import dataclass_json


class Direction(IntEnum):
    UP = 0
    DOWN = 1
    LEFT = 2
    RIGHT = 3

@dataclass_json
@dataclass(frozen=True)
class Op:
    p: int
    x: int
    y: int
    s: Direction

@dataclass_json
@dataclass(frozen=True)
class Answer:
    n: int
    ops: list[Op]
