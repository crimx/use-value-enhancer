import { useDerived } from "./use-derived";
import type { ValConfig } from "value-enhancer";
import { isVal, type ReadonlyVal, arrayShallowEqual } from "value-enhancer";
import { getKeys } from "./utils";

const KEY_CONFIG = { equal: arrayShallowEqual };

interface UseKeys {
  /**
   * Get keys as array from reactive collection.
   * @returns Keys as array from the reactive collection, or undefined if no collection provided.
   */
  <TKey = unknown>(): TKey[] | undefined;
  /**
   * Get keys as array from reactive collection.
   * @param col A Reactive Collection or a ReadonlyVal of Collection.
   * @returns Keys as array from the reactive collection.
   */
  <TKey>(
    col:
      | ReadonlyVal<{ keys(): Iterable<TKey> }>
      | { $: ReadonlyVal<{ keys(): Iterable<TKey> }> },
    eagerOrConfig?: boolean | ValConfig<TKey[]>
  ): TKey[];
  /**
   * Get keys as array from reactive collection.
   * @param col An optional Reactive Collection or a ReadonlyVal of Collection.
   * @returns Keys as array from the reactive collection, or undefined if no collection provided.
   */
  <TKey>(
    col?:
      | ReadonlyVal<{ keys(): Iterable<TKey> }>
      | { $: ReadonlyVal<{ keys(): Iterable<TKey> }> },
    eagerOrConfig?: boolean | ValConfig<TKey[]>
  ): TKey[] | undefined;
}

export const useKeys: UseKeys = (<TKey>(
  col?:
    | ReadonlyVal<{ keys(): Iterable<TKey> }>
    | { $: ReadonlyVal<{ keys(): Iterable<TKey> }> },
  eagerOrConfig: boolean | ValConfig<TKey[]> = KEY_CONFIG
): TKey[] | undefined =>
  useDerived(isVal(col) ? col : col?.$, getKeys, eagerOrConfig)) as UseKeys;
