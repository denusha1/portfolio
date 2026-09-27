import assert from "node:assert/strict";
import test from "node:test";
import { contactRetryAfter } from "../lib/contact-guard.ts";

test("allows five attempts, rejects further attempts, and resets after the window", () => {
  for (let i = 0; i < 5; i++) assert.equal(contactRetryAfter("sender-a", 1000), 0);
  assert.equal(contactRetryAfter("sender-a", 1001), 60);
  assert.equal(contactRetryAfter("sender-a", 60_000), 1);
  assert.equal(contactRetryAfter("sender-a", 61_000), 0);
});

test("tracks independent senders separately", () => {
  for (let i = 0; i < 5; i++) contactRetryAfter("sender-b", 100_000);
  assert.equal(contactRetryAfter("sender-b", 100_000), 60);
  assert.equal(contactRetryAfter("sender-c", 100_000), 0);
});
