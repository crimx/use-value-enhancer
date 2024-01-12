import { useEffect, useLayoutEffect, useState } from "react";

/* c8 ignore next 2 */
export const useIsomorphicLayoutEffect = /* @__PURE__ */ (() =>
  typeof document !== "undefined" ? useLayoutEffect : useEffect)();

const increment = (n: number): number => (n + 1) | 0;

export const useForceUpdate = (): (() => void) => {
  const setState = useState(0)[1];
  return () => setState(increment);
};

export const getKeys = <TKey, TValue>(
  col: Map<TKey, TValue> | Set<TKey> | ReadonlyArray<TValue>
): (number | TKey)[] => [...col.keys()];

export const getValues = <TKey, TValue>(
  col: Map<TKey, TValue> | Set<TValue> | ReadonlyArray<TValue>
): TValue[] => [...col.values()];
