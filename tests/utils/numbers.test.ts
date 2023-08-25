// Copyright 2023 Im-Beast. All rights reserved. MIT license.
import test from "ava";

import {
  clamp,
  fits,
  fitsInRectangle,
  normalize,
} from "../../src/utils/numbers.ts";

test("clamp()", (t) => {
  t.is(clamp(-5, 0, 10), 0);
  t.is(clamp(0, 0, 10), 0);
  t.is(clamp(-1, 0, 10), 0);
  t.is(clamp(5, 0, 10), 5);
  t.is(clamp(10, 0, 10), 10);
  t.is(clamp(10, 0, 11), 10);
});

test("fits()", (t) => {
  t.is(fits(-1, 0, 1), false);
  t.is(fits(0.1, 0, 1), true);
  t.is(fits(0.9, 0, 1), true);
  t.is(fits(0, 0, 1), true);
  t.is(fits(1, 0, 1), true);
});

test("fitsInRectangle()", (t) => {
  const rectangle = {
    column: 5,
    row: 5,
    width: 10,
    height: 10,
  };

  t.is(fitsInRectangle(0, 0, rectangle), false);
  t.is(fitsInRectangle(5, 0, rectangle), false);
  t.is(fitsInRectangle(0, 5, rectangle), false);
  t.is(fitsInRectangle(13, 0, rectangle), false);
  t.is(fitsInRectangle(13, 6, rectangle), true);
  t.is(fitsInRectangle(5, 5, rectangle), true);
  t.is(fitsInRectangle(14, 14, rectangle), true);
  t.is(fitsInRectangle(15, 15, rectangle), false);
});

test("normalize()", (t) => {
  t.is(normalize(50, 0, 100), 0.5);
  t.is(normalize(0, -100, 100), 0.5);
});
