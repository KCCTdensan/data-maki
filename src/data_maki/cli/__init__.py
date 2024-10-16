import json
import sys

from dotenv import load_dotenv

from data_maki.cli.client import create_client, get_problem


from ..solver import solve
from .encoder import EnhancedJSONEncoder

load_dotenv()


def main():
    if len(sys.argv) < 2:
        client = create_client()
        problem = get_problem(client)
    else:
        fname = sys.argv[1]

        with open(fname, "r") as f:
            problem = json.load(f)

    # answer, _, replay = solve(problem)
    datas = solve(problem)
    for i, data in enumerate(datas):
        sys.stderr.write(f"worker{i} {data.replay.answer.ops}\n\n\n")
        # print(f"in worker{i}...  turns: {data.answer.n}")
        with open(f"replay_{i}.json", "w") as f:
            json.dump(data.replay, f, indent=2, cls=EnhancedJSONEncoder)

    # print(json.dumps(answer, indent=2, cls=EnhancedJSONEncoder))
    # print(json.dumps(replay, indent=2, cls=EnhancedJSONEncoder))
