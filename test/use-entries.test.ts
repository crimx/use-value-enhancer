import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useEntries } from "../src/index";
import {
  ReactiveList,
  ReactiveMap,
  ReactiveSet,
} from "value-enhancer/collections";
import { nextTick, val } from "value-enhancer";

describe("useEntries", () => {
  it("should get entries from ReactiveMap", () => {
    const map = new ReactiveMap(
      Object.entries({
        a: 1,
        b: 2,
        c: 3,
      })
    );
    const { result } = renderHook(() => useEntries(map));

    expect(result.current).toEqual([
      ["a", 1],
      ["b", 2],
      ["c", 3],
    ]);
  });

  it("should get entries from ReadonlyVal<ReactiveMap>", () => {
    const map = new ReactiveMap(
      Object.entries({
        a: 1,
        b: 2,
        c: 3,
      })
    );
    const { result } = renderHook(() => useEntries(map.$));

    expect(result.current).toEqual([
      ["a", 1],
      ["b", 2],
      ["c", 3],
    ]);
  });

  it("should get entries from ReactiveSet", () => {
    const set = new ReactiveSet(["a", "b", "c"]);
    const { result } = renderHook(() => useEntries(set));

    expect(result.current).toEqual([
      ["a", "a"],
      ["b", "b"],
      ["c", "c"],
    ]);
  });

  it("should get entries from ReadonlyVal<ReactiveSet>", () => {
    const set = new ReactiveSet(["a", "b", "c"]);
    const { result } = renderHook(() => useEntries(set.$));

    expect(result.current).toEqual([
      ["a", "a"],
      ["b", "b"],
      ["c", "c"],
    ]);
  });

  it("should get entries from ReactiveList", () => {
    const list = new ReactiveList(["a", "b", "c"]);
    const { result } = renderHook(() => useEntries(list));

    expect(result.current).toEqual([
      [0, "a"],
      [1, "b"],
      [2, "c"],
    ]);
  });

  it("should get entries from ReadonlyVal<ReadonlyArray>", () => {
    const list = new ReactiveList(["a", "b", "c"]);
    const { result } = renderHook(() => useEntries(list.$));

    expect(result.current).toEqual([
      [0, "a"],
      [1, "b"],
      [2, "c"],
    ]);
  });

  it("should get entries from ReadonlyVal<Array | May | Set>", async () => {
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
      arr: useEntries(arr$),
      set: useEntries(set$),
      map: useEntries(map$),
    }));

    expect(result.current).toEqual({
      arr: [
        [0, "a"],
        [1, "b"],
        [2, "c"],
      ],
      set: [
        ["a", "a"],
        ["b", "b"],
        ["c", "c"],
      ],
      map: [
        ["a", 1],
        ["b", 2],
        ["c", 3],
      ],
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
      arr: [
        [0, "d"],
        [1, "e"],
        [2, "f"],
      ],
      set: [
        ["d", "d"],
        ["e", "e"],
        ["f", "f"],
      ],
      map: [
        ["d", 4],
        ["e", 5],
        ["f", 6],
      ],
    });
  });

  it("should return undefined if no map provided", () => {
    const { result } = renderHook(() => useEntries());

    expect(result.current).toBeUndefined();
  });

  it("should update after value changes", async () => {
    const list = new ReactiveList(["a", "b", "c"]);
    const { result } = renderHook(() => useEntries(list));

    expect(result.current).toEqual([
      [0, "a"],
      [1, "b"],
      [2, "c"],
    ]);

    await act(async () => list.set(3, "d"));

    expect(result.current).toEqual([
      [0, "a"],
      [1, "b"],
      [2, "c"],
      [3, "d"],
    ]);

    await act(async () => list.delete(1));

    expect(result.current).toEqual([
      [0, "a"],
      [1, "c"],
      [2, "d"],
    ]);
  });

  it("should not trigger extra rendering on initial value", async () => {
    const set = new ReactiveSet(["a", "b", "c"]);
    let renderingCount = 0;
    const { result } = renderHook(() => {
      renderingCount += 1;
      return useEntries(set);
    });

    expect(result.current).toEqual([
      ["a", "a"],
      ["b", "b"],
      ["c", "c"],
    ]);

    expect(renderingCount).toBe(1);

    await nextTick();

    expect(renderingCount).toBe(1);
  });
});
