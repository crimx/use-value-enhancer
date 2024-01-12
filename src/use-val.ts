import type { ReadonlyVal } from "value-enhancer";

import { useDebugValue, useEffect, useState } from "react";
import { useForceUpdate } from "./utils";

/**
 * Accepts a val from anywhere and returns the latest value.
 * It only triggers re-rendering when new value emitted from val (base on val `equal` not `Object.is` comparison from React `useState`).
 *
 * @param val$ A val of value
 * @param eager Trigger subscription callback synchronously. Default false.
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
 * @param eager Trigger subscription callback synchronously. Default false.
 * @returns the value, or undefined if val is undefined
 */
export function useVal<TValue = any>(
  val$?: ReadonlyVal<TValue>,
  eager?: boolean
): TValue | undefined;
export function useVal<TValue = any>(
  val$?: ReadonlyVal<TValue>,
  eager?: boolean
): TValue | undefined {
  const [value, setValue] = useState(val$ ? val$.get : void 0);
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    if (val$) {
      // check stale value due to async update
      if (val$.value !== value) {
        setValue(val$.get);
      }
      return val$.reaction(() => {
        setValue(val$.get);
        // re-rendering is triggered based on val reaction not from React `useState`
        forceUpdate();
      }, eager);
    } else {
      setValue(void 0);
    }
  }, [val$, eager]);

  useDebugValue(value);

  return value;
}
