# useExtRouter

拓展 vue-router 的工具函数

## Signature

```typescript
useExtRouter: (router: Router) => {
    resetRouter: (excludes: string[]) => void;
    deepDelete: (route: RouteRecordRaw) => void;
    addRoutes: (routes: RouteRecordRaw[], prev_excludes?: string[]) => void;
    goBackOrDefault: (defaultRoute: RouteLocationRaw, level?: number) => void | never;
}
```

## Usage

### resetRouter

正常情况下，404 路由用来匹配不存在(或被过滤)的路由，并且路由器中的 404 路由是处于所有路由之后的，这样才能避免 404 错误匹配问题。
当路由器存在 404 路由并且需要添加路由时，就可以利用 resetRouter 删除原有路由并添加新路由，以避免后续添加异步路由时添加在 404 路由之后

```typescript
/**
 * @param router - Router 路由器
 * @param excludes - name | path，给定的 excludes 路由不会被删除
 */
const resetRouter = (excludes: string[]) => {
  const routes = router.getRoutes();
  routes.forEach((item) => {
    if (!excludes.find((x) => x === item.path || x === item.name)) {
      router.removeRoute(item.name as string);
    }
  });
};
```

### deepDelete

给定常用的嵌套路由结构，使用 deppDelete 可以通过 routeName 删除路由器中存在的路由

```typescript
/**
 * @param route
 */
const deepDelete = (route: RouteRecordRaw) => {
  route.children?.forEach((item) => deepDelete(item));
  router.removeRoute(route.name as string);
};
```

### addRoutes

给定常用的嵌套路由结构，使用 addRoutes 可以添加路由

```typescript
/**
 * @param routes
 */
const addRoutes = (routes: RouteRecordRaw[], prev_excludes?: string[]) => {
  if (prev_excludes?.length) {
    prev_excludes.forEach((item) => {
      router.removeRoute(item);
    });
  }

  routes.forEach((item) => {
    deepDelete(item); // 避免重复添加路由
    router.addRoute(item);
  });
};
```

### goBackOrDefault

回退路由，增加回退校验

```typescript
/**
 * @param defaultRoute - 当路由栈不足以回退时，可以跳转到指定的路由
 * @param level - 当路由栈中路由数量满足该属性时才会出栈
 */
const goBackOrDefault = (defaultRoute: RouteLocationRaw, level = 1): void | never => {
  if (window?.history?.length > level) {
    router.back();
  } else if (defaultRoute) {
    router.push(defaultRoute);
  } else {
    throw new Error("Jump failed: No additional or default route available.");
  }
};
```
