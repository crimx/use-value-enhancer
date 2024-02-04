import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useKeys } from "../src/index";
import {
  ReactiveList,
  ReactiveMap,
  ReactiveSet,
} from "value-enhancer/collections";
import { nextTick, val } from "value-enhancer";

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

  it("should get keys from ReadonlyVal<ReactiveMap>", () => {
    const map = new ReactiveMap(
      Object.entries({
        a: 1,
        b: 2,
        c: 3,
      })
    );
    const { result } = renderHook(() => useKeys(map.$));

    expect(result.current).toEqual(["a", "b", "c"]);
  });

  it("should get keys from ReactiveSet", () => {
    const set = new ReactiveSet(["a", "b", "c"]);
    const { result } = renderHook(() => useKeys(set));

    expect(result.current).toEqual(["a", "b", "c"]);
  });

  it("should get keys from ReadonlyVal<ReactiveSet>", () => {
    const set = new ReactiveSet(["a", "b", "c"]);
    const { result } = renderHook(() => useKeys(set.$));

    expect(result.current).toEqual(["a", "b", "c"]);
  });

  it("should get keys from ReadonlyVal<Array | May | Set>", async () => {
    const arr$ = val(["a", "b", "c"]);
    const set$ = val(new Set(["a", "b", "c"]));
    const map$ = val(
      new Map([
        ["a", 1],
        ["b", 2],
        ["c", 3],
      ])
    );

    const { result } = renderHook(() => ({
      arr: useKeys(arr$),
      set: useKeys(set$),
      map: useKeys(map$),
    }));

    expect(result.current).toEqual({
      arr: [0, 1, 2],
      set: ["a", "b", "c"],
      map: ["a", "b", "c"],
    });

    await act(async () => {
      arr$.set(["d", "e", "f"]);
      set$.set(new Set(["d", "e", "f"]));
      map$.set(
        new Map([
          ["d", 4],
          ["e", 5],
          ["f", 6],
        ])
      );
    });

    expect(result.current).toEqual({
      arr: [0, 1, 2],
      set: ["d", "e", "f"],
      map: ["d", "e", "f"],
    });
  });

  it("should get keys from ReactiveList", () => {
    const list = new ReactiveList(["a", "b", "c"]);
    const { result } = renderHook(() => useKeys(list));

    expect(result.current).toEqual([0, 1, 2]);
  });

  it("should get keys from ReadonlyVal<ReadonlyArray>", () => {
    const list = new ReactiveList(["a", "b", "c"]);
    const { result } = renderHook(() => useKeys(list.$));

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

    await nextTick();

    expect(renderingCount).toBe(1);
  });

  it("should not trigger extra rendering if keys not changed", async () => {
    const map = new ReactiveMap(
      Object.entries({
        a: 1,
        b: 2,
        c: 3,
      })
    );
    const renderCount = vi.fn();
    const { result } = renderHook(() => {
      renderCount();
      return useKeys(map);
    });

    expect(result.current).toEqual(["a", "b", "c"]);
    expect(renderCount).toHaveBeenCalledTimes(1);

    renderCount.mockClear();

    await act(async () => map.set("a", 3));

    expect(result.current).toEqual(["a", "b", "c"]);
    expect(renderCount).toHaveBeenCalledTimes(0);
  });
});
