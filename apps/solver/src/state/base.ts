export abstract class StateBase {
  readonly #name: string;

  protected constructor(name: string) {
    this.#name = name;
  }

  getName() {
    return this.#name;
  }
}
