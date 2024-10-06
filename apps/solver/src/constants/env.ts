import { parseEnv, port, z } from "znv";

export const isProduction = process.env.NODE_ENV === "production";
export const isDevelopment = process.env.NODE_ENV === "development";

export const { SERVER_URL, SERVER_TOKEN, PORT, HOST } = parseEnv(process.env, {
  SERVER_URL: {
    schema: z.string().url(),
    defaults: {
      development: "http://localhost:8080",
    },
  },
  SERVER_TOKEN: z.string().min(1),
  PORT: port().default(3000),
  HOST: {
    schema: z.string().min(1),
    defaults: {
      development: "localhost",

      _: "0.0.0.0",
    },
  },
});
