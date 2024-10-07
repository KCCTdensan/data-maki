from typing import TypedDict

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
