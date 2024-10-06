import type { Answer } from "@data-maki/schemas";
import type { Serve } from "bun";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import microtime from "microtime";
import type { FixedLengthArray, IntRange } from "type-fest";
import typia from "typia";
import type { Config } from "./models/config";

const PORT = 8080;
const HOST = "localhost";

const filename = process.argv.at(2) ?? "resources/input.json";
const config = typia.assert<Config>(await Bun.file(filename).json());

const validateAnswer = typia.createValidate<Answer>();

const validTokens = new Set(config.teams);

function getRandomInt<TMin extends number, TMax extends number>(min: TMin, max: TMax): IntRange<TMin, TMax> {
  return Math.floor(Math.random() * (max - min) + min) as unknown as IntRange<TMin, TMax>; // [min,max]
}

function problemGenerator(): { width: number; height: number; start: string[]; goal: string[] } {
  console.time("Problem generation successful");

  const width = getRandomInt(32, 257);
  const height = getRandomInt(32, 257);

  const numbers: number[] = Array(width * height).fill(0);

  let flg = true;

  while (flg) {
    const counts: FixedLengthArray<number, 4> = [0, 0, 0, 0];

    for (let i = 0; i < width * height; i++) {
      const num = getRandomInt(0, 5);

      numbers[i] = num;
      counts[num]++;
    }

    flg = false;

    for (const count of counts) {
      flg = count / (width * height) < 0.1;
    }
  }

  // 初期盤面の生成
  const startTable: string[] = [...Array(height).keys()].map((i) =>
    numbers.slice(i * width, (i + 1) * width).toString(),
  );

  // 目標盤面の生成
  numbers.sort();

  const goalTable: string[] = [...Array(height).keys()].map((i) =>
    numbers.slice(i * width, (i + 1) * width).toString(),
  );

  const problem = { width: width, height: height, start: startTable, goal: goalTable };

  console.timeEnd("Problem generation successful");

  return problem;
}

const problem = problemGenerator();

const app = new Hono();

app.use(logger());
app.use(prettyJSON());

app.use(async (c, next) => {
  const token = c.req.header("Procon-Token");

  if (!token || !validTokens.has(token)) {
    return c.json({ error: "Invalid or missing token" }, 401);
  }

  await next();
});

app.get("/problem", (c) => {
  return c.json(problem);
});

app.post("/answer", async (c) => {
  const answer = await c.req.json();
  const validation = validateAnswer(answer);

  if (!validation.success) {
    return c.json({ error: "Invalid answer format", details: validation.errors }, 400);
  }

  const revision = microtime.now();

  return c.json({ revision });
});

export default {
  port: PORT,
  hostname: HOST,
  fetch: app.fetch,
} satisfies Serve;
