import { type ReadonlyVal } from "value-enhancer";

import { useCallback, useDebugValue } from "react";
import { useSyncExternalStore } from "use-sync-external-store";

type Subscriber = Parameters<typeof useSyncExternalStore>[0];

const noop = () => void 0;

/**
 * Accepts a val from anywhere and returns the latest value.
 * It only triggers re-rendering when new value emitted from val (base on val `equal` not `Object.is` comparison from React `useState`).
 *
 * @param val$ A val of value
 * @param eager Trigger subscription callback synchronously. Default true.
 * @returns the value
 */
export function useVal<TValue = any>(
  val$: ReadonlyVal<TValue>,
  eager?: boolean
): TValue;
/**
 * Accepts a val from anywhere and returns the latest value.
 * It only triggers re-rendering when new value emitted from val (base on val `equal` not `Object.is` comparison from React `useState`).
 *
 * @param val$ A val of value
 * @param eager Trigger subscription callback synchronously. Default true.
 * @returns the value, or undefined if val is undefined
 */
export function useVal<TValue = any>(
  val$?: ReadonlyVal<TValue>,
  eager?: boolean
): TValue | undefined;
export function useVal<TValue = any>(
  val$?: ReadonlyVal<TValue>,
  eager = true
): TValue | undefined {
  const subscriber = useCallback<Subscriber>(
    onStoreChange => {
      if (val$) return val$.subscribe(onStoreChange, eager);
      return noop;
    },
    [val$, eager]
  );

  const valueGetter = val$ ? val$.get : noop;

  const value = useSyncExternalStore(
    subscriber,
    valueGetter,
    // It is safe to use the same value getter for server snapshot since val() can
    // be initialized with a default value.
    valueGetter
  );

  useDebugValue(value);

  return value;
}
