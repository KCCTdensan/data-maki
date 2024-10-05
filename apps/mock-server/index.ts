import type { Answer } from "@data-maki/schemas";
import { Hono } from "hono";
import typia from "typia";
import config from "./input.json";

const app = new Hono();

const validateAnswer = typia.createValidate<Answer>();

const validTokens = new Set(config.teams);

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min); // [min,max)
}

function problemGenerator(): JSON {
  const width = getRandomInt(32, 257);
  const height = getRandomInt(32, 257);

  let numbers: number[] = Array.from({ length: width * height });
  let flg: bool = true;
  while (flg) {
    var counts: number[] = Array(4).fill(0);
    for (let i = 0; i < height * width; ++i) {
      numbers[i] = getRandomInt(0, 5);
      ++counts[numbers[i] - 1];
    }
    flg = false;
    counts.forEach((count) => {
      flg = count / (width * height) < 0.1;
    });
  }
  let startTable: string[] = Array.from({ length: height });
  for (let i = 0; i < height; ++i) {
    startTable[i] = numbers.slice(i * width, (i + 1) * width).toString();
  }
  let goalTable: string[] = Array.from({ length: height });
  numbers.sort();
  for (let i = 0; i < height; ++i) {
    goalTable[i] = numbers.slice(i * width, (i + 1) * width).toString();
  }
  let problem = JSON.stringify({ width: width, height: height, start: startTable, goal: goalTable });
  console.log("Generate successful!!");
  return problem;
}

const problem = problemGenerator();

app.use("*", (c, next) => {
  const token = c.req.header("Procon-Token");
  if (!token || !validTokens.has(token)) {
    return c.json({ error: "Invalid or missing token" }, 401);
  }
  return next();
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
  const revision = new Date().getTime(); // 配布されたサーバーの挙動を見るに、どうやら受付した時間をマイクロ秒オーダーのUnixTimeで返されているらしいが、ミリ秒までの取得しか分からなかったので現状はミリ秒オーダーにしている
  return c.json({ revision });
});

export default app;
