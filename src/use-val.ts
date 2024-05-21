import type { UnwrapVal } from "value-enhancer";
import { isVal, type ReadonlyVal } from "value-enhancer";

import reactExports, {
  useDebugValue,
  useEffect,
  useMemo,
  useState,
} from "react";

// Function overload with TypeScript interface
interface UseVal {
  /**
   * Accepts a val from anywhere and returns the latest value.
   * It only triggers re-rendering when new value emitted from val (base on val `equal` not `Object.is` comparison from React `useState`).
   *
   * @param val$ A val of value
   * @param eager Trigger subscription callback synchronously. Default true.
   * @returns the value
   */
  <TValue>(val$: ReadonlyVal<TValue>, eager?: boolean): TValue;

  /**
   * Accepts a val from anywhere and returns the latest value.
   * It only triggers re-rendering when new value emitted from val (base on val `equal` not `Object.is` comparison from React `useState`).
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

// Utility types and functions for useValWithUseSyncExternalStore

/**
 * The subscriber function that is passed to useSyncExternalStore hook.
 */
type Subscriber = Parameters<(typeof reactExports)["useSyncExternalStore"]>[0];

const noop = () => {
  /* noop */
};

const noopSubscriber: Subscriber = () => noop;

export const useValWithUseSyncExternalStore: UseVal = <TValue>(
  val$?: TValue,
  eager = true
): UnwrapVal<TValue> | undefined => {
  const [subscriber, getSnapshot] = useMemo(
    () =>
      isVal(val$)
        ? ([
            (onChange: () => void) => val$.subscribe(onChange, eager),
            () => val$.$version,
          ] as const)
        : ([noopSubscriber, noop] as const),
    [val$, eager]
  );

  reactExports.useSyncExternalStore(
    subscriber,
    getSnapshot,
    // It is safe to use the same value getter for server snapshot since val() can
    // be initialized with a default value.
    getSnapshot
  );

  const value = isVal(val$) ? val$.get() : val$;

  useDebugValue(value);

  return value;
};

export const useValWithUseEffect: UseVal = <TValue>(
  val$?: TValue,
  eager = true
): UnwrapVal<TValue> | undefined => {
  const [, setVersion] = useState(() => (isVal(val$) ? val$.$version : val$));

  useEffect(() => {
    if (isVal(val$)) {
      const versionSetter = () => val$.$version;
      return val$.subscribe(() => setVersion(versionSetter), eager);
    }

    setVersion(noop);
  }, [val$, eager]);

  const value = isVal(val$) ? val$.get() : val$;

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
