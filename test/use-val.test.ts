import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { derive, val, nextTick } from "value-enhancer";
import { useVal } from "../src/index";
import type { ReactiveMap } from "value-enhancer/collections";
import { reactiveMap } from "value-enhancer/collections";

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

  it("should get correct value after val$ changes", async () => {
    it("val$ -> undefined", () => {
      const val$ = val(1);
      const { result: result1 } = renderHook(() => useVal(val$));
      expect(result1.current).toBe(1);

      const { result: result2 } = renderHook(() => useVal());
      expect(result2.current).toBeUndefined();
    });

    it("undefined -> val$", () => {
      const { result: result1 } = renderHook(() => useVal());
      expect(result1.current).toBeUndefined;

      const val$ = val(1);
      const { result: result2 } = renderHook(() => useVal(val$));
      expect(result2.current).toBe(1);
    });
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

    await nextTick();

    expect(renderingCount).toBe(1);

    await act(async () => val$.set(2));

    expect(result.current).toBe(2);

    expect(renderingCount).toBe(2);
  });

  it("should not trigger extra rendering on same value", async () => {
    const val$ = val({ a: 1 }, { equal: (a, b) => a.a === b.a });
    let renderingCount = 0;
    const { result } = renderHook(() => {
      renderingCount += 1;
      return useVal(val$);
    });

    await act(async () => val$.set({ a: 1 }));
    await act(async () => val$.set({ a: 1 }));
    await act(async () => val$.set({ a: 1 }));

    expect(result.current).toEqual({ a: 1 });

    await nextTick();

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

    await nextTick();

    expect(renderingCount).toBe(2);
  });

  it("should trigger transform only once", async () => {
    const map = reactiveMap<string, number>();
    map.set("foo", 1);

    const mockTransform = vi.fn(
      (map: ReactiveMap<string, number>) => new Set(map.values())
    );
    const derived$ = derive(map.$, mockTransform);

    await nextTick();

    expect(mockTransform).toHaveBeenCalledTimes(0);

    renderHook(() => useVal(derived$));

    renderHook(() => useVal(derived$));

    const spy1 = vi.fn();
    derived$.subscribe(spy1);

    await nextTick();

    const spy2 = vi.fn();
    derived$.subscribe(spy2);

    await nextTick();

    const spy3 = vi.fn();
    derived$.subscribe(spy3);

    await nextTick();

    expect(mockTransform).toHaveBeenCalledTimes(1);

    derived$.dispose();
    map.dispose();
  });
});
