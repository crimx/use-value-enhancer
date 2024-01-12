import type {
  ReactiveList,
  ReactiveMap,
  ReactiveSet,
} from "value-enhancer/collections";
import { useDerived } from "./use-derived";
import type { ReadonlyVal } from "value-enhancer";
import { getKeys } from "./utils";

/**
 * Get keys as array from reactive collection.
 * @returns keys as array from the reactive collection, or undefined if no collection provided.
 */
export function useKeys<TValue = unknown>(): TValue[] | undefined;
/**
 * Get keys as array from ReactiveSet.
 * @param set ReactiveSet
 * @returns keys as array from ReactiveSet.
 */
export function useKeys<TValue>(set: ReactiveSet<TValue>): TValue[];
/**
 * Get keys as array from ReactiveSet.
 * @param set ReactiveSet
 * @returns keys as array from ReactiveSet, or undefined if no set provided.
 */
export function useKeys<TValue>(
  set?: ReactiveSet<TValue>
): TValue[] | undefined;
/**
 * Get keys as array from ReactiveList.
 * @param list ReactiveList
 * @returns keys as array from ReactiveList.
 */
export function useKeys<TValue>(list: ReactiveList<TValue>): number[];
/**
 * Get keys as array from ReactiveList.
 * @param list ReactiveList
 * @returns keys as array from ReactiveList, or undefined if no list provided.
 */
export function useKeys<TValue>(
  list?: ReactiveList<TValue>
): number[] | undefined;
/**
 * Get keys as array from ReactiveMap.
 * @param map ReactiveMap
 * @returns keys as array from ReactiveMap.
 */
export function useKeys<TKey, TValue>(map: ReactiveMap<TKey, TValue>): TKey[];
/**
 * Get keys as array from ReactiveMap.
 * @param map ReactiveMap
 * @returns keys as array from ReactiveMap, or undefined if no map provided.
 */
export function useKeys<TKey, TValue>(
  map?: ReactiveMap<TKey, TValue>
): TKey[] | undefined;
/**
 * Get keys as array from reactive collection.
 * @param col ReactiveMap | ReactiveSet | ReactiveList
 * @returns keys as array from the reactive collection.
 */
export function useKeys<TKey, TValue>(
  col: ReactiveMap<TKey, TValue> | ReactiveSet<TKey> | ReactiveList<TValue>
): (TKey | number)[];
/**
 * Get keys as array from reactive collection.
 * @param col ReactiveMap | ReactiveSet | ReactiveList
 * @returns keys as array from the reactive collection, or undefined if no collection provided.
 */
export function useKeys<TKey, TValue>(
  col?: ReactiveMap<TKey, TValue> | ReactiveSet<TKey> | ReactiveList<TValue>
): (TKey | number)[] | undefined;
export function useKeys<TKey, TValue>(
  col?: ReactiveMap<TKey, TValue> | ReactiveSet<TKey> | ReactiveList<TValue>
): (TKey | number)[] | undefined {
  return useDerived(
    col?.$ as ReadonlyVal<
      ReactiveMap<TKey, TValue> | ReactiveSet<TKey> | ReadonlyArray<TValue>
    >,
    getKeys
  );
}
