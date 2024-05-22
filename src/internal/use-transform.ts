import { useRef, useMemo, useDebugValue } from "react";
import type { ReadonlyVal, ValConfig } from "value-enhancer";
import { identity } from "value-enhancer";
import { useVal } from "../use-val";
import { useIsomorphicLayoutEffect } from "../utils";

export const useTransformValInternal = <
  TSrcValue = any,
  TGetResult = any,
  TTarget = any
>(
  method: (
    val: ReadonlyVal<TSrcValue>,
    get: (value: TSrcValue) => TGetResult,
    config?: ValConfig<TTarget>
  ) => ReadonlyVal<TTarget>,
  val$?: ReadonlyVal<TSrcValue>,
  get = identity as (value: TSrcValue) => TGetResult,
  eagerOrConfig: boolean | ValConfig<TTarget> = true
): TTarget | undefined => {
  let equal: ValConfig<TTarget>["equal"];
  let eager: ValConfig<TTarget>["eager"];

  if (eagerOrConfig === true || eagerOrConfig === false) {
    eager = eagerOrConfig;
  } else if (eagerOrConfig) {
    ({ eager, equal } = eagerOrConfig);
  }

  const equalRef = useRef(equal);
  const transformRef = useRef(get);

  const derived$ = useMemo(
    () =>
      val$ &&
      method(val$, value => transformRef.current(value), {
        equal: (value1, value2) =>
          equalRef.current === false
            ? false
            : (equalRef.current || Object.is)(value1, value2),
      }),
    [val$]
  );

  useIsomorphicLayoutEffect(() => {
    equalRef.current = equal;
    transformRef.current = get;
  }, [equalRef, transformRef]);

  const value = useVal(derived$, eager);

  useDebugValue(value);

  return value;
};
