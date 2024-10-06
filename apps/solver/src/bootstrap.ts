import type { LogLayer } from "loglayer";
import { FeatureError } from "./errors/feature.ts";
import type { UIMessageEvent } from "./events/base.ts";
import { createFeatures } from "./features";
import { span } from "./logging";
import { IdleState } from "./state/idle.ts";
import { StateManager } from "./state/manager.ts";
import { spmc } from "./util/channel";

export const bootstrap = async (log_: LogLayer) => {
  const log = log_.child().withContext({ feature: "Bootstrap" });
  const scope = span(log, "Initialization took");

  log.info("Starting up...");

  const features = createFeatures(log_);

  StateManager.init(log, spmc<UIMessageEvent>().tx);

  log
    .withMetadata({ features: features.map((feature) => feature.getName()) })
    .info(`Initialized ${features.length} features`);

  await Promise.all(
    features.map(async (feature) => {
      if (!feature) return;

      const name = feature.getName();
      const scope = span(log, `Initialized feature: ${name}`);

      try {
        await feature.init();
      } catch (e) {
        if (e instanceof Error) throw new FeatureError(feature, e);

        throw new FeatureError(feature, new Error(`Unknown error: ${e}`));
      }

      scope.end();
    }),
  );

  scope.end();

  return features;
};
