import os
from httpx import Client

from ..models.problem import Problem


def create_client() -> Client:
    c = Client(base_url=os.environ.get("SOLVER_SERVER_URL") or "http://localhost:8080")

    c.headers.update(
        {
            "Procon-Token": os.environ.get("SOLVER_SERVER_TOKEN") or "token1",
        }
    )

    return c


def get_problem(client: Client) -> Problem:
    res = client.get("/problem")

    return res.json()
