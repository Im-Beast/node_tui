// Copyright 2023 Im-Beast. All rights reserved. MIT license.
import test from "ava";

import { EventEmitter } from "../src/event_emitter.ts";

test("EventEmitter", async (t) => {
  const emitter = new EventEmitter();
  let passed = false;
  let triage = 0;

  emitter.on("test", () => {
    passed = true;
  });

  emitter.on(
    "test",
    () => {
      ++triage;
    },
    true,
  );

  emitter.emit("test");
  emitter.emit("test");

  t.is(passed, true);
  t.is(triage, 1);
});
