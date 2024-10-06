import type { LogLayer } from "loglayer";
import type { ChannelTx, ReadonlyStore } from "reactive-channel";
import type { UIMessageEvent } from "../../events/base.ts";
import { FeatureBase } from "../base";
import type { ServerCommunicatorFeature } from "../server-comm";

export class AlgorithmFeature extends FeatureBase {
  #tx: ChannelTx<UIMessageEvent>;
  #subscriberCount$: ReadonlyStore<number>;

  constructor(
    log: LogLayer,
    tx: ChannelTx<UIMessageEvent>,
    subscriberCount$: ReadonlyStore<number>,
    private serverComm: ServerCommunicatorFeature,
  ) {
    super("Algorithm", log);

    this.#tx = tx;
    this.#subscriberCount$ = subscriberCount$;
  }

  private sendEvent(event: UIMessageEvent) {
    if (this.#subscriberCount$.content() > 0) {
      this.#tx.send(event);
    }
  }

  init() {}

  async start() {}
}
