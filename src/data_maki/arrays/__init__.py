from dataclasses import dataclass

import numpy as np
import numpy.typing as npt


def flatten[T](arr: list[list[T]]) -> list[T]:
    return sum(arr, [])


@dataclass()
class TwoDimensionalIntArray:
    inner: npt.NDArray[np.int64]
    width: int
    height: int

    def __post_init__(self):
        if len(self.inner) != self.width * self.height:
            raise ValueError(f"Invalid size: {len(self.inner)} != {self.width} * {self.height}")

    def __iter__(self):
        return iter(self.inner)

    def __eq__(self, value: object) -> bool:
        if not isinstance(value, TwoDimensionalIntArray):
            return False

        return np.array_equal(self.inner, value.inner) and self.width == value.width and self.height == value.height

    def size(self):
        return self.width * self.height

    def copy(self) -> "TwoDimensionalIntArray":
        return TwoDimensionalIntArray(inner=self.inner.copy(), width=self.width, height=self.height)

    def get(self, idx_row: int, idx_column: int) -> int:
        if idx_row < 0 or idx_row >= self.height or idx_column < 0 or idx_column >= self.width:
            raise IndexError(f"Out of range in get({idx_row}, {idx_column})")

        return self.inner[self.width * idx_row + idx_column].item()

    def get_multiple(self, offset: int, length: int) -> list[int]:
        if offset < 0 or offset >= len(self.inner) or offset + length > len(self.inner):
            raise IndexError(f"Out of range in get_multiple({offset}, {length})")

        return [e.item() for e in self.inner[offset : offset + length].copy()]

    def get_multiple_view(self, offset: int, length: int) -> npt.NDArray[np.int64]:
        if offset < 0 or offset >= len(self.inner) or offset + length > len(self.inner):
            raise IndexError(f"Out of range in get_multiple_view({offset}, {length})")

        return self.inner[offset : offset + length]

    def get_row(self, idx: int) -> list[int]:
        if idx < 0 or idx >= self.height:
            raise IndexError(f"Out of range in get_column({idx})")

        return self.get_multiple(self.width * idx, self.width)

    def get_row_view(self, idx: int) -> npt.NDArray[np.int64]:
        if idx < 0 or idx >= self.height:
            raise IndexError(f"Out of range in get_column({idx})")

        return self.get_multiple_view(self.width * idx, self.width)

    def loop_row(self):
        for i in range(self.height):
            yield self.get_row(i)

    def loop_row_views(self):
        for i in range(self.height):
            yield self.get_row_view(i)

    def get_column(self, idx: int) -> list[int]:
        if idx < 0 or idx >= self.width:
            raise IndexError(f"Out of range in get_row({idx})")

        return [e.item() for e in self.inner[idx :: self.width].copy()]

    def loop_column(self):
        for i in range(self.width):
            yield self.get_column(i)

    def set(self, idx_row: int, idx_column: int, value: int):
        if idx_row < 0 or idx_row >= self.height or idx_column < 0 or idx_column >= self.width:
            raise IndexError(f"Out of range in set({idx_row}, {idx_column})")

        self.inner[self.width * idx_row + idx_column] = value

    def set_multiple(self, offset: int, *values: list[int]):
        if offset < 0 or offset >= len(self.inner):
            raise IndexError(f"Out of range in set_multiple({offset})")

        for i, value in enumerate(values):
            self.inner[offset + i] = value

    def set_row(self, idx: int, row: list[int]):
        if len(row) != self.width:
            raise ValueError(f"Invalid size: {len(row)} != {self.width}")

        self.set_multiple(self.width * idx, *row)

    def transpose_inplace(self):
        self.inner = self.inner.reshape(self.height, self.width).T.flatten()

        self.width, self.height = self.height, self.width

    def transpose(self) -> "TwoDimensionalIntArray":
        inner = self.copy()

        inner.transpose_inplace()

        return inner

    def reverse_row_wise_inplace(self):
        self.inner = np.array(flatten([self.get_row(x) for x in range(self.height - 1, -1, -1)]))

    def reverse_row_wise(self) -> "TwoDimensionalIntArray":
        inner = self.copy()

        inner.reverse_row_wise_inplace()

        return inner

    def reverse_column_wise_inplace(self):
        self.inner = np.array(flatten([self.get_row(x)[::-1] for x in range(self.height)]))

    def reverse_column_wise(self) -> "TwoDimensionalIntArray":
        inner = self.copy()

        inner.reverse_column_wise_inplace()

        return inner
