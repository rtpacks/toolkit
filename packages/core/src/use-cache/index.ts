type CacheItem<T> = {
  value: T;
  expiresAt?: number; // 过期时间戳（毫秒）
};
/**
 * 内存缓存 Hook（基于 Map 实现，数据仅在当前页面有效）
 */
export function useCache() {
  const cache = new Map<string, CacheItem<any>>();

  const get = <T>(key: string): T | undefined => {
    const item = cache.get(key);
    if (!item) return undefined;

    // 检查是否过期
    if (item.expiresAt && Date.now() > item.expiresAt) {
      cache.delete(key); // 自动清理过期缓存
      return undefined;
    }

    return item.value;
  };

  const set = (key: string, value: any, ttl?: number): void => {
    const expiresAt = ttl ? Date.now() + ttl : undefined;
    cache.set(key, { value, expiresAt });
  };

  /**
   * 删除缓存值
   * @param key 缓存键
   */
  const deleteKey = (key: string): void => {
    cache.delete(key);
  };

  /**
   * 清空所有缓存
   */
  const clear = (): void => {
    cache.clear();
  };

  return {
    get,
    set,
    deleteKey,
    delete: deleteKey,
    clear,
  };
}

export default useCache;
