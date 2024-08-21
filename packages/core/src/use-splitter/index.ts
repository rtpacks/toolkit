import { isString, isFunction } from "lodash-es";
import type { Unit } from "../utils";

export type TransFormFn<T extends Unit = Unit> = (v: string, index: number, arr: string[]) => T;

/**
 * A custom hook to manage string splitting and joining using a delimiter.
 * @public
 * @param spliter - The delimiter used for string operations. Default is ":".
 * @returns An object containing the following methods:
 * - splice(prev: Unit, next: Unit): Joins two units with the specified delimiter.
 * - split<T extends Unit = Unit>(v: string, transform?: TransFormFn<T>): T[] | never: Splits a string into an array of units using the delimiter. Applies an optional transformation function.
 * - take(v: string): Retrieves the first element from the split result of the given string.
 *
 * @example
 * ```typescript
 * import useSplitter from '@rtpackx/core';
 *
 * const toNumber = (value: string) => parseInt(value, 10);
 * const { splice, split, take } = useSplitter();
 *
 * const joinedString = splice('apple', 'banana');
 * console.log(joinedString); // Output: "apple:banana"
 *
 * // Example of using split
 * const str = "1:2";
 * const splitResult = split<number>(str, toNumber);
 * console.log(splitResult); // Output: [1, 2]
 *
 * // Example of using take
 * const firstElement = take("orange:grape");
 * console.log(firstElement); // Output: "orange"
 * ```
 */
export function useSplitter(spliter = ":") {
  /**
   * Joins two units with the specified delimiter.
   * @param prev
   * @param next
   * @returns
   */
  const splice = (prev: Unit, next: Unit) => {
    return `${prev}${spliter}${next}`;
  };

  /**
   * Splits a string into an array of units using the delimiter. Applies an optional transformation function.
   * @param v - String to be split.
   * @param transform
   * @returns
   */
  const split = <T extends Unit = Unit>(v: string, transform?: TransFormFn<T>): T[] | never => {
    if (isString(v) && v.includes(spliter)) {
      const res = v.split(spliter);

      return isFunction(transform) ? res.map(transform) : (res as T[]);
    }
    throw new Error("Parsing failed, invalid delimiter.");
  };

  /**
   * Retrieves the first element from the split result of the given string.
   * @param v - String to be split.
   * @returns The first element
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
