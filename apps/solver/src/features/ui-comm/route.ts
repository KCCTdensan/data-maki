import type { Hono } from "hono";
import { stream } from "hono/streaming";

export const createRouteDefinition = (app: Hono) =>
  app.get("/rpc", (c) =>
    stream(c, async (stream) => {
      stream.onAbort(() => {
        console.log("Abort");
      });

      await stream.write("A");
      await stream.sleep(1000);
      await stream.write("B");
    }),
  );
