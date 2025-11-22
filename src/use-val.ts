import type { UnwrapVal } from "value-enhancer";
import { type ReadonlyVal } from "value-enhancer";

import reactExports, {
  useDebugValue,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getVal } from "./utils";

interface UseVal {
  /**
   * Accepts a val from anywhere and returns the latest value.
   * It only triggers re-rendering when new value emitted from val (base on val `$version` instead of React's `Object.is` comparison).
   *
   * @param val$ A val of value
   * @param eager Trigger subscription callback synchronously. Default true.
   * @returns the value
   */
  <TValue>(val$: ReadonlyVal<TValue>, eager?: boolean): TValue;

  /**
   * Accepts a val from anywhere and returns the latest value.
   * It only triggers re-rendering when new value emitted from val (base on val `$version` instead of React's `Object.is` comparison).
   *
   * @param val$ A val of value
   * @param eager Trigger subscription callback synchronously. Default true.
   * @returns the value, or undefined if val is undefined
   */
  <TValue = any>(val$?: ReadonlyVal<TValue>, eager?: boolean):
    | TValue
    | undefined;

  /**
   * Returns the value if it is not a val.
   *
   * @param value A non-val value
   * @param eager Trigger subscription callback synchronously. Default true.
   * @returns the value
   */
  <TValue>(value: TValue, eager?: boolean): UnwrapVal<TValue>;

  /**
   * Returns the value if it is not a val.
   *
   * @param value A non-val value
   * @param eager Trigger subscription callback synchronously. Default true.
   * @returns the value
   */
  <TValue>(value?: TValue, eager?: boolean): UnwrapVal<TValue> | undefined;
}

const noop = () => {
  /* noop */
};

const returnsNoop = () => noop;

const defaultArgs = [returnsNoop, returnsNoop as () => any] as const;

/**
 * @internal
 * @ignore
 */
export const useValWithUseSyncExternalStore: UseVal = <TValue>(
  v?: TValue,
  eager = true
): UnwrapVal<TValue> | undefined => {
  const args = useMemo(() => {
    const v$ = getVal(v);
    return (
      v$ &&
      ([
        (onChange: () => void) => v$.subscribe(onChange, eager),
        () => v$.$version,
        v$,
      ] as const)
    );
  }, [v, eager]);

  const [subscriber, getSnapshot, v$] = args ?? defaultArgs;

  const version = reactExports.useSyncExternalStore(
    subscriber,
    getSnapshot,
    // It is safe to use the same value getter for server snapshot since val() can
    // be initialized with a default value.
    getSnapshot
  );

  const value = useMemo(() => (v$ ? v$.get() : v), [version, v$, v]);

  useDebugValue(value);

  return value;
};

/**
 * @internal
 * @ignore
 */
export const useValWithUseEffect: UseVal = <TValue>(
  v?: TValue,
  eager = true
): UnwrapVal<TValue> | undefined => {
  const v$ = useMemo(() => getVal(v), [v]);
  const [version, setVersion] = useState(() => v$?.$version);

  useEffect(() => {
    if (v$) {
      const versionSetter = () => v$.$version;
      return v$.subscribe(() => setVersion(versionSetter), eager);
    }
  }, [v$, eager]);

  const value = useMemo(() => (v$ ? v$.get() : v), [version, v$, v]);

  useDebugValue(value);

  return value;
};

/* c8 ignore start */
export const useVal: UseVal = /* @__PURE__ */ (() =>
  // @ts-expect-error -- useSyncExternalStore is not available in React 16 & 17
  reactExports.useSyncExternalStore
    ? useValWithUseSyncExternalStore
    : useValWithUseEffect)();
/* c8 ignore stop */
