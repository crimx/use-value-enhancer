import type { ReadonlyVal } from "value-enhancer";

import { useDebugValue, useEffect, useState } from "react";

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
  const [value, setValue] = useState(val?.get);

  useEffect(() => val?.subscribe(() => setValue(val.get), eager), [val, eager]);

  useDebugValue(value);

  return value;
}
