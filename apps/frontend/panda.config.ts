import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ["./app/routes/**/*.{js,jsx,ts,tsx}", "./app/components/**/*.{js,jsx,ts,tsx}"],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {},
  },

  jsxFramework: "react",
  jsxFactory: "styled",
  jsxStyleProps: "minimal",

  importMap: "@style",

  // The output directory for your css system
  outdir: "styled-system",
});
