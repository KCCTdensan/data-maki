export abstract class StateBase<T extends typeof StateBase = typeof StateBase> {
  static readonly stateName: string;

  protected constructor() {}

  get stateName() {
    return (this.constructor as T).stateName;
  }
}
