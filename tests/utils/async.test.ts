// Copyright 2023 Im-Beast. All rights reserved. MIT license.
import test from "ava";

import { sleep } from "../../src/utils/async.ts";

test("sleep()", async (t) => {
  const intervals = [0, 1, 33, 50, 100, 150];

  for (const interval of intervals) {
    const start = Date.now();
    await sleep(interval);

    const time = Math.abs((Date.now() - start) - interval);
    t.assert(time < 4, time.toString());
  }
});
