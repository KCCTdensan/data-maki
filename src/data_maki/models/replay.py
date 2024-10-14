from dataclasses import dataclass
from typing import Optional

from enum import StrEnum
from .problem import Problem
from .answer import Answer


class MarkType(StrEnum):
    ROW = "row"
    COLUMN = "column"
    POINT = "point"


@dataclass
class CellsMark:  # in TypeScript, use branded types of CellsMarkLine and CellsMarkPoint
    type: MarkType
    index: int
    index2: Optional[int]


@dataclass
class ExtraOpInfo:
    currentMark: CellsMark  # TypeScript to renkei suru node camel case
    goalMark: CellsMark
    delta: Optional[list[int]]


@dataclass
class ReplayInfo:
    problem: Problem
    answer: Answer
    extraInfo: list[ExtraOpInfo]
