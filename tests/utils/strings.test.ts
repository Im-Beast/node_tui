// Copyright 2023 Im-Beast. All rights reserved. MIT license.
import test from "ava";

import {
  characterWidth,
  insertAt,
  stripStyles,
  textWidth,
  UNICODE_CHAR_REGEXP,
} from "../../src/utils/strings.ts";

const unicodeString = "♥☭👀f🌏g⚠5✌💢✅💛🌻";
const fullWidths = [
  "０",
  "１",
  "２",
  "３",
  "４",
  "ｈ",
  "ｉ",
  "ｊ",
  "ｋ",
  "ｌ",
  "テ",
  "ク",
  "ワ",
];
const halfWidths = ["a", "b", "1", "ą", "ł", "､", "ﾝ", "ｼ"];

test("UNICODE_CHAR_REGEXP", (t) => {
  const unicodeCharacters = unicodeString.match(UNICODE_CHAR_REGEXP)!;

  t.is(unicodeString.length, 18);
  t.is(unicodeCharacters.length, 13);
});

test("insertAt()", (t) => {
  t.is(insertAt("est", 0, "T"), "Test");
  t.is(insertAt("test", 4, "!"), "test!");
});

test("characterWidth()", (t) => {
  for (const character of fullWidths) {
    t.is(characterWidth(character), 2);
  }

  for (const character of halfWidths) {
    t.is(characterWidth(character), 1);
  }
});

test("stripStyles()", (t) => {
  t.is(stripStyles("\x1b[32mHello\x1b[0m"), "Hello");
});

test("textWidth()", (t) => {
  t.is(textWidth(fullWidths.join("")), fullWidths.length * 2);
  t.is(textWidth("Hello"), 5);
});
