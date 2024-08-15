import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { Alias } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const alias: Alias[] = [
  {
    find: "@",
    replacement: resolve(__dirname, "../packages"),
  },
  {
    find: "@rtpackx/core",
    replacement: resolve(__dirname, "../packages/core/index"),
  },
  {
    find: "@rtpackx/vue",
    replacement: resolve(__dirname, "../packages/vue/index"),
  },
  {
    find: /^@rtpackx\/vue\/(.*)$/,
    replacement: resolve(__dirname, "../packages/vue/src/$1/index"),
  },
  {
    find: "@rtpackx/react",
    replacement: resolve(__dirname, "../packages/react/index"),
  },
  {
    find: "@rtpackx/form",
    replacement: resolve(__dirname, "../packages/form/index"),
  },
];
