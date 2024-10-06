import type { LogLayer } from "loglayer";
import type { UIMessageEvent } from "./events/base.ts";
import { createFeatures } from "./features";
import { _defaultLog, span, spanScoped } from "./logging";
import { IdleState } from "./state/idle.ts";
import { StateManager } from "./state/manager.ts";
import { spmc } from "./util/channel";

const bootstrap = async (log: LogLayer) => {
  const features = createFeatures(log);

  StateManager.init(log, spmc<UIMessageEvent>().tx);

  log
    .withMetadata({ features: features.map((feature) => feature.getName()) })
    .info(`Initialized ${features.length} features`);

  await Promise.all(
    features.map(async (feature) => {
      if (!feature) return;

      const name = feature.getName();
      const scope = span(log, `Initialized feature: ${name}`);

      await feature.init();

      scope.end();
    }),
  );

  StateManager.instance.setState(IdleState.instance);

  return features;
};

const bootstrapLog = _defaultLog.child().withContext({ feature: "Bootstrap" });

bootstrapLog.info("Starting up...");

const features = await spanScoped(bootstrapLog, "Initialization took", bootstrap)(bootstrapLog);

Promise.all(features.map((feature) => feature.start())).catch((error) => {
  _defaultLog.withError(error).fatal("Some feature throw an error");

  process.exit(1);
});

export type { SolverApp } from "./features/ui-comm";
