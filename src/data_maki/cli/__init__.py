import json
import sys

from ..solver import solve
from .encoder import EnhancedJSONEncoder


def main():
    if len(sys.argv) < 2:
        print("Usage: rye run data-maki <input_file>")

        sys.exit(1)

    fname = sys.argv[1]

    with open(fname, "r") as f:
        problem = json.load(f)

    answer, _, replay = solve(problem)

    print(json.dumps(answer, indent=2, cls=EnhancedJSONEncoder))
    print(json.dumps(replay, indent=2, cls=EnhancedJSONEncoder))
