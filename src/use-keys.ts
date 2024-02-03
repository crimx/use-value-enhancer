import { useDerived } from "./use-derived";
import { isVal, type ReadonlyVal } from "value-enhancer";
import type { ColWithKeys } from "./utils";
import { getKeys } from "./utils";

type MaybeColWithKeys$<TValue> =
  | ReadonlyVal<ColWithKeys<TValue>>
  | { $: ReadonlyVal<ColWithKeys<TValue>> };

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
export function useKeys<TKey>(col: MaybeColWithKeys$<TKey>): TKey[];
/**
 * Get keys as array from reactive collection.
 * @param col An optional Reactive Collection or a ReadonlyVal of Collection.
 * @returns Keys as array from the reactive collection, or undefined if no collection provided.
 */
export function useKeys<TKey>(
  col?: MaybeColWithKeys$<TKey>
): TKey[] | undefined;
export function useKeys<TKey>(
  col?: MaybeColWithKeys$<TKey>
): TKey[] | undefined {
  return useDerived(isVal(col) ? col : col?.$, getKeys);
}
