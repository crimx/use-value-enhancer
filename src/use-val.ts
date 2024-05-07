import { type ReadonlyVal } from "value-enhancer";

import reactExports, {
  useCallback,
  useDebugValue,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
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
/**
 * The snapshot that holds both the real value and the version of the reactive value.
 */
type ValueSnapshot<TValue> = Readonly<[value: TValue, $version: any]>;

const noop = () => void 0;

// useValWithUseSyncExternalStore's implementation is heavily inspired by the
// useSyncExternalStoreWithSelector from the React Team.
//
// https://github.com/facebook/react/blob/0fc9c84e63622026b5977557900c9cfe204552d3/packages/use-sync-external-store/src/useSyncExternalStoreWithSelector.js#L19
//
// Differences:
// - we store [value, $version] instead of full store as snapshot
// - we compare both value and $version instead of custom isEqual function
// - we always use value instead of custom selector
const useValWithUseSyncExternalStore: UseVal = <TValue>(
  val$?: ReadonlyVal<TValue>,
  eager = true
): TValue | undefined => {
  const subscriber = useCallback<Subscriber>(
    onStoreChange => {
      if (val$) return val$.subscribe(onStoreChange, eager);
      return noop;
    },
    [val$, eager]
  );

  const isEqual = (
    prevSnapshot: ValueSnapshot<TValue>,
    nextSnapshot: ValueSnapshot<TValue>
  ) => {
    const prevValue = prevSnapshot[0];
    const nextValue = nextSnapshot[0];

    const prevVersion = prevSnapshot[1];
    const nextVersion = nextSnapshot[1];

    return (
      Object.is(prevVersion, nextVersion) && Object.is(prevValue, nextValue)
    );
  };

  /**
   * Track the memoized state using closure variables that are local to this
   * instance of the useMemo hook.
   *
   * Intentionally not using a useRef hook to track the previously rendered state,
   * because the ref would be shared across all concurrent copies of the hook/component,
   * but the useMemo
   *
   * The same approach is also used by the React's official useSyncExternalStoreWithSelector
   */
  const getSnapshot = useMemo(() => {
    const valueGetter: () => ValueSnapshot<TValue> | undefined = val$
      ? () => [val$.get(), val$.$version]
      : noop;

    let memoizedSnapshot: ValueSnapshot<TValue> | undefined = void 0;

    const memoizedSelector = (
      nextSnapshot: ValueSnapshot<TValue> | undefined
    ) => {
      if (nextSnapshot === void 0) {
        // The nextSnapshot can only be undefined if the $val is missing (valueGetter is noop)
        // let's clear internal memoized state and return undefined
        memoizedSnapshot = void 0;
        return void 0;
      }

      if (memoizedSnapshot === void 0) {
        /**
         * If the previous snapshot is undefined but next snapshot is not,
         * it means that either this is the first time the hook is called,
         * or previously no $val is given, but now it is.
         *
         * So we need to signal to React that the value has changed and a re-render
         * should be scheduled.
         */
        memoizedSnapshot = nextSnapshot;
        return /** nextValue */ nextSnapshot[0];
      }

      /**
       * Previously $val is already given and its snapshot is stored,
       * now the
       */

      // Only if both the version and the value are the same, we can bail out
      // the re-render.
      // We bail out the re-render by returning the previous value, which signals
      // to React that the value are conceptually equal
      if (isEqual(memoizedSnapshot, nextSnapshot)) {
        return /** prevValue */ memoizedSnapshot[0];
      }

      // If either the version or the value has changed, we update the stored
      // the current snapshot for the next invocation and comparison
      memoizedSnapshot = nextSnapshot;

      // We return the next value to signal to React that the value has changed
      // and a re-render should be scheduled
      const nextValue = nextSnapshot[0];

      return nextValue;
    };

    return () => memoizedSelector(valueGetter());
  }, [val$]);

  const value = useSyncExternalStore(
    subscriber,
    getSnapshot,
    // It is safe to use the same value getter for server snapshot since val() can
    // be initialized with a default value.
    getSnapshot
  );

  useDebugValue(value);

  return value;
};

const useValWithUseEffect: UseVal = <TValue>(
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

// @ts-expect-error -- useSyncExternalStore is not available in React 16 & 17
export const useVal: UseVal = reactExports.useSyncExternalStore
  ? useValWithUseSyncExternalStore
  : useValWithUseEffect;
