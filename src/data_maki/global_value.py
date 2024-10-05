import json

board_json = """
{
    "width": 6,
    "height": 4,
    "start": [
        "220103",
        "213033",
        "022103",
        "322033"
    ],
    "goal": [
        "000000",
        "111222",
        "222233",
        "333333"
    ]
}
"""


class GlobalValue:
    board = json.loads(board_json)
    board_goal = []
    board_now = []
    n = 0
    ops = []
    elems_now = []
    delta = [0, 0, 0, 0]
    rv_ud = False
    rv_lr = False
    rv_uldr = False
    patterns = []


g = GlobalValue()
