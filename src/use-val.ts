import { type ReadonlyVal } from "value-enhancer";

import { useDebugValue, useEffect, useState } from "react";

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
  const [, setVersion] = useState(val$?.$version);

  useEffect(() => {
    if (val$) {
      const versionSetter = () => val$.$version;
      const updateValue = () => {
        setVersion(versionSetter);
        setValue(val$.get);
      };
      return val$.subscribe(updateValue, eager);
    } else {
      setVersion(void 0);
      setValue(void 0);
    }
  }, [val$, eager]);

  useDebugValue(value);

  return value;
}
