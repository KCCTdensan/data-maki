export class BaseError extends Error {
  constructor(
    readonly _tag: string,
    message: string,
    cause: Error,
  ) {
    super(message, { cause });

    this.name = _tag;
  }
}
