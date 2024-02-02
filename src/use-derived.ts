import {
  type ReadonlyVal,
  type DerivedValTransform,
  isVal,
} from "value-enhancer";

import { useDebugValue, useEffect, useRef, useState } from "react";
import { useIsomorphicLayoutEffect } from "./utils";

/**
 * Accepts a val from anywhere and returns the latest derived value.
 * Re-rendering is triggered when the derived value changes (`Object.is` comparison from React `useState`).
 *
 * @param val$ A val of value
 * @param transform A pure function that takes an input value and returns a new value.
 * @param eager Trigger subscription callback synchronously. Default false.
 * @returns the derived value
 */
export function useDerived<TSrcValue = any, TValue = any>(
  val$: ReadonlyVal<TSrcValue>,
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
  val$: ReadonlyVal<TSrcValue> | undefined,
  transform: DerivedValTransform<TSrcValue, TValue>,
  eager?: boolean
): TValue | undefined;
export function useDerived<TSrcValue = any, TValue = any>(
  val$: ReadonlyVal<TSrcValue> | undefined,
  transform: DerivedValTransform<TSrcValue, TValue>,
  eager?: boolean
): TValue | undefined {
  const [value, setValue] = useState(() =>
    isVal(val$) ? transform(val$.value) : void 0
  );
  const transformRef = useRef(transform);
  // track last src value after value is set
  const lastSrcValueRef = useRef(val$?.value);

  useIsomorphicLayoutEffect(() => {
    // keep track of the latest `transform` before entering
    // `useEffect` stage to avoid stale value due to async update
    transformRef.current = transform;
  }, [transform]);

  useEffect(() => {
    if (val$) {
      const initialSrcValue = lastSrcValueRef.current;

      const valuePairUpdater = () =>
        transformRef.current((lastSrcValueRef.current = val$.value));

      // first subscribe to trigger derive dirty cache
      const disposer = val$.reaction(() => setValue(valuePairUpdater), eager);

      // check stale value due to async update
      if (!Object.is(val$.value, initialSrcValue)) {
        setValue(valuePairUpdater);
      }

      return disposer;
    } else {
      setValue((lastSrcValueRef.current = void 0));
    }
  }, [val$, eager]);

  useDebugValue(value);

  return value;
}
