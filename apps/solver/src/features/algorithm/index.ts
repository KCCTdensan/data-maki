import type { ChannelTx, ReadonlyStore } from "reactive-channel";
import type { UIMessageEvent } from "../../events/base.ts";
import { FeatureBase } from "../base";

export class AlgorithmFeature extends FeatureBase {
  #tx: ChannelTx<UIMessageEvent>;
  #subscriberCount$: ReadonlyStore<number>;

  constructor(tx: ChannelTx<UIMessageEvent>, subscriberCount$: ReadonlyStore<number>) {
    super("Algorithm");

    this.#tx = tx;
    this.#subscriberCount$ = subscriberCount$;
  }

  private sendEvent(event: UIMessageEvent) {
    if (this.#subscriberCount$.content() > 0) {
      this.#tx.send(event);
    }
  }

  init() {}

  async onReady() {}
}