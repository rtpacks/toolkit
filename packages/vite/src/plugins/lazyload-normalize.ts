import type { Plugin } from "vite";

/**
 * 将懒加载 import 函数转换为 Promise 函数，避免解析懒加载内容
 * @param extnames 支持的文件后缀列表，默认为 ["vue"]
 *
 * @description
 * ```ts
 * origin
 * const comp = () => import("@/views/dashboard/index.vue")
 *
 * target
 * const comp = () => Promise.resolve({ _componentPath: "@/views/dashboard/index.vue" })
 * ```
 */
export function lazyloadNormalize(extnames: string | string[] = ["vue"]): Plugin {
  const extensions = Array.isArray(extnames) ? extnames : [extnames];

  // 转义特殊字符并构建后缀匹配部分
  const extPattern = extensions
    .map((ext) => ext.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")) // 转义特殊字符
    .join("|");

  const plugin: Plugin = {
    name: "lazyload-normalize",
    transform(code, id, options) {
      // const lazyRegex = /\(\s*\)\s*=>\s*import\s*\(\s*(['"])([^'")]+?\.vue)\1\s*\)/g;
      // 动态构建正则表达式以支持多种后缀
      const lazyRegex = new RegExp(
        `\\(\\s*\\)\\s*=>\\s*import\\s*\\(\\s*(['"])((?:[^'"]+?\\.(?:${extPattern}))|[^'")]+?)\\1\\s*\\)`,
        "g",
      );
      const replaceValue = '() => Promise.resolve({ _componentPath: "$2"})';

      return code.replace(lazyRegex, replaceValue);
    },
  };

  return plugin;
}

export default lazyloadNormalize;
