import { type UIMessageEventBase, isSolverEvent } from "@data-maki/schemas";
import type { SolverApp } from "@data-maki/solver";
import type { ParsedEvent, ReconnectInterval } from "eventsource-parser";
import { EventSourceParserStream } from "eventsource-parser/stream";
import type { hc } from "hono/client";
import { atom } from "jotai";
import { IGNOREABLE_EVENTS } from "../constants/events";
import { isClient } from "../lib/client";
import { solverDataAtom } from "./solver";

// Code execution on module load

let reloading = false;

if (isClient) {
  window.addEventListener("beforeunload", () => {
    reloading = true;
  });
}

export const clientAtom = atom<ReturnType<typeof hc<SolverApp>> | null>(null);

export type ConnectionStatus = "idle" | "connecting" | "connected" | "error";

export const connectionStatusToColor = (status: ConnectionStatus) => {
  switch (status) {
    case "idle":
      return "gray";
    case "connecting":
      return "blue";
    case "connected":
      return "success";
    case "error":
      return "red";
  }
};

export const connectionStatusToText = (status: ConnectionStatus) => {
  switch (status) {
    case "idle":
      return "Idle";
    case "connecting":
      return "Connecting";
    case "connected":
      return "Connected";
    case "error":
      return "Error";
  }
};

export const connectionStatusAtom = atom<ConnectionStatus>("idle");

const controllerAtom = atom<[controller: AbortController, onClose: () => void] | false>(false);
const currentEventAtom = atom<UIMessageEventBase | false>(false);

export const eventStreamAtom = atom(
  (get) => get(currentEventAtom),
  async (
    get,
    set,
    url: URL,
    onRequest: () => void,
    onOpen: () => void,
    onClose: () => void,
    onRequestError: (e: Error) => void,
    onResponseError: (res: Response) => void,
  ) => {
    const controllerPair = get(controllerAtom);

    if (controllerPair) {
      const [controller, onClose] = controllerPair;

      controller.abort();
      onClose();
    }

    const newController = new AbortController();

    const fetchStream = async () => {
      onRequest();

      const response = await fetch(url, {
        headers: {
          Accept: "text/event-stream",
        },
        signal: newController.signal,
      });

      if (!response.ok) {
        onResponseError(response);

        return;
      }

      onOpen();

      set(controllerAtom, [newController, onClose]);

      return response.body
        .pipeThrough(new TextDecoderStream())
        .pipeThrough(new EventSourceParserStream())
        .pipeTo(
          new WritableStream<ParsedEvent | ReconnectInterval>({
            write(message) {
              if (message.type === "reconnect-interval") {
                const interval = message.value;

                setTimeout(fetchStream, interval * 1000);

                return;
              }

              if (IGNOREABLE_EVENTS.includes(message.event)) return;

              const event = JSON.parse(message.data) as UIMessageEventBase;

              event.eventName = message.event;

              set(currentEventAtom, event);

              if (!isSolverEvent(event)) return;

              if (event.eventName === "solve.start") {
                set(solverDataAtom, event);
              }
            },
          }),
        );
    };

    fetchStream().catch((e) => {
      if ((e instanceof Error && e.name === "AbortError") || reloading) return;

      onRequestError(e);
    });
  },
);
