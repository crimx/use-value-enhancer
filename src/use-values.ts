import type {
  ReactiveList,
  ReactiveMap,
  ReactiveSet,
} from "value-enhancer/collections";
import { useDerived } from "./use-derived";
import { isVal, type ReadonlyVal } from "value-enhancer";
import { getValues } from "./utils";

/**
 * Get values as array from reactive collection.
 * @returns values as array from the reactive collection, or undefined if no collection provided.
 */
export function useValues<TValue = unknown>(): TValue[] | undefined;
/**
 * Get values as array from reactive collection.
 * @returns values as array from the reactive collection.
 */
export function useValues<TValue>(
  col:
    | ReactiveMap<any, TValue>
    | ReactiveSet<TValue>
    | ReactiveList<TValue>
    | ReadonlyVal<ReactiveMap<any, TValue>>
    | ReadonlyVal<ReactiveSet<TValue>>
    | ReadonlyVal<ReadonlyArray<TValue>>
): TValue[];
/**
 * Get values as array from reactive collection.
 * @returns values as array from the reactive collection, or undefined if no collection provided.
 */
export function useValues<TValue>(
  col?:
    | ReactiveMap<any, TValue>
    | ReactiveSet<TValue>
    | ReactiveList<TValue>
    | ReadonlyVal<ReactiveMap<any, TValue>>
    | ReadonlyVal<ReactiveSet<TValue>>
    | ReadonlyVal<ReadonlyArray<TValue>>
): TValue[] | undefined;
export function useValues<TValue>(
  col?:
    | ReactiveMap<any, TValue>
    | ReactiveSet<TValue>
    | ReactiveList<TValue>
    | ReadonlyVal<ReactiveMap<any, TValue>>
    | ReadonlyVal<ReactiveSet<TValue>>
    | ReadonlyVal<ReadonlyArray<TValue>>
): TValue[] | undefined {
  return useDerived(
    (isVal(col) ? col : col?.$) as ReadonlyVal<
      ReactiveMap<any, TValue> | ReactiveSet<TValue> | ReadonlyArray<TValue>
    >,
    getValues
  );
}
