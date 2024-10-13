import type { UIMessageEventBase } from "@data-maki/schemas";
import type { LogLayer } from "loglayer";
import type { ChannelTx, ReadonlyStore } from "reactive-channel";
import { type Store, makeStore } from "universal-stores";
import type { StateBase } from "./base.ts";
import { InitState } from "./init.ts";

const INITIAL_STATE = InitState.instance;

export class StateManager {
  static #instance: StateManager;
  readonly #state$: Store<StateBase>;
  #oldState: StateBase;
  #tx: ChannelTx<UIMessageEventBase>;

  private constructor(
    private log: LogLayer,
    tx: ChannelTx<UIMessageEventBase>,
  ) {
    this.#state$ = makeStore(INITIAL_STATE);
    this.#oldState = INITIAL_STATE;
    this.#tx = tx;
  }

  static init(log_: LogLayer, tx: ChannelTx<UIMessageEventBase>) {
    if (StateManager.#instance) {
      throw new Error("State manager already initialized");
    }

    const log = log_.child().withContext({ feature: "State Manager" });

    StateManager.#instance = new StateManager(log, tx);

    log
      .withMetadata({
        initialState: INITIAL_STATE.stateName,
      })
      .info("Initialized");
  }

  static get instance() {
    if (!StateManager.#instance) {
      throw new Error("State manager not initialized");
    }

    return StateManager.#instance;
  }

  setState<T extends StateBase>(state: T) {
    if (state === this.#state$.content()) {
      return state;
    }

    this.log
      .withMetadata({
        oldState: this.#oldState.stateName,
        newState: state.stateName,
      })
      .info("Changing state");

    this.#oldState = this.#state$.content();
    this.#state$.set(state);

    return state;
  }

  get state$(): ReadonlyStore<StateBase> {
    return this.#state$;
  }
}
