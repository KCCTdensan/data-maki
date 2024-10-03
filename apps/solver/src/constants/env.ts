export const isProduction = process.env.NODE_ENV === "production";
export const isDevelopment = process.env.NODE_ENV === "development";

export const PORT = Number(process.env.PORT || 3000);
export const HOST = process.env.HOST || "localhost";
