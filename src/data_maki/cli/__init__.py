import dataclasses
import json

from .data import example_data
from .encoder import EnhancedJSONEncoder
from ..solver import solve

def main():
    answer = solve(example_data)

    print(json.dumps(answer, indent=2, cls=EnhancedJSONEncoder))
