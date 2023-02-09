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

  it("should return undefined if no val provided", () => {
    const { result } = renderHook(() => useVal());

    expect(result.current).toBeUndefined();
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

  it("should not trigger extra rendering on initial value", async () => {
    const val$ = val(1);
    let renderingCount = 0;
    const { result } = renderHook(() => {
      renderingCount += 1;
      return useVal(val$);
    });

    await act(async () => val$.set(1));
    await act(async () => val$.set(1));
    await act(async () => val$.set(1));

    expect(result.current).toBe(1);

    await new Promise(resolve => setTimeout(resolve, 0));

    expect(renderingCount).toBe(1);

    await act(async () => val$.set(2));

    expect(result.current).toBe(2);

    expect(renderingCount).toBe(2);
  });

  it("should not trigger extra rendering on same value", async () => {
    const val$ = val({ a: 1 }, { compare: (a, b) => a.a === b.a });
    let renderingCount = 0;
    const { result } = renderHook(() => {
      renderingCount += 1;
      return useVal(val$);
    });

    await act(async () => val$.set({ a: 1 }));
    await act(async () => val$.set({ a: 1 }));
    await act(async () => val$.set({ a: 1 }));

    expect(result.current).toEqual({ a: 1 });

    await new Promise(resolve => setTimeout(resolve, 0));

    expect(renderingCount).toBe(1);

    await act(async () => val$.set({ a: 2 }));

    expect(result.current).toEqual({ a: 2 });

    expect(renderingCount).toBe(2);
  });

  it("should trigger extra rendering if value changes before initial rendering", async () => {
    const val$ = val(1);
    let renderingCount = 0;
    const { result } = renderHook(() => {
      renderingCount += 1;
      const value = useVal(val$, true);
      val$.set(2);
      return value;
    });

    expect(result.current).toBe(2);

    await new Promise(resolve => setTimeout(resolve, 0));

    expect(renderingCount).toBe(2);
  });
});
