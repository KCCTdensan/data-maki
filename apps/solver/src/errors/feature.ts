import type { FeatureBase } from "@/features/base.ts";
import { FatalError } from "./fatal.ts";

export class FeatureError extends FatalError {
  constructor(feature: FeatureBase, cause: Error) {
    super("FeatureError", `Error in ${feature.getName()}`, cause);
  }
}
