import { useEffect, useLayoutEffect, useState } from "react";

/* c8 ignore next 2 */
export const useIsomorphicLayoutEffect = /* @__PURE__ */ (() =>
  typeof document !== "undefined" ? useLayoutEffect : useEffect)();

const increment = (n: number): number => (n + 1) | 0;

export const useForceUpdate = (): (() => void) => {
  const setState = useState(0)[1];
  return () => setState(increment);
};

export type ColWithKeys<TKey> = { keys(): Iterable<TKey> };

export const getKeys = <TKey>(col: ColWithKeys<TKey>): TKey[] => [
  ...col.keys(),
];

export type ColWithValues<TValue> = { values(): Iterable<TValue> };

export const getValues = <TValue>(col: ColWithValues<TValue>): TValue[] => [
  ...col.values(),
];

export type ColWithEntries<TKey, TValue> = {
  entries(): Iterable<[TKey, TValue]>;
};

export const getEntries = <TKey, TValue>(
  col: ColWithEntries<TKey, TValue>
): [TKey, TValue][] => [...col.entries()];
