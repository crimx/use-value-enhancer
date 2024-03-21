import { strictEqual, type ReadonlyVal } from "value-enhancer";

import { useDebugValue, useEffect, useRef, useState } from "react";
import { useForceUpdate } from "./utils";

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
  const [value, setValue] = useState(val$ ? val$.get : void 0);
  const lastVersionRef = useRef(val$?.$version);
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    if (val$) {
      const valueSetter = () => {
        lastVersionRef.current = val$.$version;
        return val$.get();
      };

      // first subscribe to trigger derive dirty cache
      const disposer = val$.reaction(() => {
        setValue(valueSetter);
        // re-rendering is triggered based on val reaction not from React `useState`
        forceUpdate();
      }, eager);

      // check stale value due to async update
      if (!strictEqual(val$.$version, lastVersionRef.current)) {
        setValue(valueSetter);
      }

      return disposer;
    } else {
      lastVersionRef.current = Symbol();
      setValue(void 0);
    }
  }, [val$, eager]);

  useDebugValue(value);

  return value;
}
