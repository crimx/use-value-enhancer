import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { val } from "value-enhancer";
import { useVal, useValueEnhancer } from "../src/index";

describe("useVal", () => {
  it("should get value from val", () => {
    const val$ = val(1);
    const { result } = renderHook(() => useVal(val$));

    expect(result.current).toBe(1);
  });

  it("should update after value changes", async () => {
    const val$ = val("a");
    const { result } = renderHook(() => useVal(val$));

    expect(result.current).toBe("a");

    await act(async () => val$.set("b"));

    expect(result.current).toBe("b");
  });

  it("should support function as value", async () => {
    const val$ = val((): boolean => true);
    const { result } = renderHook(() => useVal(val$));

    expect(result.current).toBe(val$.value);

    const fn = result.current;

    await act(async () => val$.set(() => false));

    expect(result.current).toBe(val$.value);
    expect(result.current).not.toBe(fn);
  });

  it("should export useValueEnhancer alias", () => {
    expect(useValueEnhancer).toBe(useVal);
  });
});
