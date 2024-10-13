# Same as data_maki/cli/data.py
import json
import os
from contextlib import redirect_stdout

from data_maki.models.problem import Problem
from data_maki.solver import solve

data_jsons = [
    (
        "Example data",
        """
        {
            "board": {
                "width": 6,
                "height": 4,
                "start": ["220103", "213033", "022103", "322033"],
                "goal": ["000000", "111222", "222233", "333333"]
            },
            "general": {
                "n": 2,
                "patterns": [
                    {
                        "p": 25,
                        "width": 4,
                        "height": 2,
                        "cells": ["0111", "1001"]
                    },
                    {
                        "p": 26,
                        "width": 2,
                        "height": 2,
                        "cells": ["10", "01"]
                    }
                ]
            }
        }
        """,
    ),
    (
        "Random #1",
        """
        {
            "board": {
                "width": 16,
                "height": 16,
                "start": [
                    "2202330200130130",
                    "3101300132121132",
                    "2221003110013132",
                    "1333020123112202",
                    "3022322303331223",
                    "3111230330022330",
                    "0310232022001202",
                    "1111100313011322",
                    "2212220310033210",
                    "3103121321233001",
                    "1121322313013302",
                    "3101102112221011",
                    "0020221232202233",
                    "3012201032112031",
                    "1001310012223223",
                    "2110301230202312"
                ],
                "goal": [
                    "0000000000000000",
                    "0000000000000000",
                    "0000000000000000",
                    "0000000000011111",
                    "1111111111111111",
                    "1111111111111111",
                    "1111111111111111",
                    "1111111111111222",
                    "2222222222222222",
                    "2222222222222222",
                    "2222222222222222",
                    "2222222222222222",
                    "2222233333333333",
                    "3333333333333333",
                    "3333333333333333",
                    "3333333333333333"
                ]
            }
        }
        """,
    ),  # Currently there is no generals
]


def main():
    datas: list[tuple[str, Problem]] = [(name, json.loads(data_json)) for (name, data_json) in data_jsons]
    ns = []

    for name, data in datas:
        print(f"{name}...", end=" ")

        with redirect_stdout(open(os.devnull, "w")):
            answer, board = solve(data)

        print(f"{answer.n} turns")
        ns.append(answer.n)

    print(f"Avg: {int(sum(ns) / len(ns))}")
    print(f"Max: {max(ns)}")
    print(f"Min: {min(ns)}")
    print(f"MED: {sorted(ns)[len(ns) // 2]}")
