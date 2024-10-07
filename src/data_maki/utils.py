from .global_value import g


# delete string from begin to end (not include end)
def str_delete(value: str, begin: int, end: int) -> str:
    return value[:begin] + value[end:]


def print_board():
    for column in g.board:
        print(column)

    print()

    return


def list_rv(lst: list[str], is_uldr: bool, is_ud: bool, is_lr: bool):
    if is_uldr:
        lst = ["".join(x) for x in zip(*lst)]
    if is_ud:
        lst = list(reversed(lst))
    if is_lr:
        lst = ["".join(x) for x in reversed(lst)]

    return lst


def count_elements(b: list[str]):
    elems = [[0, 0, 0, 0] for _ in range(g.height)]
    for i in range(g.height):
        for j in b[i]:
            elem = int(j)
            elems[i][elem] += 1

    return elems


def get_delta(now_column: list[int], goal_column: list[int]) -> list[int]:
    return [now_column[k] - goal_column[k] for k in range(4)]
