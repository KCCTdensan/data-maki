import type { Answer } from "@data-maki/schemas";
import { Hono } from "hono";
import typia from "typia";

const app = new Hono();

app.get("/", (c) => {
  typia.assert<Answer>({ n: 1 });
  return c.text("Hello Hono!");
});

export default app;
