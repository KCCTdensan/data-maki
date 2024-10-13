import type { Hono } from "hono";
import { streamSSE } from "hono/streaming";
import { eventToSSE } from "../../events.ts";
import { StateManager } from "../../state/manager.ts";
import { SolvingState } from "../../state/solving.ts";
import type { Env } from "./index.ts";

let id = 0;

export const createRouteDefinition = <T extends Env>(app: Hono<T>) =>
  app.get("/rpc", (c) =>
    streamSSE(c, async (stream) => {
      // To send first response (headers, etc.), we need to send a hello event first
      await stream.writeSSE(eventToSSE({ eventName: "hello" }));

      const { tee } = c.var;
      const [rx, dispose] = tee();
      const controller = new AbortController();

      // HACK: Some browsers require keep-alive event to be sent every several seconds
      // See: https://github.com/enisdenjo/graphql-sse/issues/99
      const keepAliveInterval = setInterval(() => {
        stream.writeSSE(eventToSSE({ eventName: "keep-alive" }));
      }, 5000);

      stream.onAbort(() => {
        controller.abort();
        clearInterval(keepAliveInterval);
        dispose();
      });

      const state = StateManager.instance.state$.content();

      if (state.stateName === SolvingState.stateName) {
        const solvingState = state as SolvingState;

        await stream.writeSSE(
          eventToSSE({
            eventName: "solve.start",
            id: solvingState.id,
            startedAt: solvingState.startedAt,
            board: solvingState.problem.board,
          }),
        );
      }

      while (true) {
        try {
          const event = await rx.recv({ signal: controller.signal });

          await stream.writeSSE({
            ...eventToSSE(event),
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
