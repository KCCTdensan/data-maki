import { FatalError } from "@/errors/fatal";

export class InvalidAlgorithmVersionError extends FatalError {
  constructor(version: string) {
    super("InvalidAlgorithmVersionError", `Invalid algorithm version: ${version}`);
  }
}
