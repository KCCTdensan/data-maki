import dataclasses
import json

from ..solver import solve
from .data import example_data
from .encoder import EnhancedJSONEncoder


def main():
    answer = solve(example_data)

    print(json.dumps(answer, indent=2, cls=EnhancedJSONEncoder))
