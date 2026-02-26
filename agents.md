# agents.md

## 项目概述

TypeScript monorepo (`@rtpackx/toolkit`)，提供 Vue、React、NestJS、Vite 等框架的工具库。使用 pnpm workspaces，核心工具在 `core` 包中，其他框架包依赖 core。

## 项目结构

```
packages/
├── core/       - 框架无关的工具函数（基础层）
├── vue/        - Vue 3 composables
├── react/      - React hooks（当前为空）
├── nestjs/     - NestJS 装饰器和工具
└── vite/       - Vite 插件
```

## 包详情

### @rtpackx/core
框架无关的工具库，导出:
- `utils/` - 纯工具函数: `is.ts` (类型判断、IP/域名验证)、`trait.ts` (接口定义)、`string.ts`、`time.ts`
- `use-cache/` - 内存缓存（基于 Map，支持 TTL 过期）
- `use-spliter/` - 分隔工具
- `indexdb/` - IndexedDB 封装
- `monitor/` - 性能/错误监控

### @rtpackx/vue
Vue 3 composables，依赖 `@rtpackx/core`，peerDependencies: `vue@^3.0.0`, `vue-router@^4.0.0`
- `use-ext-router/` - 路由扩展（resetRouter, addRoutes, deepDelete, goBackOrDefault）
- `use-replace-state/` - 状态替换
- `use-route-listener/` - 路由监听
- `use-select/` - 选择器
- `use-switchable/` - 可切换状态
- `use-tree/` - 树形数据处理（支持 checkbox 半选、父子联动）

### @rtpackx/react
React hooks 库，当前为空包

### @rtpackx/nestjs
NestJS 工具库
- `Assert.ts` - 运行时断言工具，使用 NestJS 异常

### @rtpackx/vite
Vite 插件
- `lazyload-normalize/` - 懒加载规范化
- `staticload-normalize/` - 静态加载规范化
- `compress/` - 压缩插件（已注释，存在构建问题）

## 常用命令

```bash
# 安装依赖
pnpm install

# 构建
pnpm build                    # 构建源码 + 类型声明
pnpm build:dts                # 仅构建类型声明
tsx scripts/build.ts          # 仅构建源码

# 代码检查
pnpm lint                     # 检查代码风格
pnpm lint:fix                 # 修复代码风格

# 测试
pnpm test                     # 运行 vitest

# 发布
pnpm release                  # 升级版本、创建 tag、生成 changelog
pnpm push                     # 推送 commit 和 tag
pnpm publish:r                # 发布并推送
```

## 依赖关系

- `@rtpackx/core` 是基础包，其他包都依赖它
- `@rtpackx/vue` 依赖 core，需要 `vue` 和 `vue-router` 作为 peer dependencies
- 每个包输出 ESM (.mjs) 和 CommonJS (.cjs) 格式，以及 TypeScript 声明 (.d.ts)

## 构建配置

- **包配置**: `meta/packages.ts` - 定义入口点、输出目录、外部依赖
- **构建脚本**: 
  - `scripts/build.ts` - 使用 Vite 打包，移除 console/debugger
  - `scripts/build-dts.ts` - 使用 rollup 生成类型声明
- **别名配置**: `meta/alias.ts` - `@` 指向 packages 目录

## 通用类型定义

```typescript
// 工具类型
type ValueType<T, K extends keyof T> = T[K]
type UnionNull<T> = T | null
type UnionUndefined<T> = T | undefined
type UnionNone<T> = UnionNull<T> | UnionUndefined<T>
type DeepPartial<T> = { [K in keyof T]?: DeepPartial<T[K]> }

// 常见类型
type Unit<T = unknown> = T extends unknown ? string | number : string | number | T
type BaseType = string | number
type UnionType = BaseType | Record<string, any>
type Data = Record<string, any>

// 树形类型
interface IOption<T extends Unit = Unit> {
  key: string | number
  label: string
  value: T
  [k: string]: any
}

interface TreeNode<T extends Unit = Unit> {
  key: string | number
  label: string
  value: T
  icon?: string
  count?: number
  children?: TreeNode<T>[]
  [k: string]: any
}

interface FieldNames {
  key: string
  label: string
  title: string
  value: string
  icon: string
  count: string
  parent: string
  children: string
  [k: string]: any
}
```

## 实现模式

**Composable 模式**: 以 `use-` 前缀的函数返回方法对象（非响应式 ref）
```typescript
export function useCache() {
  const cache = new Map<string, CacheItem<any>>();
  return { get, set, deleteKey, clear };
}
```

**Tree 组件模式**: 支持 checkbox 半选、父子联动、字段别名配置
```typescript
interface TreeOption {
  fieldNames: { id: string; parent: string; children: string; }
}
```

## Git 工作流

- **提交规范**: conventional commits (@commitlint/config-conventional)
- **发布流程**: `scripts/release.ts` 使用 bumpp 升级版本，自动生成 CHANGELOG

## 环境要求

- pnpm@10.23.0
- Node >=20.0.0
