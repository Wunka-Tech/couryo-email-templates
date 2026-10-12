import js from "@eslint/js";
import tseslint from "typescript-eslint";

const nodeGlobals = { process: "readonly", console: "readonly", URL: "readonly", Buffer: "readonly", setTimeout: "readonly", clearTimeout: "readonly" };

export default tseslint.config(
  { ignores: ["dist", "node_modules", "examples", ".previews-tmp"] },
  { extends: [js.configs.recommended, ...tseslint.configs.recommended], files: ["**/*.{ts,tsx}"] },
  { extends: [js.configs.recommended], files: ["scripts/**/*.mjs"], languageOptions: { globals: nodeGlobals } },
);
