import { StateBase } from "./base.ts";

export class InitState extends StateBase {
  static readonly stateName = "Initializing";

  static #instance: InitState;

  static get instance() {
    if (!InitState.#instance) {
      InitState.#instance = new InitState();
    }

    return InitState.#instance;
  }
}
