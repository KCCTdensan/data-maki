import { type ChannelRx, type ChannelTx, type ReadonlyStore, makeChannel } from "reactive-channel";
import { makeStore } from "universal-stores";

export type SPMCReceiverCreator<T> = () => readonly [rx: ChannelRx<T>, dispose: () => void];

export type SPMCChannel<T> = {
  tx: ChannelTx<T>;
  subscriberCount$: ReadonlyStore<number>;
  tee: SPMCReceiverCreator<T>;
};

export const spmc = <T>(): SPMCChannel<T> => {
  const { tx, rx } = makeChannel<T>();
  const subscriberCount$ = makeStore(0);
  const channels = new Set<ChannelTx<T>>();

  const tee = () => {
    const { tx, rx } = makeChannel<T>();

    channels.add(tx);
    subscriberCount$.set(channels.size);

    const dispose = () => {
      tx.close();
      channels.delete(tx);
      subscriberCount$.set(channels.size);
    };

    return [rx, dispose] as const;
  };

  rx.canRead$.subscribe(async (canRead) => {
    if (!canRead) return;

    setTimeout(async () => {
      for await (const data of rx) {
        for (const channel of channels) {
          channel.send(data);
        }
      }
    });
  });

  return {
    tx,
    subscriberCount$,
    tee,
  };
};
