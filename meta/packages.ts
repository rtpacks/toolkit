import { PackageManifest } from "./types";

export const packages: PackageManifest[] = [
  // @rtpackx/core
  {
    name: "core",
    entry: "packages/core/index.ts",
    outDir: "packages/core/dist",
  },
  // @rtpackx/vue
  {
    name: "vue",
    entry: "packages/vue/index.ts",
    outDir: "packages/vue/dist",
    external: ["vue-router"],
  },
];
