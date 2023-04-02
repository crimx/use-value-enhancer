import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { val } from "value-enhancer";
import { useDerived } from "../src/index";

describe("useDerived", () => {
  it("should get derived value from val", () => {
    const val$ = val(1);
    const { result } = renderHook(() => useDerived(val$, value => value + 1));

    expect(result.current).toBe(2);
  });

  it("should return undefined if no val provided", () => {
    const { result } = renderHook(() =>
      useDerived(undefined, value => value + 1)
    );

    expect(result.current).toBeUndefined();
  });

  it("should update after value changes", async () => {
    const val$ = val("a");
    const { result } = renderHook(() =>
      useDerived(val$, letter => `#${letter}`)
    );

    expect(result.current).toBe("#a");

    await act(async () => val$.set("b"));

    expect(result.current).toBe("#b");
  });

  it("should support function as value", async () => {
    const val$ = val((): string => "a");
    const { result } = renderHook(() =>
      useDerived(val$, fn => () => `#${fn()}`)
    );

    expect(result.current()).toBe("#a");

    await act(async () => val$.set(() => "b"));

    expect(result.current()).toBe("#b");
  });

  it("should not trigger extra rendering on initial value", async () => {
    const val$ = val(1);
    let renderingCount = 0;
    const { result } = renderHook(() => {
      renderingCount += 1;
      return useDerived(val$, value => value + 1);
    });

    await act(async () => val$.set(1));
    await act(async () => val$.set(1));
    await act(async () => val$.set(1));

    expect(result.current).toBe(2);

    await new Promise(resolve => setTimeout(resolve, 0));

    expect(renderingCount).toBe(1);

    await act(async () => val$.set(2));

    expect(result.current).toBe(3);

    expect(renderingCount).toBe(2);
  });

  it("should not trigger extra rendering on same value", async () => {
    const val$ = val({ a: 1 });
    let renderingCount = 0;
    const { result } = renderHook(() => {
      renderingCount += 1;
      return useDerived(val$, value => value.a % 2);
    });

    await act(async () => val$.set({ a: 1 }));
    await act(async () => val$.set({ a: 1 }));
    await act(async () => val$.set({ a: 1 }));

    expect(result.current).toBe(1);

    await new Promise(resolve => setTimeout(resolve, 0));

    expect(renderingCount).toBe(1);

    await act(async () => val$.set({ a: 2 }));

    expect(result.current).toBe(0);

    expect(renderingCount).toBe(2);
  });

  it("should trigger extra rendering if value changes before initial rendering", async () => {
    const val$ = val(1);
    let renderingCount = 0;
    const { result } = renderHook(() => {
      renderingCount += 1;
      const value = useDerived(val$, value => value + 1, true);
      val$.set(2);
      return value;
    });

    expect(result.current).toBe(3);

    await new Promise(resolve => setTimeout(resolve, 0));

    expect(renderingCount).toBe(2);
  });
});
