export interface PackageManifest {
  name: string;
  entry: string;
  outDir: string;
  outputFileName?: string;
  /**
   * 是否使用 Vue 及相关插件
   */
  useVue?: boolean;

  /* feature 额外的拓展 */
  author?: string;
  description?: string;
  external?: string[];
  globals?: Record<string, string>;
  manualImport?: boolean;
  deprecated?: boolean;
  submodules?: boolean;
  build?: boolean;
  iife?: boolean;
  cjs?: boolean;
  mjs?: boolean;
  dts?: boolean;
  target?: string;
  utils?: boolean;
  copy?: string[];
}

export interface DocBuildConfig {
  apiExtractor?: {
    includes?: string[];
    excludes?: string[];
  };
}

export interface PackageConfig {
  docBuildConfig: DocBuildConfig;
}
