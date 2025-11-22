import { useEffect, useLayoutEffect } from "react";
import { isVal, type ReadonlyVal } from "value-enhancer";

/* c8 ignore next 2 */
export const useIsomorphicLayoutEffect = /* @__PURE__ */ (() =>
  typeof document !== "undefined" ? useLayoutEffect : useEffect)();

export const getKeys = <TKey>(col: { keys(): Iterable<TKey> }): TKey[] => [
  ...col.keys(),
];

export const getValues = <TValue>(col: {
  values(): Iterable<TValue>;
}): TValue[] => [...col.values()];

export const getEntries = <TKey, TValue>(col: {
  entries(): Iterable<[TKey, TValue]>;
}): [TKey, TValue][] => [...col.entries()];

export const getVal = <T = any>(
  $: ReadonlyVal<T> | { $: ReadonlyVal<T> } | any
): ReadonlyVal<T> | undefined => (isVal($) ? $ : isVal($?.$) ? $.$ : undefined);
