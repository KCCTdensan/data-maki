import type { Answer } from "@data-maki/schemas";
import { Hono } from "hono";
import typia from "typia";
import config from "../resources/input.json";

const app = new Hono();

const validateAnswer = typia.createValidate<Answer>();

const validTokens = new Set(config.teams);

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min); // [min,max)
}

function problemGenerator(): { width: number; height: number; start: string[]; goal: string[] } {
  const width = getRandomInt(32, 257);
  const height = getRandomInt(32, 257);

  let numbers: number[] = Array(width * height).fill(0);
  let flg: boolean = true;
  while (flg) {
    const counts: number[] = [0, 0, 0, 0];
    for (let i = 0; i < height * width; ++i) {
      const num: number = getRandomInt(0, 5);
      numbers[i] = num;
      if (counts[num] !== undefined) {
        ++counts[num];
      }
    }
    flg = false;
    counts.forEach((count) => {
      flg = count / (width * height) < 0.1;
    });
  }

  // 初期盤面の生成
  const startTable: string[] = Array.from({ length: height }).map(
    (e, i) => (e = numbers.slice(i * width, (i + 1) * width).toString()),
  );
  // 目標盤面の生成
  numbers.sort();
  const goalTable: string[] = Array.from({ length: height }).map(
    (e, i) => (e = numbers.slice(i * width, (i + 1) * width).toString()),
  );

  const problem = { width: width, height: height, start: startTable, goal: goalTable };
  console.log("Generate successful!!");
  return problem;
}

const problem = problemGenerator();

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
  const revision = new Date().getTime(); // 配布されたサーバーの挙動を見るに、どうやら受付した時間をマイクロ秒オーダーのUnixTimeで返されているらしいが、ミリ秒までの取得しか分からなかったので現状はミリ秒オーダーにしている
  return c.json({ revision });
});

export default app;
