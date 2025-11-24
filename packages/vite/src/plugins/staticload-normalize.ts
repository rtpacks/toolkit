import type { Plugin } from "vite";

/**
 * 将静态 import 转换为Object，避免解析加载内容
 * @param extnames 支持的文件后缀列表，默认为 ["vue"]
 *
 * @description
 * 暂不支持处理非 default 格式数据
 * ```ts
 * origin
 * import Layout from "@/layout/index.vue"
 *
 * target
 * const Layout = {
 *   name: "Layout",
 *   component: () => Promise.resolve({ _componentPath: "@/layout/index.vue" }),
 *   meta: {}
 * };
 * ```
 */
export function staticloadNormalize(extnames: string | string[] = ["vue"]): Plugin {
  const extensions = Array.isArray(extnames) ? extnames : [extnames];

  // 转义特殊字符并构建后缀匹配部分
  const extPattern = extensions
    .map((ext) => ext.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")) // 转义特殊字符
    .join("|");

  const plugin: Plugin = {
    name: "staticload-normalize",
    transform(code, id, options) {
      // 动态构建正则表达式以支持多种后缀
      // const lazyRegex = /(?<=^|\n)\s*import\s+(\w+)\s+from\s+(['"])([^'"]+\.vue)\2;\s*(?=\n|$)/g;
      const lazyRegex = new RegExp(
        `(?<=^|\\n)\\s*import\\s+(\\w+)\\s+from\\s+(['"])([^'"]+\\.(?:${extPattern}))\\2;\\s*(?=\\n|$)`,
        "g",
      );
      const replaceValue = `
const $1 = {
  name: "$1",
  component: () => Promise.resolve({ _componentPath: "$3"}),
  meta: {}
}
`;

      return code.replace(lazyRegex, replaceValue);
    },
  };

  return plugin;
}

export default staticloadNormalize;
