import { dirname, resolve } from "node:path";
import { exec } from "node:child_process";
import { fileURLToPath } from "node:url";
import { rollup } from "rollup";
import fs from "fs-extra";
import dts from "rollup-plugin-dts";
import fg from "fast-glob";
import { packages } from "../meta/packages";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, `../`);

fs.removeSync(resolve(__dirname, "../packages/auto-imports.d.ts"));
fs.removeSync(resolve(__dirname, "../packages/.eslintrc-auto-import.json"));

const externals = ["vue", "vue/jsx-runtime", "vue-demi", "@vueuse/core"];

export async function build_dts() {
  for (const pkg of packages) {
    fs.removeSync(resolve(root, `${pkg.outDir}/${pkg.outputFileName ?? "index"}.d.ts`));

    const bundle = await rollup({
      input: pkg.entry,
      external: externals,
      // plugins: [dts({ respectExternal: true })],
      plugins: [dts()],
    });

    await bundle.write({
      file: `${pkg.outDir}/${pkg.outputFileName ?? "index"}.d.ts`,
      format: "es",
    });
  }
}

build_dts();
