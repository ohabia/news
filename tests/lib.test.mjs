import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
const require = createRequire(import.meta.url);
const L = require("../site/lib.js");
const sample = () => JSON.parse(readFileSync(new URL("./fixtures/sample-issue.json", import.meta.url)));
const errs = issue => L.validateIssue(issue).errors.join("\n");

test("sample issue is valid", () => {
  const r = L.validateIssue(sample());
  assert.deepEqual(r.errors, []);
  assert.equal(r.ok, true);
});
test("rejects more than 10 stories", () => {
  const s = sample(); s.stories.push({ ...s.stories[0], id: "s11" });
  assert.match(errs(s), /stories/);
});
test("rejects unknown category", () => {
  const s = sample(); s.stories[0].category = "politics";
  assert.equal(L.validateIssue(s).ok, false);
});
test("rejects title over 22 chars", () => {
  const s = sample(); s.stories[0].title = "字".repeat(23);
  assert.match(errs(s), /title/);
});
test("rejects non-http url", () => {
  const s = sample(); s.stories[0].sources[0].url = "javascript:x";
  assert.match(errs(s), /url/);
});
test("rejects chart with one point", () => {
  const s = sample(); s.stories[0].chart.points = [{ x: "a", y: 1 }];
  assert.match(errs(s), /chart/);
});
test("rejects duplicate story id", () => {
  const s = sample(); s.stories[1].id = "s1";
  assert.match(errs(s), /id/);
});
test("rejects tldr not exactly 3", () => {
  const s = sample(); s.tldr.pop();
  assert.match(errs(s), /tldr/);
});
test("accepts issue without optional blocks", () => {
  const s = sample(); delete s.hero; delete s.markets; delete s.upcoming; delete s.takeaway;
  s.stories = s.stories.slice(0, 3).map(x => { const y = { ...x }; delete y.chart; delete y.headline_number; return y; });
  assert.deepEqual(L.validateIssue(s).errors, []);
});
test("mixStats", () => {
  assert.deepEqual(L.mixStats(sample().stories), { cn: 7, global: 3, byCat: { business: 4, tech: 4, ent: 2 } });
  assert.deepEqual(L.mixStats([]), { cn: 0, global: 0, byCat: { business: 0, tech: 0, ent: 0 } });
});
test("sparkGeometry", () => {
  const g = L.sparkGeometry([{ y: 1 }, { y: 3 }, { y: 2 }], 100, 40);
  assert.deepEqual(g.last, { x: 96, y: 20 });
  assert.ok(g.line.startsWith("M4,"));
  assert.equal(g.min, 1); assert.equal(g.max, 3);
  assert.equal(L.sparkGeometry([{ y: 5 }, { y: 5 }], 100, 40).line, "M4,20L96,20");
  assert.ok(g.area.endsWith("Z"));
});
test("changeView", () => {
  assert.deepEqual(L.changeView("up"), { glyph: "▲", cls: "up" });
  assert.deepEqual(L.changeView("down"), { glyph: "▼", cls: "down" });
  assert.deepEqual(L.changeView("flat"), { glyph: "—", cls: "flat" });
});
test("safeUrl", () => {
  assert.equal(L.safeUrl("https://a.com/x"), "https://a.com/x");
  assert.equal(L.safeUrl("javascript:alert(1)"), null);
  assert.equal(L.safeUrl("nope"), null);
});
test("upsertIndex", () => {
  let idx = L.upsertIndex({ issues: [{ date: "2026-10-13" }] }, { date: "2026-10-14", count: 8, headline: "h" });
  assert.equal(idx.issues[0].date, "2026-10-14");
  idx = L.upsertIndex(idx, { date: "2026-10-14", count: 9, headline: "h2" });
  assert.equal(idx.issues.length, 2); assert.equal(idx.issues[0].count, 9);
  const many = { issues: Array.from({ length: 61 }, (_, i) => ({ date: `2026-01-${String(i).padStart(2, "0")}` })) };
  assert.equal(L.upsertIndex(many, { date: "2026-10-14", count: 1, headline: "x" }).issues.length, 60);
});
test("rejects hero.value over 12 chars", () => {
  const s = sample(); s.hero.value = "12,345,678,901";
  assert.match(errs(s), /hero\.value/);
});
