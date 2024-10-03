import type { Serve, Server } from "bun";
import { Hono } from "hono";
import { showRoutes } from "hono/dev";
import { logger } from "hono/logger";
import { HOST, PORT, isDevelopment } from "../../constants/env.ts";
import { FeatureBase } from "../base.ts";
import { createRouteDefinition } from "./route.ts";

const app = new Hono();

app.use(logger());

const routes = createRouteDefinition(app);

const serveConfig: Serve = {
  port: PORT,
  hostname: HOST,
  fetch: app.fetch,
};

export type SolverApp = typeof routes;

export class UICommunicatorFeature extends FeatureBase {
  #server!: Server;

  constructor() {
    super("UI Communicator");
  }

  init() {
    this.#server = Bun.serve(serveConfig);

    if (isDevelopment) {
      console.info("Current routes:");

      showRoutes(app, { verbose: true });
    }
  }

  async onReady() {
    console.info(`UI Communicator is ready at http://${HOST}:${PORT}`);
  }
}
