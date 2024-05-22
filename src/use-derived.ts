import type { ValConfig } from "value-enhancer";
import {
  type ReadonlyVal,
  type DerivedValTransform,
  derive,
} from "value-enhancer";

import { useTransformValInternal } from "./internal/use-transform";

interface UseDerived {
  /**
   * Accepts a val from anywhere and returns the latest derived value.
   * Re-rendering is triggered when the derived value changes.
   *
   * @param val$ A val of value
   * @param transform A pure function that takes an input value and returns a new value.
   * @param eagerOrConfig `ValConfig` of Val or just the `eager`. Default `true`.
   * @returns the derived value
   */
  <TSrcValue = any, TValue = any>(
    val$: ReadonlyVal<TSrcValue>,
    transform: DerivedValTransform<TSrcValue, TValue>,
    eagerOrConfig?: boolean | ValConfig<TValue>
  ): TValue;
  /**
   * Accepts a val from anywhere and returns the latest derived value.
   * Re-rendering is triggered when the derived value changes.
   *
   * @param val$ A val of value
   * @param transform A pure function that takes an input value and returns a new value.
   * @param eagerOrConfig `ValConfig` of Val or just the `eager`. Default `true`.
   * @returns the derived value, or undefined if val is undefined
   */
  <TSrcValue = any, TValue = any>(
    val$: ReadonlyVal<TSrcValue> | undefined,
    transform: DerivedValTransform<TSrcValue, TValue>,
    eagerOrConfig?: boolean | ValConfig<TValue>
  ): TValue | undefined;
}

export const useDerived: UseDerived = <TSrcValue = any, TValue = any>(
  val$: ReadonlyVal<TSrcValue> | undefined,
  transform: DerivedValTransform<TSrcValue, TValue>,
  eagerOrConfig?: boolean | ValConfig<TValue>
): TValue | undefined =>
  useTransformValInternal<TSrcValue, TValue, TValue>(
    derive,
    val$,
    transform,
    eagerOrConfig
  );
