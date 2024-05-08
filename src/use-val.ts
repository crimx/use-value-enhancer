import { type ReadonlyVal } from "value-enhancer";

import reactExports, {
  useCallback,
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
}

// Utility types and functions for useValWithUseSyncExternalStore

/**
 * The subscriber function that is passed to useSyncExternalStore hook.
 */
type Subscriber = Parameters<(typeof reactExports)["useSyncExternalStore"]>[0];

// useValWithUseSyncExternalStore's implementation is heavily inspired by the
// useSyncExternalStoreWithSelector from the React Team.
//
// https://github.com/facebook/react/blob/0fc9c84e63622026b5977557900c9cfe204552d3/packages/use-sync-external-store/src/useSyncExternalStoreWithSelector.js#L19
//
// Differences:
// - we store [value, $version] instead of full store as snapshot
// - we compare both value and $version instead of custom isEqual function
// - we always use value instead of custom selector
export const useValWithUseSyncExternalStore: UseVal = <TValue>(
  val$?: ReadonlyVal<TValue>,
  eager = true
): TValue | undefined => {
  const [subscriber, getSnapshot] = useMemo(
    () =>
      [
        (onStoreChange => val$?.subscribe(onStoreChange, eager)) as Subscriber,
        () => val$?.$version,
      ] as const,
    [val$, eager]
  );

  reactExports.useSyncExternalStore(
    subscriber,
    getSnapshot,
    // It is safe to use the same value getter for server snapshot since val() can
    // be initialized with a default value.
    getSnapshot
  );

  useDebugValue(val$?.value);

  return val$?.value;
};

export const useValWithUseEffect: UseVal = <TValue>(
  val$?: ReadonlyVal<TValue>,
  eager = true
): TValue | undefined => {
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
};

/* c8 ignore start */
export const useVal: UseVal = /* @__PURE__ */ (() =>
  // @ts-expect-error -- useSyncExternalStore is not available in React 16 & 17
  reactExports.useSyncExternalStore
    ? useValWithUseSyncExternalStore
    : useValWithUseEffect)();
/* c8 ignore stop */
