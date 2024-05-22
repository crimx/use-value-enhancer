import type { UnwrapVal, ValConfig } from "value-enhancer";
import { type ReadonlyVal, identity, flatten } from "value-enhancer";

import { useTransformValInternal } from "./internal/use-transform";

interface UseFlatten {
  /**
   * Accepts a val from anywhere and returns the latest value of the flatten val.
   * Re-rendering is triggered when the derived value changes.
   *
   * @param val$ A val of val.
   * @returns the value of the flatten val.
   */
  <TValOrValue = any>(val$: ReadonlyVal<TValOrValue>): UnwrapVal<TValOrValue>;
  /**
   * Accepts a val from anywhere and returns the latest value of the flatten val.
   * Re-rendering is triggered when the derived value changes.
   *
   * @param val$ A val of val.
   * @returns the value of the flatten val.
   */
  <TValOrValue = any>(val$?: ReadonlyVal<TValOrValue>):
    | UnwrapVal<TValOrValue>
    | undefined;
  /**
   * Accepts a val from anywhere and returns the latest value of the flatten val.
   * Re-rendering is triggered when the derived value changes.
   *
   * @param val$ A val of val.
   * @param get A pure function that gets the inner from `val$`.
   * @param eagerOrConfig `ValConfig` of Val or just the `eager`. Default `true`.
   * @returns the value of the flatten val.
   */
  <TSrcValue = any, TValOrValue = any>(
    val$: ReadonlyVal<TSrcValue>,
    get: (value: TSrcValue) => TValOrValue,
    eagerOrConfig?: boolean | ValConfig<UnwrapVal<TValOrValue>>
  ): UnwrapVal<TValOrValue>;
  /**
   * Accepts a val from anywhere and returns the latest value of the flatten val.
   * Re-rendering is triggered when the derived value changes.
   *
   * @param val$ A val of val.
   * @param get A pure function that gets the inner from `val$`.
   * @param eagerOrConfig `ValConfig` of Val or just the `eager`. Default `true`.
   * @returns the value of the flatten `val$`, or undefined if val is undefined.
   */
  <TSrcValue = any, TValOrValue = any>(
    val$: ReadonlyVal<TSrcValue> | undefined,
    get: (value: TSrcValue) => TValOrValue,
    eagerOrConfig?: boolean | ValConfig<UnwrapVal<TValOrValue>>
  ): UnwrapVal<TValOrValue> | undefined;
}

export const useFlatten: UseFlatten = <TSrcValue = any, TValOrValue = any>(
  val$?: ReadonlyVal<TSrcValue>,
  get = identity as (value: TSrcValue) => TValOrValue,
  eagerOrConfig?: boolean | ValConfig<UnwrapVal<TValOrValue>>
): UnwrapVal<TValOrValue> | undefined =>
  useTransformValInternal<TSrcValue, TValOrValue, UnwrapVal<TValOrValue>>(
    flatten,
    val$,
    get,
    eagerOrConfig
  );
