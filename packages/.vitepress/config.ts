import { defineConfig } from "vitepress";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import VueJsx from "@vitejs/plugin-vue-jsx";
import { version } from "../../package.json";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, `../`);

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Toolkit",
  description: "The useful tools",
  lang: "zh-CN",
  cleanUrls: true,
  lastUpdated: true,

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      {
        text: `v${version}`,
        items: [{ text: "更新日志", link: "/docs/CHANGELOG.md" }],
      },
    ],
    search: { provider: "local" },

    sidebar: [
      {
        text: "@rtpackx/core",
        items: [
          { text: "Markdown Examples", link: "/markdown-examples" },
          { text: "Runtime API Examples", link: "/api-examples" },
        ],
      },
      {
        text: "@rtpackx/vue",
        items: [
          { text: "Markdown Examples", link: "/markdown-examples" },
          { text: "Runtime API Examples", link: "/api-examples" },
        ],
      },
    ],

    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright (c) 2024-present, Mr.MF",
    },

    socialLinks: [{ icon: "github", link: "https://github.com/rtpacks/toolkit" }],
  },

  vite: {
    resolve: {
      alias: [{ find: "@", replacement: resolve(__dirname, "../") }],
    },
    plugins: [
      VueJsx(),
      // MarkdownTransform(),
    ],
  },
});
