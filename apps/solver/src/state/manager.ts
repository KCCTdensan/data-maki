import type { ChannelTx, ReadonlyStore } from "reactive-channel";
import { type Store, makeStore } from "universal-stores";
import type { UIMessageEvent } from "../events/base.ts";
import type { StateBase } from "./base.ts";
import { InitState } from "./init.ts";

const INITIAL_STATE = InitState.instance;

export class StateManager {
  static #instance: StateManager;
  readonly #state$: Store<StateBase>;
  #oldState: StateBase;
  #tx: ChannelTx<UIMessageEvent>;

  private constructor(tx: ChannelTx<UIMessageEvent>) {
    this.#state$ = makeStore(INITIAL_STATE);
    this.#oldState = INITIAL_STATE;
    this.#tx = tx;
  }

  static init(tx: ChannelTx<UIMessageEvent>) {
    if (StateManager.#instance) {
      throw new Error("State manager already initialized");
    }

    StateManager.#instance = new StateManager(tx);

    console.info("State manager initialized with:", INITIAL_STATE.getName());
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

    console.info("[State change]", this.#oldState.getName(), "-->", state.getName());

    this.#oldState = this.#state$.content();
    this.#state$.set(state);
  }

  get state$(): ReadonlyStore<StateBase> {
    return this.#state$;
  }
}
