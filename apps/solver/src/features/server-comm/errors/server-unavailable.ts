import { FatalError } from "@/errors/fatal.ts";
import type { AxiosError } from "axios";

export class ServerUnavailableError extends FatalError {
  constructor(cause: AxiosError) {
    super("ServerUnavailableError", "Server is unavailable", cause);
  }
}
