import eslint from "@eslint/js";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import eslint_ts from "typescript-eslint";

export default [
  {
    ignores: [
      "**/node_modules/",
      "**/dist/",
      "**/.cache/",
      "**/.idea/",
      "packages/.vitepress/",
      "coverage/",
      "**/*.d.ts",
      "*.min.js",
      "*.min.css",
      "*.min.map",
      "*.min.js.map",
      "*.min.css.map",
      "*.min.js.gz",
      "*.min.css.gz",
      "*.min.js.gz.map",
      "*.min.css.gz.map",
      "*.min.js.br",
      "*.min.css.br",
      "*.min.js.br.map",
      "*.min.css.br.map",
      "*.min.js.gz.br",
      "*.min.css.gz.br",
    ],
  },
  eslint.configs.recommended,
  ...eslint_ts.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "no-control-regex": "warn",
    },
  },
];
