// https://www.cnblogs.com/rongfengliang/p/16269305.html

import { dirname, resolve } from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import fs from "fs-extra";
import { Extractor, ExtractorConfig, ExtractorResult, IConfigFile } from "@microsoft/api-extractor";
import { packages } from "../meta/packages";
import { merge } from "lodash-es";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, `../`);

fs.removeSync(resolve(__dirname, "../packages/auto-imports.d.ts"));
fs.removeSync(resolve(__dirname, "../packages/.eslintrc-auto-import.json"));

// Load the api-extractor.json file
const extractorFile = ExtractorConfig.loadFile(resolve(root, "api-extractor.json"));

async function build_api_json() {
  for (const pkg of packages) {
    const { name, outDir } = pkg;
    fs.removeSync(resolve(root, `${outDir}/index.api.json`));
    fs.removeSync(resolve(root, `${outDir}/index.api.md`));

    // parse the api-extractor.json file
    const extractorConfig: ExtractorConfig = ExtractorConfig.prepare({
      configObject: merge(extractorFile, {
        mainEntryPointFilePath: resolve(root, `packages/${name}/dist/index.d.ts`),
        docModel: { apiJsonFilePath: `packages/${name}/dist/index.api.json` },
      } as IConfigFile),
      configObjectFullPath: resolve(root, "api-extractor.json"),
      packageJsonFullPath: resolve(root, `packages/${name}/package.json`),
    });

    // Invoke API Extractor
    const extractorResult: ExtractorResult = Extractor.invoke(extractorConfig, {
      // Equivalent to the "--local" command-line parameter
      localBuild: true,
      // Equivalent to the "--verbose" command-line parameter
      showVerboseMessages: true,
    });

    if (extractorResult.succeeded) {
      console.log(`API Extractor completed successfully`);
      process.exitCode = 0;
    } else {
      console.error(
        `API Extractor completed with ${extractorResult.errorCount} errors` +
          ` and ${extractorResult.warningCount} warnings`,
      );
      process.exitCode = 1;
    }
  }
}

async function build_api_doc() {
  for (const pkg of packages) {
    const { name, outDir } = pkg;
    const pkg_path = resolve(root, `packages/${name}`);
    execSync(
      `api-documenter markdown --input-folder ${pkg_path}/dist --output-folder ${root}/packages/docs/${name}`,
    );
  }
}

async function build_external() {
  // copy changelog
  execSync(`cp ${resolve(root, "CHANGELOG.md")} ${resolve(root, "packages/docs/")}`);
}

export async function build_doc() {
  await build_api_json();
  await build_api_doc();
  await build_external();
}

build_doc();
