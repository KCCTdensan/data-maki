import type { Serve, Server } from "bun";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { showRoutes } from "hono/dev";
import { logger } from "hono/logger";
import { HOST, PORT, isDevelopment } from "../../constants/env.ts";
import type { UIMessageEvent } from "../../events/base.ts";
import type { SPMCReceiverCreator } from "../../util/channel.ts";
import { FeatureBase } from "../base.ts";
import { createRouteDefinition } from "./route.ts";

export type Env = {
  Variables: {
    tee: SPMCReceiverCreator<UIMessageEvent>;
  };
};

const app = new Hono<Env>();

app.use(logger());
app.use(
  cors({
    origin: (origin) => {
      if (isDevelopment) {
        return origin;
      }

      return origin.endsWith("data-maki.pages.dev") ? origin : "";
    },
  }),
);

export class UICommunicatorFeature extends FeatureBase {
  #server!: Server;
  readonly #tee: SPMCReceiverCreator<UIMessageEvent>;

  constructor(tee: SPMCReceiverCreator<UIMessageEvent>) {
    super("UI Communicator");

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

    if (isDevelopment) {
      console.info("Current routes:");

      showRoutes(app, { verbose: true });
    }
  }

  async start() {
    console.info(`UI Communicator is ready at http://${HOST}:${PORT}`);
  }
}

export type SolverApp = ReturnType<typeof createRouteDefinition>;
