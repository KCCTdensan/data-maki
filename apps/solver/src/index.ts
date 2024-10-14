import { bootstrap } from "./bootstrap.ts";
import { FeatureError } from "./errors/feature.ts";
import { captureError } from "./errors/handler.ts";
import { _defaultLog } from "./logging";
import { IdleState } from "./state/idle.ts";
import { StateManager } from "./state/manager.ts";

export type { SolverApp } from "./features/ui-comm";

const main = async () => {
  const features = await bootstrap(_defaultLog);

  const startPromise = Promise.all(
    features.map((feature) =>
      feature.start().catch((e) => {
        if (e instanceof Error) throw new FeatureError(feature, e);

        throw new FeatureError(feature, new Error(`Unknown error: ${e}`));
      }),
    ),
  );

  setTimeout(() => {
    StateManager.instance.setState(IdleState.instance);
  });

  return startPromise;
};

await captureError(_defaultLog, main());
