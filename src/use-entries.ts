import { useDerived } from "./use-derived";
import type { ValConfig } from "value-enhancer";
import { isVal, type ReadonlyVal } from "value-enhancer";
import type { ColWithEntries } from "./utils";
import { getEntries } from "./utils";

type MaybeColWithEntries$<TKey, TValue> =
  | ReadonlyVal<ColWithEntries<TKey, TValue>>
  | { $: ReadonlyVal<ColWithEntries<TKey, TValue>> };

/**
 * Get entries as array from reactive collection.
 * @returns Entries as array from the reactive collection, or undefined if no collection provided.
 */
export function useEntries<TKey = unknown, TValue = unknown>():
  | [TKey, TValue][]
  | undefined;
/**
 * Get entries as array from reactive collection.
 * @param col A Reactive Collection or a ReadonlyVal of Collection.
 * @returns Entries as array from the reactive collection.
 */
export function useEntries<TKey, TValue>(
  col: MaybeColWithEntries$<TKey, TValue>,
  eagerOrConfig?: boolean | ValConfig<[TKey, TValue][]>
): [TKey, TValue][];
/**
 * Get entries as array from reactive collection.
 * @param col An optional Reactive Collection or a ReadonlyVal of Collection.
 * @returns Entries as array from the reactive collection, or undefined if no collection provided.
 */
export function useEntries<TKey, TValue>(
  col?: MaybeColWithEntries$<TKey, TValue>,
  eagerOrConfig?: boolean | ValConfig<[TKey, TValue][]>
): [TKey, TValue][] | undefined;
export function useEntries<TKey, TValue>(
  col?: MaybeColWithEntries$<TKey, TValue>,
  eagerOrConfig?: boolean | ValConfig<[TKey, TValue][]>
): [TKey, TValue][] | undefined {
  return useDerived(isVal(col) ? col : col?.$, getEntries, eagerOrConfig);
}
