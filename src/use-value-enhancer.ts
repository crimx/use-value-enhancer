import { useEffect, useState } from "react";
import type { ReadonlyVal } from "value-enhancer";

export function useVal<TValue = any>(
  val: ReadonlyVal<TValue>,
  eager = false
): TValue {
  const [value, setValue] = useState(() => val.value);
  useEffect(() => val.subscribe(setValue, eager), [val]);
  return value;
}

export const useValueEnhancer = useVal;
