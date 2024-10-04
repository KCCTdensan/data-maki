import { AlgorithmFeature } from "./features/algorithm";
import type { FeatureBase } from "./features/base";
import { ServerCommunicatorFeature } from "./features/server-comm";
import { UICommunicatorFeature } from "./features/ui-comm";
import type { Falsy } from "./util/types.ts";

const createFeatures = () =>
  (
    [new AlgorithmFeature(), new ServerCommunicatorFeature(), new UICommunicatorFeature()] as const satisfies (
      | FeatureBase
      | Falsy
    )[]
  ).filter((feature) => !!feature);

const features = createFeatures();

console.time("All features ready");

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

const allFeaturesPromise = Promise.all(features.map((feature) => feature.onReady()));

console.timeEnd("All features ready");

await allFeaturesPromise;

export type { SolverApp } from "./features/ui-comm";