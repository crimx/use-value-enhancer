import { useDerived } from "./use-derived";
import { type ReadonlyVal, type ValConfig, isVal } from "value-enhancer";
import { getValues } from "./utils";

interface UseValues {
  /**
   * Get values as array from reactive collection.
   * @returns Values as array from the reactive collection, or undefined if no collection provided.
   */
  <TValue = unknown>(): TValue[] | undefined;
  /**
   * Get values as array from reactive collection.
   * @param col A Reactive Collection or a ReadonlyVal of Collection.
   * @param eagerOrConfig `ValConfig` of Val or just the `eager`. Default `true`.
   * @returns Values as array from the reactive collection.
   */
  <TValue>(
    col:
      | ReadonlyVal<{ values(): Iterable<TValue> }>
      | { $: ReadonlyVal<{ values(): Iterable<TValue> }> },
    eagerOrConfig?: boolean | ValConfig<TValue[]>
  ): TValue[];
  /**
   * Get `values` as array from reactive collection.
   * @param col An optional Reactive Collection or a ReadonlyVal of Collection.
   * @param eagerOrConfig `ValConfig` of Val or just the `eager`. Default `true`.
   * @returns Values as array from the reactive collection, or undefined if no collection provided.
   */
  <TValue>(
    col?:
      | ReadonlyVal<{ values(): Iterable<TValue> }>
      | { $: ReadonlyVal<{ values(): Iterable<TValue> }> },
    eagerOrConfig?: boolean | ValConfig<TValue[]>
  ): TValue[] | undefined;
}

export const useValues: UseValues = (<TValue>(
  col?:
    | ReadonlyVal<{ values(): Iterable<TValue> }>
    | { $: ReadonlyVal<{ values(): Iterable<TValue> }> },
  eagerOrConfig?: boolean | ValConfig<TValue[]>
): TValue[] | undefined =>
  useDerived(isVal(col) ? col : col?.$, getValues, eagerOrConfig)) as UseValues;
