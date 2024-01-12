import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useKeys } from "../src/index";
import {
  ReactiveList,
  ReactiveMap,
  ReactiveSet,
} from "value-enhancer/collections";

describe("useKeys", () => {
  it("should get keys from ReactiveMap", () => {
    const map = new ReactiveMap(
      Object.entries({
        a: 1,
        b: 2,
        c: 3,
      })
    );
    const { result } = renderHook(() => useKeys(map));

    expect(result.current).toEqual(["a", "b", "c"]);
  });

  it("should get keys from ReactiveSet", () => {
    const set = new ReactiveSet(["a", "b", "c"]);
    const { result } = renderHook(() => useKeys(set));

    expect(result.current).toEqual(["a", "b", "c"]);
  });

  it("should get keys from ReactiveList", () => {
    const list = new ReactiveList(["a", "b", "c"]);
    const { result } = renderHook(() => useKeys(list));

    expect(result.current).toEqual([0, 1, 2]);
  });

  it("should return undefined if no map provided", () => {
    const { result } = renderHook(() => useKeys());

    expect(result.current).toBeUndefined();
  });

  it("should update after key changes", async () => {
    const list = new ReactiveList(["a", "b", "c"]);
    const { result } = renderHook(() => useKeys(list));

    expect(result.current).toEqual([0, 1, 2]);

    await act(async () => list.set(3, "d"));

    expect(result.current).toEqual([0, 1, 2, 3]);

    await act(async () => list.delete(1));

    expect(result.current).toEqual([0, 1, 2]);
  });

  it("should not trigger extra rendering on initial value", async () => {
    const set = new ReactiveSet(["a", "b", "c"]);
    let renderingCount = 0;
    const { result } = renderHook(() => {
      renderingCount += 1;
      return useKeys(set);
    });

    expect(result.current).toEqual(["a", "b", "c"]);

    expect(renderingCount).toBe(1);

    await new Promise(resolve => setTimeout(resolve, 0));

    expect(renderingCount).toBe(1);
  });
});
