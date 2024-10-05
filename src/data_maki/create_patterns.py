from data_maki.global_value import g

def create_patterns():
    # general nukigata create
    g.patterns.append([0, 1, 1, ["1"]])
    for i in range(1, 9):
        num = 2**i
        g.patterns.append([3 * i - 2, num, num, ["1" * num] * num])
        g.patterns.append([3 * i - 1, num, num, ["1" * num, "0" * num] * (num // 2)])
        g.patterns.append([3 * i, 2, 2, ["10" * (num // 2)] * num])

    # nongeneral nukigata append
    g.patterns.append([25, 4, 2, ["0111", "1001"]])
    g.patterns.append([26, 2, 2, ["10", "01"]])
