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

    # answer, _, replay = solve(problem)
    for i in range(7, -1, -1):
        data = solve(problem, i)

        sys.stderr.write(f"worker{i} {data.replay.answer.ops}\n\n\n")
        # print(f"in worker{i}...  turns: {data.answer.n}")
        with open(f"replay_{i}.json", "w") as f:
            json.dump(data.replay, f, indent=2, cls=EnhancedJSONEncoder)

    # print(json.dumps(answer, indent=2, cls=EnhancedJSONEncoder))
    # print(json.dumps(replay, indent=2, cls=EnhancedJSONEncoder))
