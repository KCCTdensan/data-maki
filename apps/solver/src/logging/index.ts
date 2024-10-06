import { resolve } from "node:path";
import { type ILogBuilder, LogLayer, LoggerType } from "loglayer";
import pino, { type P } from "pino";
import type PinoPretty from "pino-pretty";
import type { SonicBoomOpts } from "sonic-boom";

type PinoRollOptions = {
  file: string;
  extension: `.${string}`;
  frequency: string;
  dateFormat: string;
};

export const internalPinoLogger = pino({
  transport: {
    targets: [
      {
        target: "pino-pretty",
        options: {
          colorize: true,
          colorizeObjects: true,
          messageFormat: "[{feature}] {msg}",
          ignore: "pid,hostname,feature",
        } satisfies PinoPretty.PrettyOptions,
      },
      {
        target: "pino-roll",
        options: {
          file: resolve("logs", "solver"),
          extension: ".log",
          frequency: "daily",
          dateFormat: "yyyy-MM-dd",
          mkdir: true,
        } satisfies Omit<SonicBoomOpts, "dest"> & PinoRollOptions,
      },
    ],
  },
});

export const _defaultLog = new LogLayer<P.Logger>({
  logger: {
    instance: internalPinoLogger,
    type: LoggerType.PINO,
  },
});

export const span = (log: LogLayer | ILogBuilder, message: string) => {
  const timeNanos = Bun.nanoseconds();

  return {
    end: () => {
      const timeMillis = ((Bun.nanoseconds() - timeNanos) / 1e6).toFixed(3);

      log.info(`${message} +${timeMillis}ms`);
    },
  } as const;
};

export const spanScoped =
  <T, P extends Array<T>, R>(log: LogLayer | ILogBuilder, message: string, fn: (...params: P) => R) =>
  (...params: P) => {
    const scope = span(log, message);

    const result = fn(...params);

    if (result instanceof Promise) {
      return (result as Promise<Awaited<R>>).finally(() => scope.end());
    }

    scope.end();

    return result;
  };
