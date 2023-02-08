import { useEffect, useMemo, useState } from "react";
import type { ReadonlyVal } from "value-enhancer";

export function useVal<TValue = any>(
  val: ReadonlyVal<TValue>,
  eager = false
): TValue {
  // val could have custom compare function, so we need to use a state to trigger re-rendering
  const [updateId, updater] = useState(0);
  // Only access value getter when updateId changes to avoid frequent getter calls
  const value = useMemo(() => val.value, [updateId]);
  useEffect(() => {
    let isFirst = true;
    return val.subscribe(newValue => {
      if (isFirst) {
        isFirst = false;
        // useEffect is called asynchronously so we need to check again
        if (val.compare(newValue, value)) {
          return;
        }
      }
      updater(updateId => (updateId + 1) % 4294967296);
    }, eager);
  }, [val]);
  return value;
}

export const useValueEnhancer = useVal;
