import { StateBase } from "./base.ts";

export class InitState extends StateBase {
  static #instance: InitState;

  constructor() {
    super("Initializing");
  }

  static get instance() {
    if (!InitState.#instance) {
      InitState.#instance = new InitState();
    }

    return InitState.#instance;
  }
}
