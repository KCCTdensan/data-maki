import type { LogLayer } from "loglayer";

export abstract class FeatureBase {
  readonly #name: string;
  protected readonly log: LogLayer;

  protected constructor(name: string, log: LogLayer) {
    this.#name = name;
    this.log = log.child().withContext({ feature: name });
  }

  getName(): string {
    return this.#name;
  }

  abstract init(): void | Promise<void>;

  abstract start(): Promise<void>;

  onDispose() {}
}
