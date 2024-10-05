import type { SSEMessage } from "hono/streaming";

export abstract class UIMessageEvent {
  readonly #eventName: string;

  protected constructor(eventName: string) {
    this.#eventName = eventName;
  }

  toSSE(): SSEMessage {
    return {
      data: JSON.stringify(this),
      event: this.#eventName,
    };
  }
}
