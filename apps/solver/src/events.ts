import type { UIMessageEventBase } from "@data-maki/schemas";
import type { SSEMessage } from "hono/streaming";

export const eventToSSE = (event: UIMessageEventBase): SSEMessage => ({
  data: JSON.stringify(Object.fromEntries(Object.entries(event).filter(([key]) => key !== "eventName"))),
  event: event.eventName,
});
