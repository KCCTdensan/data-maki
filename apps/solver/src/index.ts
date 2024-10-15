import { bootstrap } from "./bootstrap.ts";
import { FeatureError } from "./errors/feature.ts";
import { captureError } from "./errors/handler.ts";
import { _defaultLog } from "./logging";
import { IdleState } from "./state/idle.ts";
import { StateManager } from "./state/manager.ts";

export type { SolverApp } from "./features/ui-comm";

const main = async () => {
  const features = await bootstrap(_defaultLog);

  const combinations: [boolean, boolean, boolean][] = [
    [false, false, false],
    [false, false, true],
    [false, true, false],
    [false, true, true],
    [true, false, false],
    [true, false, true],
    [true, true, false],
    [true, true, true],
  ];

  const workerPromises = combinations.map(([rv_ul, rv_ud, rv_lr]) =>
    solve_worker(rv_ul, rv_ud, rv_lr).catch((e) => {
      throw new FeatureError(e, new Error(`solve_worker ${e} failed`)); // すまん、FeatureErrorの使い方分からんかったから第一引数を適当にeにした
    }),
  );

  const startPromise = Promise.all([
    ...features.map((feature) =>
      feature.start().catch((e) => {
        if (e instanceof Error) throw new FeatureError(feature, e);

        throw new FeatureError(feature, new Error(`Unknown error: ${e}`));
      }),
    ),
    ...workerPromises,
  ]);

  setTimeout(() => {
    StateManager.instance.setState(IdleState.instance);
  });

  return startPromise;
};

await captureError(_defaultLog, main());
