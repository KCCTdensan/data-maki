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


def print_board(board: TwoDimensionalIntArray):
    for row in board.loop_row():
        print(row)

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


def list_rv(arr: TwoDimensionalIntArray, strategy: ReverseOperation):
    match strategy:
        case ReverseOperation.Reverse90:
            return arr.transpose()
        case ReverseOperation.ReverseUpDown:
            return arr.reverse_row_wise()
        case ReverseOperation.ReverseLeftRight:
            return arr.reverse_column_wise()

    return arr


def reverse(arr: TwoDimensionalIntArray, rv_op: ReverseOperationPatterns):
    if rv_op.has_reverse90:
        arr = arr.transpose()

        if rv_op.has_reverse_left_right:
            arr = arr.reverse_row_wise()
        if rv_op.has_reverse_up_down:
            arr = arr.reverse_column_wise()

    else:
        if rv_op.has_reverse_left_right:
            arr = arr.reverse_column_wise()
        if rv_op.has_reverse_up_down:
            arr = arr.reverse_row_wise()

    return arr


def dereverse(arr: TwoDimensionalIntArray, rv_op: ReverseOperationPatterns):
    if rv_op.has_reverse90:
        if rv_op.has_reverse_left_right:
            arr = arr.reverse_row_wise()
        if rv_op.has_reverse_up_down:
            arr = arr.reverse_column_wise()

        arr = arr.transpose()

    else:
        if rv_op.has_reverse_left_right:
            arr = arr.reverse_column_wise()
        if rv_op.has_reverse_up_down:
            arr = arr.reverse_row_wise()

    return arr


def count_elements(b: TwoDimensionalIntArray):
    elems = [[0, 0, 0, 0] for _ in range(b.height)]

    for i, rows in enumerate(b.loop_row_views()):
        for cell in rows:
            elems[i][cell.item()] += 1

    return elems


def get_delta(now_column: list[int], goal_column: list[int]) -> list[int]:
    return [now_column[k] - goal_column[k] for k in range(4)]
