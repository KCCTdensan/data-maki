import { bootstrap } from "./bootstrap.ts";
import { FeatureError } from "./errors/feature.ts";
import { captureError } from "./errors/handler.ts";
import { _defaultLog } from "./logging";

export type { SolverApp } from "./features/ui-comm";

const main = async () => {
  const features = await bootstrap(_defaultLog);

  await Promise.all(
    features.map((feature) =>
      feature.start().catch((e) => {
        if (e instanceof Error) throw new FeatureError(feature, e);

        throw new FeatureError(feature, new Error(`Unknown error: ${e}`));
      }),
    ),
  );
};

await captureError(_defaultLog, main());
