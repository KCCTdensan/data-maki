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
        question = json.load(f)

    answer, _ = solve(question)

    print(json.dumps(answer, indent=2, cls=EnhancedJSONEncoder))