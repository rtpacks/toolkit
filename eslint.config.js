import eslint from "@eslint/js";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import eslint_ts from "typescript-eslint";

export default [
  {
    ignores: ["**/node_modules", "**/dist", "**/.cache", "**/.idea", "**/*.d.ts"],
  },
  eslint.configs.recommended,
  ...eslint_ts.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    rules: { "@typescript-eslint/no-explicit-any": "warn", "@typescript-eslint/no-unused-vars": "warn" },
  },
];
