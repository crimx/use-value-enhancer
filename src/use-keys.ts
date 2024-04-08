import { useDerived } from "./use-derived";
import type { ValConfig } from "value-enhancer";
import { isVal, type ReadonlyVal, arrayShallowEqual } from "value-enhancer";
import type { ColWithKeys } from "./utils";
import { getKeys } from "./utils";

type MaybeColWithKeys$<TValue> =
  | ReadonlyVal<ColWithKeys<TValue>>
  | { $: ReadonlyVal<ColWithKeys<TValue>> };

const KEY_CONFIG = { equal: arrayShallowEqual };

/**
 * Get keys as array from reactive collection.
 * @returns Keys as array from the reactive collection, or undefined if no collection provided.
 */
export function useKeys<TKey = unknown>(): TKey[] | undefined;
/**
 * Get keys as array from reactive collection.
 * @param col A Reactive Collection or a ReadonlyVal of Collection.
 * @returns Keys as array from the reactive collection.
 */
export function useKeys<TKey>(
  col: MaybeColWithKeys$<TKey>,
  eagerOrConfig?: boolean | ValConfig<TKey[]>
): TKey[];
/**
 * Get keys as array from reactive collection.
 * @param col An optional Reactive Collection or a ReadonlyVal of Collection.
 * @returns Keys as array from the reactive collection, or undefined if no collection provided.
 */
export function useKeys<TKey>(
  col?: MaybeColWithKeys$<TKey>,
  eagerOrConfig?: boolean | ValConfig<TKey[]>
): TKey[] | undefined;
export function useKeys<TKey>(
  col?: MaybeColWithKeys$<TKey>,
  eagerOrConfig: boolean | ValConfig<TKey[]> = KEY_CONFIG
): TKey[] | undefined {
  return useDerived(isVal(col) ? col : col?.$, getKeys, eagerOrConfig);
}
