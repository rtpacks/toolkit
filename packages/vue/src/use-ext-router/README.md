# useExtRouter API 规范文档

## 类型定义

```typescript
import type { RouteLocationRaw, Router, RouteRecordRaw } from "vue-router";
```

## 核心方法

### resetRouter

**功能**：安全重置路由表，保留指定路由

```typescript
function resetRouter(excludes: string[]): void;
```

**参数说明**：
| 参数 | 类型 | 默认值 | 必需 | 描述 |
|----------|----------|--------|------|-------------------------------|
| excludes | string[] | - | 是 | 保留路由标识（支持name/path） |

**实现原理**：

1. 获取当前所有注册路由
2. 遍历删除不在排除列表中的路由
3. 支持同时匹配路由的`name`和`path`属性

**使用示例**：

```typescript
// 保留登录页和404错误页
resetRouter(["/login", "404"]);
```

### deepDelete

**功能**：递归删除嵌套路由树

```typescript
function deepDelete(route: RouteRecordRaw): void;
```

**参数说明**：
| 参数 | 类型 | 默认值 | 必需 | 描述 |
|--------|-----------------|--------|------|------------|
| route | RouteRecordRaw | - | 是 | 根路由对象 |

**实现特性**：

1. 深度优先遍历子路由
2. 自动处理路由命名冲突
3. 支持Vue Router 4.x的嵌套路由结构

**使用示例**：

```typescript
deepDelete({
  name: "admin",
  path: "/admin",
  children: [
    { path: "users", component: UserList },
    { path: "logs", component: AuditLog },
  ],
});
```

### addRoutes

**功能**：批量注册安全路由

```typescript
function addRoutes(routes: RouteRecordRaw[], prev_excludes?: string[]): void;
```

**参数说明**：
| 参数 | 类型 | 默认值 | 必需 | 描述 |
|---------------|------------------|--------|------|--------------------------|
| routes | RouteRecordRaw[] | - | 是 | 需要添加的路由配置树 |
| prev_excludes | string[] | [] | 否 | 预删除的旧路由名称列表 |

**实现特性**：

1. 原子化路由操作（先删除旧路由再添加新路由）
2. 自动处理路由重复添加问题
3. 支持批量操作嵌套路由

**使用示例**：

```typescript
addRoutes(
  [
    {
      path: "/dashboard",
      component: DashboardLayout,
      children: [{ path: "analytics", component: Analytics }],
    },
  ],
  ["legacy_dashboard"],
);
```

### goBackOrDefault

**功能**：安全导航回退

```typescript
function goBackOrDefault(defaultRoute: RouteLocationRaw, level: number = 1): void | never;
```

**参数说明**：
| 参数 | 类型 | 默认值 | 必需 | 描述 |
|---------------|--------------------|--------|------|----------------------------|
| defaultRoute | RouteLocationRaw | - | 是 | 回退失败时的目标路由 |
| level | number | 1 | 否 | 需要回退的历史记录层级数 |

**错误处理**：

- 当历史记录不足且未提供默认路由时，抛出错误

**使用示例**：

```typescript
// 回退两步或跳转首页
goBackOrDefault({ path: "/" }, 2);
```

## 错误代码

| 错误场景                 | 错误类型     | 解决方案                       |
| ------------------------ | ------------ | ------------------------------ |
| 历史记录不足且无默认路由 | Error        | 必须提供有效的defaultRoute参数 |
| 重复添加同名路由         | Console Warn | 使用addRoutes自动处理          |
