import { useEffect, useState } from "react";
import type { ReadonlyVal } from "value-enhancer";

export function useVal<TValue = any, TMeta = any>(
  val: ReadonlyVal<TValue, TMeta>
): TValue {
  const [value, setValue] = useState(val.value);
  useEffect(() => val.subscribe(setValue), [val]);
  return value;
}

export const useValueEnhancer = useVal;
