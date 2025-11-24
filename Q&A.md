1. package.json exports field

exports 需要与 files 相匹配，如以下配置存在问题 `./*` 并不能导入所有文件，因为  files 限制只有 dist 和 d.ts

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs"
    },
    "./*": "./*"
  },
  "main": "./dist/index.cjs",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "files": ["*.d.ts", "dist"]
}
```
