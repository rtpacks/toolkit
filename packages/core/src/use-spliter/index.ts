import { isString, isFunction } from "lodash-es";

export type Unit = string | number;
export type TransFormFn<T extends Unit = Unit> = (v: string, index: number, arr: string[]) => T;

export default function useSpliter(spliter = ":") {
  /**
   * 拼接方法
   * @param prev
   * @param next
   * @returns
   */
  const splice = (prev: Unit, next: Unit) => {
    return `${prev}${spliter}${next}`;
  };

  /**
   * 分割方法
   * @param v
   * @param transform
   * @returns
   */
  const split = <T extends Unit = Unit>(v: string, transform?: TransFormFn<T>): T[] | never => {
    if (isString(v) && v.includes(spliter)) {
      const res = v.split(spliter);

      return isFunction(transform) ? res.map(transform) : (res as T[]);
    }
    throw new Error("解析失败，无效的分隔符");
  };

  /**
   * 获取首个元素
   * @param v
   * @returns
   */
  const take = (v: string) => {
    return split<string>(v)[0];
  };

  return {
    splice,
    split,
    take,
  };
}
