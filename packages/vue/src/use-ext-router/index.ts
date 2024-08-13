import { RouteLocationRaw, Router, RouteRecordRaw } from "vue-router";

export const useExtRouter = (router: Router) => {
  /**
   * @function useExtRouter 退出登陆后，需要清空路由
   * @param {Router} router
   * @param {string[]} excludes name | path
   * @description
   * 在登录情况下，用户一定存在404路由用来显示不存在的或被过滤的路由页面，同时由于404路由应该放在异步路由后面
   * 所以在重置router时，需要清除404路由以避免后续添加异步路由时添加到404路由后面
   */
  const resetRouter = (excludes: string[]) => {
    const routes = router.getRoutes();
    routes.forEach((item) => {
      if (!excludes.find((x) => x === item.path || x === item.name)) {
        router.removeRoute(item.name as string);
      }
    });
  };

  /**
   * 删除嵌套路由
   * @param route
   */
  const deepDelete = (route: RouteRecordRaw) => {
    route.children?.forEach((item) => deepDelete(item));
    router.removeRoute(route.name as string);
  };

  /**
   * 添加嵌套路由
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

  /**
   * 回退路由，增加回退校验
   * @param defaultRoute
   * @param level
   */
  const goBackOrDefault = (
    defaultRoute: RouteLocationRaw,
    level = 1
  ): void | never => {
    if (window?.history?.length > level) {
      router.back();
    } else if (defaultRoute) {
      router.push(defaultRoute);
    } else {
      throw new Error("跳转失败");
    }
  };

  return {
    resetRouter,
    deepDelete,
    addRoutes,
    goBackOrDefault,
  };
};

export default useExtRouter;
