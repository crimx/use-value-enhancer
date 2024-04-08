import { useDerived } from "./use-derived";
import { type ReadonlyVal, type ValConfig, isVal } from "value-enhancer";
import type { ColWithValues } from "./utils";
import { getValues } from "./utils";

type MaybeColWithValues$<TValue> =
  | ReadonlyVal<ColWithValues<TValue>>
  | { $: ReadonlyVal<ColWithValues<TValue>> };

/**
 * Get values as array from reactive collection.
 * @returns Values as array from the reactive collection, or undefined if no collection provided.
 */
export function useValues<TValue = unknown>(): TValue[] | undefined;
/**
 * Get values as array from reactive collection.
 * @param col A Reactive Collection or a ReadonlyVal of Collection.
 * @param eagerOrConfig `ValConfig` of Val or just the `eager`. Default `true`.
 * @returns Values as array from the reactive collection.
 */
export function useValues<TValue>(
  col: MaybeColWithValues$<TValue>,
  eagerOrConfig?: boolean | ValConfig<TValue[]>
): TValue[];
/**
 * Get `values` as array from reactive collection.
 * @param col An optional Reactive Collection or a ReadonlyVal of Collection.
 * @param eagerOrConfig `ValConfig` of Val or just the `eager`. Default `true`.
 * @returns Values as array from the reactive collection, or undefined if no collection provided.
 */
export function useValues<TValue>(
  col?: MaybeColWithValues$<TValue>,
  eagerOrConfig?: boolean | ValConfig<TValue[]>
): TValue[] | undefined;
export function useValues<TValue>(
  col?: MaybeColWithValues$<TValue>,
  eagerOrConfig?: boolean | ValConfig<TValue[]>
): TValue[] | undefined {
  return useDerived(isVal(col) ? col : col?.$, getValues, eagerOrConfig);
}
