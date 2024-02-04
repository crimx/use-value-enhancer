import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useValues } from "../src/index";
import {
  ReactiveList,
  ReactiveMap,
  ReactiveSet,
} from "value-enhancer/collections";
import { nextTick, val } from "value-enhancer";

describe("useValues", () => {
  it("should get values from ReactiveMap", () => {
    const map = new ReactiveMap(
      Object.entries({
        a: 1,
        b: 2,
        c: 3,
      })
    );
    const { result } = renderHook(() => useValues(map));

    expect(result.current).toEqual([1, 2, 3]);
  });

  it("should get values from ReadonlyVal<ReactiveMap>", () => {
    const map = new ReactiveMap(
      Object.entries({
        a: 1,
        b: 2,
        c: 3,
      })
    );
    const { result } = renderHook(() => useValues(map.$));

    expect(result.current).toEqual([1, 2, 3]);
  });

  it("should get values from ReactiveSet", () => {
    const set = new ReactiveSet(["a", "b", "c"]);
    const { result } = renderHook(() => useValues(set));

    expect(result.current).toEqual(["a", "b", "c"]);
  });

  it("should get values from ReadonlyVal<ReactiveSet>", () => {
    const set = new ReactiveSet(["a", "b", "c"]);
    const { result } = renderHook(() => useValues(set.$));

    expect(result.current).toEqual(["a", "b", "c"]);
  });

  it("should get values from ReactiveList", () => {
    const list = new ReactiveList(["a", "b", "c"]);
    const { result } = renderHook(() => useValues(list));

    expect(result.current).toEqual(["a", "b", "c"]);
  });

  it("should get values from ReadonlyVal<ReadonlyArray>", () => {
    const list = new ReactiveList(["a", "b", "c"]);
    const { result } = renderHook(() => useValues(list.$));

    expect(result.current).toEqual(["a", "b", "c"]);
  });

  it("should get values from ReadonlyVal<Array | May | Set>", async () => {
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
      arr: useValues(arr$),
      set: useValues(set$),
      map: useValues(map$),
    }));

    expect(result.current).toEqual({
      arr: ["a", "b", "c"],
      set: ["a", "b", "c"],
      map: [1, 2, 3],
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
      arr: ["d", "e", "f"],
      set: ["d", "e", "f"],
      map: [4, 5, 6],
    });
  });

  it("should return undefined if no map provided", () => {
    const { result } = renderHook(() => useValues());

    expect(result.current).toBeUndefined();
  });

  it("should update after value changes", async () => {
    const list = new ReactiveList(["a", "b", "c"]);
    const { result } = renderHook(() => useValues(list));

    expect(result.current).toEqual(["a", "b", "c"]);

    await act(async () => list.set(3, "d"));

    expect(result.current).toEqual(["a", "b", "c", "d"]);

    await act(async () => list.delete(1));

    expect(result.current).toEqual(["a", "c", "d"]);
  });

  it("should not trigger extra rendering on initial value", async () => {
    const set = new ReactiveSet(["a", "b", "c"]);
    let renderingCount = 0;
    const { result } = renderHook(() => {
      renderingCount += 1;
      return useValues(set);
    });

    expect(result.current).toEqual(["a", "b", "c"]);

    expect(renderingCount).toBe(1);

    await nextTick();

    expect(renderingCount).toBe(1);
  });
});
