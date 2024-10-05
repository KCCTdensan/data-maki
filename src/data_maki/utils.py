from data_maki.global_value import g


# delete string from begin to end (not include end)
def str_delete(str, begin, end):
    return str[:begin] + str[end:]


def print_board():
    for column in g.board_now:
        print(column)

    print()

    return


def list_rv(lst, isULDR, isUD, isLR):
    if isULDR:
        lst = ["".join(x) for x in zip(*lst)]
    if isUD:
        lst = list(reversed(lst))
    if isLR:
        lst = ["".join(x) for x in reversed(lst)]

    return lst


def count_elements(b):
    elems = [[0, 0, 0, 0] for _ in range(g.board["height"])]
    for i in range(g.board["height"]):
        for j in b[i]:
            elem = int(j)
            elems[i][elem] += 1

    return elems


def get_delta(now_column, goal_column):
    g.delta = [now_column[k] - goal_column[k] for k in range(4)]

    return
