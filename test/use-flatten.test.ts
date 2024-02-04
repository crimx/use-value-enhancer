import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import type { Val } from "value-enhancer";
import { nextTick, val } from "value-enhancer";
import { ReactiveMap } from "value-enhancer/collections";
import { useFlatten } from "../src/index";

describe("useFlatten", () => {
  it("should get flatten value from val", () => {
    const val$ = val(val(1));
    const { result } = renderHook(() => useFlatten(val$));

    expect(result.current).toBe(1);
  });

  it("should get flatten value from picked val", async () => {
    const renderCount = vi.fn();
    const map = new ReactiveMap<string, Val<number>>();
    map.set("a", val(1));
    const { result } = renderHook(() => {
      renderCount();
      return useFlatten(map.$, map => map.get("a"));
    });

    expect(renderCount).toHaveBeenCalledTimes(1);
    expect(result.current).toBe(1);

    await act(async () => map.get("a")?.set(2));

    expect(renderCount).toHaveBeenCalledTimes(2);
    expect(result.current).toBe(2);

    await act(async () => map.set("a", val(3)));

    expect(renderCount).toHaveBeenCalledTimes(3);
    expect(result.current).toBe(3);
  });

  it("should return undefined if no val provided", () => {
    const { result } = renderHook(() => useFlatten());

    expect(result.current).toBeUndefined();
  });

  it("should update after value changes", async () => {
    const val$ = val("a");
    const { result } = renderHook(() =>
      useFlatten(val$, letter => `#${letter}`)
    );

    expect(result.current).toBe("#a");

    await act(async () => val$.set("b"));

    expect(result.current).toBe("#b");
  });

  it("should support function as value", async () => {
    const val$ = val((): string => "a");
    const { result } = renderHook(() =>
      useFlatten(val$, fn => () => `#${fn()}`)
    );

    expect(result.current()).toBe("#a");

    await act(async () => val$.set(() => "b"));

    expect(result.current()).toBe("#b");
  });

  it("should not trigger extra rendering on initial value", async () => {
    const val$ = val(val(1));
    let renderingCount = 0;
    const { result } = renderHook(() => {
      renderingCount += 1;
      return useFlatten(val$);
    });

    await act(async () => val$.set(val(1)));
    await act(async () => val$.set(val(1)));
    await act(async () => val$.set(val(1)));

    expect(result.current).toBe(1);

    await nextTick();

    expect(renderingCount).toBe(1);

    await act(async () => val$.set(val(2)));

    expect(result.current).toBe(2);

    expect(renderingCount).toBe(2);
  });

  it("should not trigger extra rendering on same value", async () => {
    const val$ = val({ a: val(1) });
    let renderingCount = 0;
    const { result } = renderHook(() => {
      renderingCount += 1;
      return useFlatten(val$, outerVal => outerVal.a);
    });

    await act(async () => val$.set({ a: val(1) }));
    await act(async () => val$.set({ a: val(1) }));
    await act(async () => val$.set({ a: val(1) }));

    expect(result.current).toBe(1);

    await nextTick();

    expect(renderingCount).toBe(1);

    await act(async () => val$.set({ a: val(2) }));

    expect(result.current).toBe(2);

    expect(renderingCount).toBe(2);
  });

  it("should trigger extra rendering if value changes before initial rendering", async () => {
    const val$ = val({ a: val(1) });
    let renderingCount = 0;
    const { result } = renderHook(() => {
      renderingCount += 1;
      const value = useFlatten(val$, outerVal => outerVal.a, true);
      val$.set({ a: val(2) });
      return value;
    });

    expect(result.current).toEqual(2);

    await nextTick();

    expect(renderingCount).toBe(2);
  });
});
