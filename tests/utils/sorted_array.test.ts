// Copyright 2023 Im-Beast. All rights reserved. MIT license.
import test from "ava";
import { SortedArray } from "../../src/utils/sorted_array.ts";

test("SortedArray", (t) => {
  const array = new SortedArray<number>((a, b) => b - a);

  array.push(1, 10, -5, -2, 11, 100, -1000);
  t.deepEqual([...array], [100, 11, 10, 1, -2, -5, -1000]);
  array.remove(11);
  t.deepEqual([...array], [100, 10, 1, -2, -5, -1000]);
});
