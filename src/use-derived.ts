import type { ReadonlyVal, DerivedValTransform } from "value-enhancer";

import { useEffect, useRef, useState } from "react";
import { useIsomorphicLayoutEffect } from "./utils";

/**
 * Accepts a val from anywhere and returns the latest derived value.
 * Re-rendering is triggered when the derived value changes (`Object.is` comparison from React `useState`).
 *
 * @param val A val of value
 * @param transform A pure function that takes an input value and returns a new value.
 * @param eager Trigger subscription callback synchronously. Default false.
 * @returns the derived value
 */
export function useDerived<TSrcValue = any, TValue = any>(
  val: ReadonlyVal<TSrcValue>,
  transform: DerivedValTransform<TSrcValue, TValue>,
  eager?: boolean
): TValue;
/**
 * Accepts a val from anywhere and returns the latest derived value.
 * Re-rendering is triggered when the derived value changes (`Object.is` comparison from React `useState`).
 *
 * @param val A val of value
 * @param transform A pure function that takes an input value and returns a new value.
 * @param eager Trigger subscription callback synchronously. Default false.
 * @returns the derived value, or undefined if val is undefined
 */
export function useDerived<TSrcValue = any, TValue = any>(
  val: ReadonlyVal<TSrcValue> | undefined,
  transform: DerivedValTransform<TSrcValue, TValue>,
  eager?: boolean
): TValue | undefined;
export function useDerived<TSrcValue = any, TValue = any>(
  val: ReadonlyVal<TSrcValue> | undefined,
  transform: DerivedValTransform<TSrcValue, TValue>,
  eager?: boolean
): TValue | undefined {
  const [result, setResult] = useState(() => val && transform(val.value));
  const transformRef = useRef(transform);

  useIsomorphicLayoutEffect(() => {
    transformRef.current = transform;
  });

  useEffect(
    () => val?.subscribe(value => setResult(() => transformRef.current(value))),
    [val, eager]
  );

  return result;
}
