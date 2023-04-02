import { useDebugValue, useEffect, useMemo, useState } from "react";
import type { ReadonlyVal } from "value-enhancer";

const increase = (updateId: number): number => (updateId + 1) | 0;

/**
 * Accepts a val from anywhere and returns the latest value.
 * It only triggers re-rendering when new value emitted from val (base on `val.compare` not `Object.is` comparison from React `useState`).
 *
 * @param val A val of value
 * @param eager Trigger subscription callback synchronously. Default false.
 * @returns the value
 */
export function useVal<TValue = any>(
  val: ReadonlyVal<TValue>,
  eager?: boolean
): TValue;
/**
 * Accepts a val from anywhere and returns the latest value.
 * It only triggers re-rendering when new value emitted from val (base on `val.compare` not `Object.is` comparison from React `useState`).
 *
 * @param val A val of value
 * @param eager Trigger subscription callback synchronously. Default false.
 * @returns the value, or undefined if val is undefined
 */
export function useVal<TValue = any>(
  val?: ReadonlyVal<TValue>,
  eager?: boolean
): TValue | undefined;
export function useVal<TValue = any>(
  val?: ReadonlyVal<TValue>,
  eager?: boolean
): TValue | undefined {
  // val could have custom compare function, so we need to use a state to trigger re-rendering
  const [updateId, updater] = useState(0);

  // Only access value getter when updateId changes to avoid frequent getter calls
  const value = useMemo(() => val && val.value, [updateId]);

  useEffect(() => {
    if (val) {
      const rerender = () => updater(increase);
      if (!val.compare(val.value, value as TValue)) {
        // useEffect is called asynchronously so we need to check again
        rerender();
      }
      return val.reaction(rerender, eager);
    }
  }, [val, eager]);

  useDebugValue(value);

  return value;
}

export const useValueEnhancer = useVal;
