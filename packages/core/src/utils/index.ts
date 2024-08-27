import { merge } from "lodash-es";

export type UnionNull<T> = T | null;
export type UnionUndefined<T> = T | undefined;
export type UnionNone<T> = UnionNull<T> | UnionUndefined<T>;
export type DeepPartial<T> = {
  [K in keyof T]?: DeepPartial<T[K]>;
};
export interface ErrorTrait<T = boolean> {
  error: T;
}

export type Key = keyof any;
export type Unit<T = unknown> = T extends unknown ? string | number : string | number | T;

export interface IOption<T extends Unit = Unit> {
  key: string | number;
  label: string;
  value: T;
  [k: string]: unknown;
}
export interface TreeNode<T extends Unit = Unit> {
  key: string | number;
  label: string;
  value: T;
  icon?: string;
  count?: number;
  children?: TreeNode<T>[];
  [k: string]: unknown;
}
export interface NodeOptions extends IOption {
  children?: NodeOptions[];
}

export const genOptionMap = (options: IOption[], _fieldNames: Partial<FieldNames> = genFieldNames()) => {
  const fieldNames = merge(genFieldNames(), _fieldNames);

  return options.reduce(
    (target, item) => {
      target[item[fieldNames.key] as string] = item;
      return target;
    },
    {} as Record<string, IOption>,
  );
};

export interface HttpResponse<T = unknown> {
  status: number;
  errMsg: string;
  errCode: number;
  data: T;
}
export interface ResponseWrap<T = unknown> {
  errCode: number;
  errMsg: string;
  data: T;
}

export interface ListResults<T = unknown> {
  items: T[];
  total: number;
  data: T[];
  count: number;
}

export interface FieldNames {
  label: string;
  value: string;
  key: string;
  icon: string;
  name: string;
  children: string;
}
export type PartialFieldNames = Partial<FieldNames>;
export const genFieldNames = (defaultValue?: Partial<FieldNames>): FieldNames => ({
  key: "key",
  label: "label",
  value: "value",
  icon: "icon",
  name: "name",
  children: "children",
  ...(defaultValue || {}),
});

export const PrivateID = "__pid__";
export type UnionPrivateID<T> = T & { [PrivateID]: string };
export type IterFn<T> = (value: T, index: number, arr: T[]) => UnionPrivateID<T>;

/**
 * 将给定的数组的每个元素按照指定的方法处理元素
 * @param arr
 * @param iter
 * @returns
 */
export const unionPrivateId = <T = Record<string, any>>(arr: T[], iter: IterFn<T>): UnionPrivateID<T>[] => {
  return arr.map(iter);
};

export interface RangeFnOptions {
  left: number;
  right: number;
  contains: [boolean, boolean]; // 左开右闭，左闭右开，左开右开，左闭右闭
}
export const inRangeFn = (
  val: number,
  opt: RangeFnOptions = {
    left: 0,
    right: 100,
    contains: [true, false],
  },
) => {
  if (Number.isNaN(val)) return false;
  if (typeof val === "number") {
    const { left, right, contains = [true, false] } = opt;
    const leftRes = contains[0] ? val >= left : val > left;
    const rightRes = contains[1] ? val <= right : val < right;

    return leftRes && rightRes;
  }
  return false;
};

/**
 * 在 template 格式化中，`v as any` 可能影响 template 代码块的高亮，使用 `(v as any)` 时，prettier 会将其变为 `v as any`，导致高亮问题。
 * 当然，可以选择使用 `(v, v as any)` 方式避免自动格式化去掉括号
 *
 * @public
 * @param value - The other type
 * @returns value as any
 *
 */
export const asAnyType = (value: any): any => value;
