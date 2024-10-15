import type { Answer } from "@data-maki/schemas";
import type { Serve } from "bun";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import microtime from "microtime";
import typia from "typia";
import { type GenerationSettings, generateProblem } from "./gen";
import type { Config } from "./models/config";

const PORT = 8080;
const HOST = "localhost";

const filename = process.argv.at(2) ?? "resources/input.json";
const config = typia.assert<Config>(await Bun.file(filename).json());

const validateAnswer = typia.createValidate<Answer>();

const validTokens = new Set(config.teams);

const generationSettings: GenerationSettings = {
  widthRandom: true,
  heightRandom: true,
  width: 0,
  height: 0,
  genKindStart: "all-random",
  genKindGoal: "all-random",
  waitDuration: 5,
};

const app = new Hono();

app.use(logger());
app.use(
  cors({
    origin: (origin) => origin,
    allowHeaders: ["Upgrade-Insecure-Requests", "Content-Type"],
  }),
);
app.use(prettyJSON());

app.use(async (c, next) => {
  if (c.req.path === "/settings") {
    await next();

    return;
  }

  const token = c.req.header("Procon-Token");

  if (!token || !validTokens.has(token)) {
    return c.json({ error: "Invalid or missing token" }, 401);
  }

  await next();
});

let lockedDown = true;

app.get("/problem", (c) => {
  if (lockedDown) return new Response('"AccessTimeError"', { status: 403 });

  const [id, problem] = generateProblem(generationSettings);

  c.header("X-Data-Maki-Problem-ID", id.toString());

  return c.json(problem);
});

app.post("/answer", async (c) => {
  const answer = await c.req.json();
  const validation = validateAnswer(answer);

  if (!validation.success) {
    return c.json({ error: "Invalid answer format", details: validation.errors }, 400);
  }

  if (generationSettings.waitDuration && generationSettings.waitDuration > 0) {
    lockedDown = true;

    setTimeout(() => {
      lockedDown = false;
    }, generationSettings.waitDuration * 1000);
  }

  const revision = microtime.now();

  return c.json({ revision });
});

app.post("/settings", async (c) => {
  const settings = await c.req.json();

  generationSettings.widthRandom = settings.widthRandom;
  generationSettings.heightRandom = settings.heightRandom;
  generationSettings.width = settings.width;
  generationSettings.height = settings.height;
  generationSettings.genKindStart = settings.genKindStart;
  generationSettings.genKindGoal = settings.genKindGoal;
  generationSettings.waitDuration = settings.waitDuration;

  return new Response(null, { status: 204 });
});

if (generationSettings.waitDuration && generationSettings.waitDuration > 0) {
  lockedDown = true;

  setTimeout(() => {
    lockedDown = false;
  }, generationSettings.waitDuration * 1000);
}

export default {
  port: PORT,
  hostname: HOST,
  fetch: app.fetch,
} satisfies Serve;
