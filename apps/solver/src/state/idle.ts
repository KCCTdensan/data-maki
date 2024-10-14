import { StateBase } from "./base.ts";

export class IdleState extends StateBase {
  static readonly stateName = "Idle";

  static #instance: IdleState;

  static get instance() {
    if (!IdleState.#instance) {
      IdleState.#instance = new IdleState();
    }

    return IdleState.#instance;
  }
}
