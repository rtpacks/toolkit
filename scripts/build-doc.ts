// https://www.cnblogs.com/rongfengliang/p/16269305.html

import { dirname, resolve } from "node:path";
import { exec, execSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";
import fs from "fs-extra";
import FastGlob from "fast-glob";
import { Extractor, ExtractorConfig, ExtractorResult, IConfigFile } from "@microsoft/api-extractor";
import { merge } from "lodash-es";
import { packages } from "../meta/packages";
import { PackageConfig } from "../meta/types";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, `../`);

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
        mainEntryPointFilePath: resolve(root, `${outDir}/index.d.ts`),
        docModel: { apiJsonFilePath: resolve(root, `${outDir}/index.api.json`) },
        apiReport: { reportFolder: resolve(root, outDir) },
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

// export async function build_doc() {
//   await build_api_json();
//   await build_api_doc();
//   await build_external();
// }

async function build_manual_api_json() {
  for (const pkg of packages) {
    const { name } = pkg;
    const pkg_path = resolve(root, `packages/${name}`);
    const config_path = resolve(`${pkg_path}/config.ts`);
    const exists_config = fs.existsSync(config_path);
    const pkg_config: PackageConfig | null = exists_config
      ? await import(pathToFileURL(config_path).href)
      : null;
    const libs = await FastGlob([`src/*/index.ts`], { cwd: pkg_path });

    for await (const lib of libs) {
      const regexp = /.*src\/(.*)\/index.ts$/;
      const lib_name = regexp.exec(lib)![1];
      const lib_path = resolve(pkg_path, `src/${lib_name}`);

      execSync(`cd ${lib_path} && npx tsc index.ts  --declaration --emitDeclarationOnly`);
      console.log(`tsc ${lib} completed successfully`);

      // api-extractor building, only the pkg_config exists will generate
      if (!exists_config) continue;
      if (!pkg_config?.docBuildConfig.apiExtractor?.includes?.length) continue;

      // parse the api-extractor.json file
      const extractorConfig: ExtractorConfig = ExtractorConfig.prepare({
        configObject: merge(extractorFile, {
          mainEntryPointFilePath: resolve(pkg_path, `src/${lib_name}/index.d.ts`),
          docModel: { apiJsonFilePath: resolve(pkg_path, `src/${lib_name}/index.api.json`) },
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
}

async function build_manual_doc() {
  for (const pkg of packages) {
    const { name } = pkg;
    const pkg_path = resolve(root, `packages/${name}`);

    const libs = await FastGlob([`src/*/index.ts`], { cwd: pkg_path });
    for await (const lib of libs) {
      const regexp = /.*src\/(.*)\/index.ts$/;
      const lib_name = regexp.exec(lib)![1];
      const lib_path = resolve(pkg_path, `src/${lib_name}`);

      // TODO: fs.existsSync(resolve(lib_path, 'index.api.json')) 根据 api.json 生成文档
      // 否则将 index.d.ts 加入到当前 lib 下的默认 index.md
    }
  }
}

export async function build_doc() {
  // steps
  // 1. build index.d.ts，将 d.ts 加入到 src/${lib}/index.md
  // 2. 利用 api-extractor 和 index.d.ts 生成 index.api.json
  // 3. 手动解析 index.api.json 生成 markdown
  await build_manual_api_json();
  await build_manual_doc();
  // await build_external();
}

build_doc();
