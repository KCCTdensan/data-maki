export abstract class FeatureBase {
  readonly #name: string;

  protected constructor(name: string) {
    this.#name = name;
  }

  getName(): string {
    return this.#name;
  }

  abstract init(): void;

  abstract start(): Promise<void>;

  onDispose() {}
}
