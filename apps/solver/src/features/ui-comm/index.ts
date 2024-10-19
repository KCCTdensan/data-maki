import type { UIMessageEventBase } from "@data-maki/schemas";
import type { Serve, Server } from "bun";
import { Hono } from "hono";
import { logger } from "hono-pino";
import { cors } from "hono/cors";
import type { LogLayer } from "loglayer";
import { HOST, PORT, isDevelopment } from "../../constants/env.ts";
import { internalPinoLogger } from "../../logging";
import type { SPMCReceiverCreator } from "../../util/channel.ts";
import { FeatureBase } from "../base.ts";
import { createRouteDefinition } from "./route.ts";

export type Env = {
  Variables: {
    tee: SPMCReceiverCreator<UIMessageEventBase>;
  };
};

const app = new Hono<Env>();

app.use(
  logger({
    pino: internalPinoLogger.child({ feature: "UI Communicator" }),
  }),
);

app.use(
  cors({
    origin: (origin) => origin,
  }),
);

export class UICommunicatorFeature extends FeatureBase {
  #server!: Server;
  readonly #tee: SPMCReceiverCreator<UIMessageEventBase>;

  constructor(log: LogLayer, tee: SPMCReceiverCreator<UIMessageEventBase>) {
    super("UI Communicator", log);

    this.#tee = tee;
  }

  init() {
    app.use(async (c, next) => {
      c.set("tee", this.#tee);

      await next();
    });

    createRouteDefinition(app);

    const serveConfig: Serve = {
      port: PORT,
      hostname: HOST,
      fetch: app.fetch,
    };

    this.#server = Bun.serve(serveConfig);
  }

  async start() {
    this.log
      .withMetadata({
        url: `http://${HOST}:${PORT}`,
      })
      .info("UI Communicator is ready");
  }
}

export type SolverApp = ReturnType<typeof createRouteDefinition>;
