import { Router, RouteLocationNormalizedLoadedGeneric } from "vue-router";

export interface ReplaceStateOption {
  /**
   * 模式：是否保留原有参数
   */
  mode: "push" | "replace";
  /**
   * 动作：是否保留当前历史记录
   * @description 在vue-router4中不推荐使用pushState，因为vue-router的信息时存储在state中的
   */
  action: "pushState" | "replaceState";
  /**
   * 是否同步到vue-router
   * @default true
   */
  sync: boolean;
}

export const genDefaultOption = (): ReplaceStateOption => ({
  mode: "push",
  action: "replaceState",
  sync: true,
});

/**
 * @function useReplaceState 不刷新替换参数，如果 replaceState 所在的工具文件中直接导入 router，可能会与组件中的 useRouter 等包形成循环依赖，所以抽离 router 依赖，让其注入
 * @param router 依赖注入
 */
export function useReplaceState(router: Router) {
  /**
   * @description  不刷新更新url，Vue3(Vue-Router) 不能监听到windows.history.replaceState的操作，所以router的url还是原有url！
   * @param query
   */
  const replaceState = async (
    query: string | object | null,
    option: Partial<ReplaceStateOption> = {
      mode: "push",
      action: "replaceState",
      sync: true,
    },
  ) => {
    const SPECIAL_VAL: any[] = [null, undefined, ""];
    if (SPECIAL_VAL.includes(query)) {
      throw new Error("query参数错误");
    }

    option = { ...genDefaultOption(), ...option };

    let _route: RouteLocationNormalizedLoadedGeneric & { href?: string } = router.currentRoute.value;

    if (typeof query === "object") {
      const route = router.resolve({
        query: {
          ...(option?.mode === "push" ? _route.query : {}),
          ...query,
        },
      });
      _route = Object.assign(router.currentRoute.value, route);
    }

    // close listening
    router.listening = false;
    if (_route) {
      router.currentRoute.value = _route;
    }
    if (option.action === "pushState") {
      await window.history.pushState({}, "", _route.href);
    }
    if (option.action === "replaceState") {
      await window.history.replaceState({}, "", _route.href);
    }
    if (option.sync === true) {
      await window.dispatchEvent(new PopStateEvent("popstate"));
    }
    // open listening
    router.listening = true;
  };

  const pushRouteQuery = (query: string | object) => {
    replaceState(query, { mode: "push", action: "pushState", sync: true });
  };

  const replaceRouteQuery = (query: string | object) => {
    replaceState(query, {
      mode: "replace",
      action: "replaceState",
      sync: true,
    });
  };

  return {
    replaceState,
    pushRouteQuery,
    replaceRouteQuery,
  };
}
