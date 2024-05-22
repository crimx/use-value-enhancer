import { useDerived } from "./use-derived";
import type { ValConfig } from "value-enhancer";
import { isVal, type ReadonlyVal } from "value-enhancer";
import { getEntries } from "./utils";

interface UseEntries {
  /**
   * Get entries as array from reactive collection.
   * @returns Entries as array from the reactive collection, or undefined if no collection provided.
   */
  <TKey = unknown, TValue = unknown>(): [TKey, TValue][] | undefined;
  /**
   * Get entries as array from reactive collection.
   * @param col A Reactive Collection or a ReadonlyVal of Collection.
   * @returns Entries as array from the reactive collection.
   */
  <TKey, TValue>(
    col:
      | ReadonlyVal<{ entries(): Iterable<[TKey, TValue]> }>
      | { $: ReadonlyVal<{ entries(): Iterable<[TKey, TValue]> }> },
    eagerOrConfig?: boolean | ValConfig<[TKey, TValue][]>
  ): [TKey, TValue][];
  /**
   * Get entries as array from reactive collection.
   * @param col An optional Reactive Collection or a ReadonlyVal of Collection.
   * @returns Entries as array from the reactive collection, or undefined if no collection provided.
   */
  <TKey, TValue>(
    col?:
      | ReadonlyVal<{ entries(): Iterable<[TKey, TValue]> }>
      | { $: ReadonlyVal<{ entries(): Iterable<[TKey, TValue]> }> },
    eagerOrConfig?: boolean | ValConfig<[TKey, TValue][]>
  ): [TKey, TValue][] | undefined;
}

export const useEntries: UseEntries = (<TKey, TValue>(
  col?:
    | ReadonlyVal<{ entries(): Iterable<[TKey, TValue]> }>
    | { $: ReadonlyVal<{ entries(): Iterable<[TKey, TValue]> }> },
  eagerOrConfig?: boolean | ValConfig<[TKey, TValue][]>
): [TKey, TValue][] | undefined =>
  useDerived(
    isVal(col) ? col : col?.$,
    getEntries,
    eagerOrConfig
  )) as UseEntries;
