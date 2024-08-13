import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { Alias } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const alias: Alias[] = [
  { find: "mixte", replacement: resolve(__dirname, "../packages/mixte/index") },
  {
    find: "@mixte/use/nuxt",
    replacement: resolve(__dirname, "../packages/use/src/nuxt"),
  },
  {
    find: "@mixte/use",
    replacement: resolve(__dirname, "../packages/use/index"),
  },
  {
    find: /^@mixte\/components\/(.*)$/,
    replacement: resolve(__dirname, "../packages/components/src/$1/index"),
  },
];
