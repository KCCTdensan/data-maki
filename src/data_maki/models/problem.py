from dataclasses import dataclass
from typing import TypedDict

import numpy as np

from data_maki.arrays import TwoDimensionalIntArray


class Board(TypedDict):
    width: int
    height: int

    start: list[str]
    goal: list[str]


class Pattern(TypedDict):
    p: int
    width: int
    height: int
    cells: list[str]


class General(TypedDict):
    n: int
    patterns: list[Pattern]


class Problem(TypedDict):
    board: Board
    general: General


@dataclass
class InternalPattern:
    p: int
    cells: TwoDimensionalIntArray

    @staticmethod
    def from_pattern(pattern: Pattern) -> "InternalPattern":
        cells = np.array([int(cell) for row in pattern["cells"] for cell in row])

        return InternalPattern(
            p=pattern["p"],
            cells=TwoDimensionalIntArray(inner=cells, width=pattern["width"], height=pattern["height"]),
        )

    @property
    def width(self) -> int:
        return self.cells.width

    @property
    def height(self) -> int:
        return self.cells.height

    def copy(self) -> "InternalPattern":
        return InternalPattern(
            p=self.p,
            cells=self.cells.copy(),
        )


@dataclass
class InternalProblem:
    current: TwoDimensionalIntArray
    goal: TwoDimensionalIntArray

    @staticmethod
    def from_problem(problem: Problem) -> "InternalProblem":
        current = np.array([int(cell) for row in problem["board"]["start"] for cell in row])
        goal = np.array([int(cell) for row in problem["board"]["goal"] for cell in row])

        width = problem["board"]["width"]
        height = problem["board"]["height"]

        return InternalProblem(
            current=TwoDimensionalIntArray(inner=current, width=width, height=height),
            goal=TwoDimensionalIntArray(inner=goal, width=width, height=height),
        )

    def copy(self) -> "InternalProblem":
        return InternalProblem(
            current=self.current.copy(),
            goal=self.goal.copy(),
        )
