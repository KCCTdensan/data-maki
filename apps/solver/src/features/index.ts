import type { UIMessageEventBase } from "@data-maki/schemas";
import type { LogLayer } from "loglayer";
import { SERVER_TOKEN, SERVER_URL } from "../constants/env.ts";
import { spmc } from "../util/channel.ts";
import type { Falsy } from "../util/types.ts";
import { AlgorithmFeature } from "./algorithm";
import type { FeatureBase } from "./base.ts";
import { ServerCommunicatorFeature } from "./server-comm";
import { UICommunicatorFeature } from "./ui-comm";

export const createFeatures = (log: LogLayer) => {
  const { tx, subscriberCount$, tee } = spmc<UIMessageEventBase>();
  const serverComm = new ServerCommunicatorFeature(log, SERVER_URL, SERVER_TOKEN);

  return (
    [
      new AlgorithmFeature(log, tx, subscriberCount$, serverComm),
      serverComm,
      new UICommunicatorFeature(log, tee),
    ] as const satisfies (FeatureBase | Falsy)[]
  ).filter((feature) => !!feature);
};
