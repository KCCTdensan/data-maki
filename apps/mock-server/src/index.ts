import type { Answer } from "@data-maki/schemas";
import type { Serve } from "bun";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import microtime from "microtime";
import type { FixedLengthArray, IntRange } from "type-fest";
import typia from "typia";
import { generateProblem } from "./gen";
import type { Config } from "./models/config";

const PORT = 8080;
const HOST = "localhost";

const filename = process.argv.at(2) ?? "resources/input.json";
const config = typia.assert<Config>(await Bun.file(filename).json());

const validateAnswer = typia.createValidate<Answer>();

const validTokens = new Set(config.teams);

let generateSettings: { widthRandom: boolean; heightRandom: boolean; width: number; height: number } = {
  widthRandom: true,
  heightRandom: true,
  width: 0,
  height: 0,
};

function getRandomInt<TMin extends number, TMax extends number>(min: TMin, max: TMax): IntRange<TMin, TMax> {
  return Math.floor(Math.random() * (max - min) + min) as unknown as IntRange<TMin, TMax>; // [min,max]
}

const [id, problem] = generateProblem(generateSettings);

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
  c.header("X-Data-Maki-Problem-ID", id.toString());

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

app.post("/settings", async (c) => {
  const settings = await c.req.json();

  generateSettings.widthRandom = settings.widthRandom;
  generateSettings.heightRandom = settings.heightRandom;
  generateSettings.width = settings.width;
  generateSettings.height = settings.height;

  return c.json({ success: true });
});

export default {
  port: PORT,
  hostname: HOST,
  fetch: app.fetch,
} satisfies Serve;
