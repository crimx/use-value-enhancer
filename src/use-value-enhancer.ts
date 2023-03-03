import { useEffect, useMemo, useState } from "react";
import type { ReadonlyVal } from "value-enhancer";

const increase = (updateId: number): number => (updateId + 1) % 4294967296;

/**
 * @param val A val of value
 * @param eager Trigger subscription callback synchronously. Default true.
 * @returns the value
 */
export function useVal<TValue = any>(
  val: ReadonlyVal<TValue>,
  eager?: boolean
): TValue;
/**
 * @param val A val of value
 * @param eager Trigger subscription callback synchronously. Default true.
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
  return value;
}

export const useValueEnhancer = useVal;
