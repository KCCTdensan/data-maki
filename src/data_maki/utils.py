from enum import StrEnum
from threading import Thread

from .arrays import TwoDimensionalIntArray


class ReturnableThread[T](Thread):
    _result: T | None = None

    def __init__(self, group=None, target=None, name=None, args=(), kwargs={}, Verbose=None):
        Thread.__init__(self, group, target, name, args, kwargs)

    def run(self):
        if self._target is not None:
            self._return = self._target(*self._args, **self._kwargs)

    def join(self, *args):
        Thread.join(self, *args)

        return self._return


# delete string from begin to end (not include end)
def str_delete(value: str, begin: int, end: int) -> str:
    return value[:begin] + value[end:]


def print_board(board: TwoDimensionalIntArray):
    for col in board.loop_column():
        print(col)

    print()

    return


class ReverseOperation(StrEnum):
    Reverse90 = "reverse-90"
    ReverseUpDown = "reverse-up-down"
    ReverseLeftRight = "reverse-left-right"


class ReverseOperationPatterns:
    has_reverse90 = False
    has_reverse_up_down = False
    has_reverse_left_right = False


def list_rv_str(arr: list[str], strategy: ReverseOperation) -> list[str]:
    match strategy:
        case ReverseOperation.Reverse90:
            return list(zip(*arr))
        case ReverseOperation.ReverseUpDown:
            return list(reversed(arr))
        case ReverseOperation.ReverseLeftRight:
            return [row[::-1] for row in arr]

    return arr


def list_rv(arr: TwoDimensionalIntArray, strategy: ReverseOperation):
    match strategy:
        case ReverseOperation.Reverse90:
            return arr.transpose()
        case ReverseOperation.ReverseUpDown:
            return arr.reverse_column_wise()
        case ReverseOperation.ReverseLeftRight:
            return arr.reverse_row_wise()

    return lst


def count_elements(b: TwoDimensionalIntArray):
    elems = [[0, 0, 0, 0] for _ in range(b.height)]

    for i, cols in enumerate(b.loop_column()):
        for cell in cols:
            elems[i][cell] += 1

    return elems


def get_delta(now_column: list[int], goal_column: list[int]) -> list[int]:
    return [now_column[k] - goal_column[k] for k in range(4)]
