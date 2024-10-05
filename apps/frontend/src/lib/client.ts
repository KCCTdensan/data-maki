import { clientOnly$ } from "vite-env-only/macros";

export const isClient = clientOnly$(true);
