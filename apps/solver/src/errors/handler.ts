import type { LogLayer } from "loglayer";
import { BaseError } from "./base.ts";
import { FatalError } from "./fatal.ts";

export const captureError = <T>(log_: LogLayer, promise: Promise<T>): Promise<T> =>
  promise.catch((e) => {
    const log = log_.child().withContext({ feature: "ErrorHandler" });

    if (e instanceof FatalError) {
      log.withError(e).fatal(e.message);

      process.exit(1);
    } else if (e instanceof BaseError) {
      log.withError(e).error(e.message);

      return promise;
    }

    log.withMetadata({ err: e }).fatal("Uncaught error");

    process.exit(1);
  });
