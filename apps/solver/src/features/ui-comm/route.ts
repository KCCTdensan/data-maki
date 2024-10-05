import type { Hono } from "hono";
import { streamSSE } from "hono/streaming";
import { HelloEvent } from "../../events/hello.ts";
import { KeepAliveEvent } from "../../events/keep-alive.ts";
import type { Env } from "./index.ts";

let id = 0;

export const createRouteDefinition = <T extends Env>(app: Hono<T>) =>
  app.get("/rpc", (c) =>
    streamSSE(c, async (stream) => {
      // To send first response (headers, etc.), we need to send a hello event first
      await stream.writeSSE(new HelloEvent().toSSE());

      const { tee } = c.var;
      const [rx, dispose] = tee();
      const controller = new AbortController();

      // HACK: Some browsers require keep-alive event to be sent every several seconds
      // See: https://github.com/enisdenjo/graphql-sse/issues/99
      const keepAliveInterval = setInterval(() => {
        stream.writeSSE(new KeepAliveEvent().toSSE());
      }, 5000);

      stream.onAbort(() => {
        controller.abort();
        clearInterval(keepAliveInterval);
        dispose();
      });

      while (true) {
        try {
          const event = await rx.recv({ signal: controller.signal });

          await stream.writeSSE({
            ...event,
            id: String(id++),
          });
        } catch (e) {
          if (e instanceof Error) {
            if (e.message === "channel closed") break;

            console.error(e);

            return;
          }

          throw e;
        }
      }
    }),
  );
