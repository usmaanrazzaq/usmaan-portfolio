import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // AppleDouble sidecars, created because the repo lives on an exFAT drive.
    "**/._*",
    // Assets copied from the static site by scripts/sync-public.mjs.
    "public/**",
  ]),
]);

export default eslintConfig;
