import { StateBase } from "./base.ts";

export class IdleState extends StateBase {
  static #instance: IdleState;

  constructor() {
    super("Idle");
  }

  static get instance() {
    if (!IdleState.#instance) {
      IdleState.#instance = new IdleState();
    }

    return IdleState.#instance;
  }
}
