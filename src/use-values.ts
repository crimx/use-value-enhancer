import type {
  ReactiveList,
  ReactiveMap,
  ReactiveSet,
} from "value-enhancer/collections";
import { useDerived } from "./use-derived";
import type { ReadonlyVal } from "value-enhancer";
import { getValues } from "./utils";

/**
 * Get values as array from reactive collection.
 * @returns values as array from the reactive collection, or undefined if no collection provided.
 */
export function useValues<TValue = unknown>(): TValue[] | undefined;
/**
 * Get values as array from ReactiveSet.
 * @param set ReactiveSet
 * @returns values as array from ReactiveSet.
 */
export function useValues<TValue>(set: ReactiveSet<TValue>): TValue[];
/**
 * Get values as array from ReactiveSet.
 * @param set ReactiveSet
 * @returns values as array from ReactiveSet, or undefined if no set provided.
 */
export function useValues<TValue>(
  set?: ReactiveSet<TValue>
): TValue[] | undefined;
/**
 * Get values as array from ReactiveList.
 * @param list ReactiveList
 * @returns values as array from ReactiveList.
 */
export function useValues<TValue>(list: ReactiveList<TValue>): TValue[];
/**
 * Get values as array from ReactiveList.
 * @param list ReactiveList
 * @returns values as array from ReactiveList, or undefined if no list provided.
 */
export function useValues<TValue>(
  list?: ReactiveList<TValue>
): TValue[] | undefined;
/**
 * Get values as array from ReactiveMap.
 * @param map ReactiveMap
 * @returns values as array from ReactiveMap.
 */
export function useValues<TKey, TValue>(
  map: ReactiveMap<TKey, TValue>
): TValue[];
/**
 * Get values as array from ReactiveMap.
 * @param map ReactiveMap
 * @returns values as array from ReactiveMap, or undefined if no map provided.
 */
export function useValues<TKey, TValue>(
  map?: ReactiveMap<TKey, TValue>
): TValue[];
/**
 * Get values as array from reactive collection.
 * @param col ReactiveMap | ReactiveSet | ReactiveList
 * @returns values as array from the reactive collection.
 */
export function useValues<TKey, TValue>(
  col?: ReactiveMap<TKey, TValue> | ReactiveSet<TValue> | ReactiveList<TValue>
): TValue[];
/**
 * Get values as array from reactive collection.
 * @param col ReactiveMap | ReactiveSet | ReactiveList
 * @returns values as array from the reactive collection, or undefined if no collection provided.
 */
export function useValues<TKey, TValue>(
  col?: ReactiveMap<TKey, TValue> | ReactiveSet<TValue> | ReactiveList<TValue>
): TValue[] | undefined;
export function useValues<TKey, TValue>(
  col?: ReactiveMap<TKey, TValue> | ReactiveSet<TValue> | ReactiveList<TValue>
): TValue[] | undefined {
  return useDerived(
    col?.$ as ReadonlyVal<
      ReactiveMap<TKey, TValue> | ReactiveSet<TValue> | ReadonlyArray<TValue>
    >,
    getValues
  );
}
