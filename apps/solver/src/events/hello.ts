import { UIMessageEvent } from "./base.ts";

export class HelloEvent extends UIMessageEvent {
  constructor() {
    super("hello");
  }
}
