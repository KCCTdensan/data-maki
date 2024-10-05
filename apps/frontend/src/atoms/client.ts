import type { SolverApp } from "@data-maki/solver";
import type { ParsedEvent, ReconnectInterval } from "eventsource-parser";
import { EventSourceParserStream } from "eventsource-parser/stream";
import type { hc } from "hono/client";
import { atom } from "jotai";
import { isClient } from "../lib/client";

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
const currentEventAtom = atom<ParsedEvent | false>(false);

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

              set(currentEventAtom, message);
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
