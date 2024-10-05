import type { ChannelTx, ReadonlyStore } from "reactive-channel";
import { type Store, makeStore } from "universal-stores";
import type { UIMessageEvent } from "../events/base.ts";
import type { StateBase } from "./base.ts";
import { InitState } from "./init.ts";

export class StateManager {
  static #instance: StateManager;
  readonly #state$: Store<StateBase>;
  #oldState: StateBase;
  #tx: ChannelTx<UIMessageEvent>;

  constructor(tx: ChannelTx<UIMessageEvent>) {
    this.#state$ = makeStore(InitState.instance);
    this.#oldState = InitState.instance;
    this.#tx = tx;
  }

  static get instance() {
    if (!StateManager.#instance) {
      throw new Error("State manager not initialized");
    }

    return StateManager.#instance;
  }

  setState(state: StateBase) {
    if (state === this.#state$.content()) {
      return;
    }

    this.#oldState = this.#state$.content();
    this.#state$.set(state);
  }

  get state$(): ReadonlyStore<StateBase> {
    return this.#state$;
  }
}
