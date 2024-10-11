from dataclasses import dataclass, field


def flatten[T](arr: list[list[T]]) -> list[T]:
    return sum(arr, [])


@dataclass()
class TwoDimensionalIntArray:
    inner: list[int]
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

        return self.inner == value.inner and self.width == value.width and self.height == value.height

    def copy(self) -> "TwoDimensionalIntArray":
        return TwoDimensionalIntArray(inner=self.inner.copy(), width=self.width, height=self.height)

    def get(self, idx_column: int, idx_row: int) -> int:
        if idx_column < 0 or idx_column >= self.height or idx_row < 0 or idx_row >= self.width:
            raise IndexError(f"Out of range in get({idx_column}, {idx_row})")

        return self.inner[self.width * idx_column + idx_row]

    def get_multiple(self, offset: int, length: int) -> list[int]:
        if offset < 0 or offset >= len(self.inner) or offset + length > len(self.inner):
            raise IndexError(f"Out of range in get_multiple({offset}, {length})")

        return self.inner[offset : offset + length]

    def get_column(self, idx: int) -> list[int]:
        if idx < 0 or idx >= self.height:
            raise IndexError(f"Out of range in get_column({idx})")

        return self.get_multiple(self.width * idx, self.width)

    def loop_column(self):
        for i in range(self.height):
            yield self.get_column(i)

    def get_row(self, idx: int) -> list[int]:
        if idx < 0 or idx >= self.width:
            raise IndexError(f"Out of range in get_row({idx})")

        return self.inner[idx :: self.width]

    def loop_row(self):
        for i in range(self.width):
            yield self.get_row(i)

    def set(self, idx_column: int, idx_row: int, value: int):
        if idx_column < 0 or idx_column >= self.height or idx_row < 0 or idx_row >= self.width:
            raise IndexError(f"Out of range in set({idx_column}, {idx_row})")

        self.inner[self.width * idx_column + idx_row] = value

    def set_multiple(self, offset: int, *values: list[int]):
        if offset < 0 or offset >= len(self.inner):
            raise IndexError(f"Out of range in set_multiple({offset})")

        for i, value in enumerate(values):
            self.inner[offset + i] = value

    def set_column(self, idx: int, column: list[int]):
        if len(column) != self.width:
            raise ValueError(f"Invalid size: {len(column)} != {self.width}")

        self.set_multiple(self.width * idx, *column)

    def transpose(self) -> "TwoDimensionalIntArray":
        return TwoDimensionalIntArray(
            flatten([self.get_row(x) for x in range(self.width)]), width=self.height, height=self.width
        )

    def reverse_column_wise(self) -> "TwoDimensionalIntArray":
        return TwoDimensionalIntArray(
            flatten([self.get_column(x) for x in range(self.height - 1, -1, -1)]), width=self.width, height=self.height
        )

    def reverse_row_wise(self) -> "TwoDimensionalIntArray":
        return TwoDimensionalIntArray(
            flatten([self.get_column(x)[::-1] for x in range(self.height)]), width=self.width, height=self.height
        )
