import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { Alias } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const alias: Alias[] = [
  {
    find: "@",
    replacement: resolve(__dirname, "../packages"),
  },
  // {
  //   find: /^@rtpackx\/(core|vue|react|utils|nestjs|vite)\/?(.*)$/,
  //   replacement: resolve(__dirname, `../packages/$1/src/$2`),
  // }
];
