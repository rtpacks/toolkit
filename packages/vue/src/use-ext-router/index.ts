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
  const goBackOrDefault = (defaultRoute: RouteLocationRaw, level = 1): void | never => {
    if (window?.history?.length > level) {
      router.back();
    } else if (defaultRoute) {
      router.push(defaultRoute);
    } else {
      throw new Error("跳转失败");
    }
  };

  /**
   * 根据 Ctrl/Cmd 键状态智能执行页面导航
   *
   * @param event - 鼠标点击事件对象，用于检测是否按下 Ctrl(Windows)或 Meta(Mac)键
   * @param url - 目标导航地址
   * @param replace - 可选参数，是否替换当前历史记录（默认false，即新增历史记录）
   */
  const evalCtrlNavigate = async (event: MouseEvent, url: string, replace?: boolean) => {
    const isModifierKeyPressed = event.ctrlKey || event.metaKey;

    if (isModifierKeyPressed) {
      await window.open(url, "_blank"); // 新标签页打开
      return;
    }

    if (replace) {
      await router.replace(url);
    } else {
      await router.push(url);
    }
  };

  return {
    resetRouter,
    deepDelete,
    addRoutes,
    goBackOrDefault,
    evalCtrlNavigate,
    smartCtrlNavigate: evalCtrlNavigate,
  };
};

export default useExtRouter;
