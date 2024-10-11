from .models.problem import Pattern
from .global_value import g


def create_patterns() -> list[Pattern]:
    patterns: list[Pattern] = [{"p": 0, "width": 1, "height": 1, "cells": ["1"]}]

    for i in range(1, 9):
        num = 1 << i
        patterns.append({"p": 3 * i - 2, "width": num, "height": num, "cells": ["1" * num] * num})
        patterns.append({"p": 3 * i - 1, "width": num, "height": num, "cells": ["1" * num, "0" * num] * (num // 2)})
        patterns.append({"p": 3 * i, "width": num, "height": num, "cells": ["10" * (num // 2)] * num})

    # nongeneral nukigata append
    #patterns.append({"p": 25, "width": 4, "height": 2, "cells": ["0111", "1001"]})
    #patterns.append({"p": 26, "width": 2, "height": 4, "cells": ["01", "10", "10", "10"]})

    return patterns


fixed_patterns = create_patterns()


def get_pattern(index: int) -> Pattern:
    if index < 0 or index >= len(fixed_patterns) + 256:
        raise Exception(f"Invaild pattern index: {index}")

    return fixed_patterns[index] if index < len(fixed_patterns) else g.patterns[index - len(fixed_patterns)]
