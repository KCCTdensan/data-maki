import { UIMessageEvent } from "./base";

export class KeepAliveEvent extends UIMessageEvent {
  constructor() {
    super("keep-alive");
  }
}
