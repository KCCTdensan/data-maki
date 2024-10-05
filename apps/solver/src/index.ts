import type { UIMessageEvent } from "./events/base.ts";
import { AlgorithmFeature } from "./features/algorithm";
import type { FeatureBase } from "./features/base";
import { ServerCommunicatorFeature } from "./features/server-comm";
import { UICommunicatorFeature } from "./features/ui-comm";
import { IdleState } from "./state/idle.ts";
import { StateManager } from "./state/manager.ts";
import { spmc } from "./util/channel";
import type { Falsy } from "./util/types";

const createFeatures = () => {
  const { tx, subscriberCount$, tee } = spmc<UIMessageEvent>();

  return (
    [
      new AlgorithmFeature(tx, subscriberCount$),
      new ServerCommunicatorFeature(),
      new UICommunicatorFeature(tee),
    ] as const satisfies (FeatureBase | Falsy)[]
  ).filter((feature) => !!feature);
};

const features = createFeatures();

console.time("All features ready");

StateManager.init(spmc<UIMessageEvent>().tx);

console.group(
  "Registered features:\n",
  ...features.map((feature) => `- ${feature.getName()}\n`),
  `Total: ${features.length}`,
);

for (const feature of features) {
  if (!feature) continue;

  const name = feature.getName();

  console.time(`Initialized feature: ${name}`);

  feature.init();

  console.timeEnd(`Initialized feature: ${name}`);
}

const allFeaturesPromise = Promise.all(features.map((feature) => feature.start()));

console.timeEnd("All features ready");

StateManager.instance.setState(IdleState.instance);

await allFeaturesPromise;

export type { SolverApp } from "./features/ui-comm";
