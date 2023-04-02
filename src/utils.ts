import { useEffect, useLayoutEffect } from "react";

/* c8 ignore next 2 */
export const useIsomorphicLayoutEffect = /* @__PURE__ */ (() =>
  typeof document !== "undefined" ? useLayoutEffect : useEffect)();
