import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "vite";
import Vue from "@vitejs/plugin-vue";
import VueJsx from "@vitejs/plugin-vue-jsx";
import fs from "fs-extra";
import { alias } from "../meta/alias";
import { packages } from "../meta/packages";
import configVisualizerPlugin from "../config/plugin/visualizer";

const __dirname = dirname(fileURLToPath(import.meta.url));
fs.removeSync(resolve(__dirname, "../packages/auto-imports.d.ts"));
fs.removeSync(resolve(__dirname, "../packages/.eslintrc-auto-import.json"));

const externals = ["vue", "vue-router", "vue-demi", "@vueuse/core"];
const execFn = async () => {
  for (const manifest of packages) {
    const { useVue, entry, outDir, outputFileName, external } = manifest;
    await build({
      resolve: { alias },
      plugins: [configVisualizerPlugin(), useVue && [Vue(), VueJsx()]],
      build: {
        outDir,
        lib: {
          entry,
          formats: ["es", "cjs"],
          fileName: (format) => `${outputFileName ?? "index"}.${format === "es" ? "mjs" : format}`,
        },
        minify: true,
        emptyOutDir: false,
        rollupOptions: {
          external: externals.concat(external ?? []),
        },
      },
      esbuild: {
        drop: ["console", "debugger"],
        minifyIdentifiers: true,
        minifyWhitespace: true,
        minifySyntax: true,
        treeShaking: true,
      },
    });
  }
};
execFn();
