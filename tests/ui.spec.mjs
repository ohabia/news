// UI smoke test: node tests/ui.spec.mjs  (needs Playwright; uses preinstalled Chromium)
import { createRequire } from "node:module";
import { execSync, spawn } from "node:child_process";
import { readFileSync, mkdirSync } from "node:fs";
import assert from "node:assert/strict";
const require = createRequire(import.meta.url);
const { chromium } = require(execSync("npm root -g").toString().trim() + "/playwright");

const root = new URL("..", import.meta.url).pathname;
const sample = JSON.parse(readFileSync(root + "tests/fixtures/sample-issue.json", "utf8"));
const index = { issues: [{ date: "2026-10-14", count: 10, headline: sample.stories[0].title }, { date: "2026-10-13", count: 3, headline: "旧一期" }] };
mkdirSync(root + "tests/out", { recursive: true });
const PORT = 8766;
const server = spawn("python3", ["-m", "http.server", String(PORT), "-d", root + "site"], { stdio: "ignore" });
await new Promise(r => setTimeout(r, 800));
const URL0 = `http://localhost:${PORT}/index.html`;

async function open(browser, scheme, issue = sample, init) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, colorScheme: scheme });
  page.setDefaultTimeout(8000);
  const errors = [];
  page.on("pageerror", e => errors.push(String(e)));
  page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });
  if (init) await page.addInitScript(init);
  await page.route("**/data/index.json", r => r.fulfill({ json: index }));
  await page.route("**/data/2026-10-14.json", r => r.fulfill({ json: issue }));
  await page.route("**/data/2026-10-13.json", r => r.fulfill({ json: { ...sample, date: "2026-10-13", stories: sample.stories.slice(0, 3) } }));
  await utf8(page);
  await page.goto(URL0);
  await page.waitForSelector("[data-view='today'] .hero, [data-view='today'] .mix");
  return { page, errors };
}

// The artifact host wraps the page in a skeleton with <meta charset="utf-8">; mimic that here.
async function utf8(page) {
  await page.route("https://fonts.googleapis.com/**", r => r.fulfill({ contentType: "text/css", body: "" }));
  await page.route(/\/(index\.html|lib\.js)$/, async r => {
    const resp = await r.fetch();
    const isHtml = r.request().url().endsWith(".html");
    r.fulfill({ response: resp, headers: { ...resp.headers(), "content-type": (isHtml ? "text/html" : "text/javascript") + "; charset=utf-8" } });
  });
}

let failures = 0;
async function check(name, fn) {
  try { await fn(); console.log("ok   " + name); }
  catch (e) { failures++; console.log("FAIL " + name + "\n     " + e.message.split("\n").slice(0,8).join(" | ")); }
}

const browser = await chromium.launch();
try {
  for (const scheme of ["light", "dark"]) {
    await check(`${scheme}: no horizontal overflow, tab bar, reader, done page, progress saved`, async () => {
      const { page, errors } = await open(browser, scheme);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), 390);
      assert.equal(await page.locator("nav.tabbar [data-tab]").count(), 3);
      await page.screenshot({ path: root + `tests/out/${scheme}-today.png`, fullPage: true });
      await page.click("nav.tabbar [data-tab='read']");
      await page.waitForSelector("[data-view='read']:not([hidden])");
      assert.equal(await page.locator(".dots .dot[aria-current='true']").getAttribute("data-i"), "0");
      await page.waitForTimeout(300);
      await page.screenshot({ path: root + `tests/out/${scheme}-read.png` });
      for (let i = 0; i < 10; i++) { await page.keyboard.press("ArrowRight"); await page.waitForTimeout(120); }
      await page.waitForTimeout(500);
      assert.ok(await page.locator(".slide.done").isVisible());
      assert.match(await page.locator(".slide.done").innerText(), /今天读完了/);
      const read = await page.evaluate(() => JSON.parse(localStorage.getItem("read:2026-10-14") || "[]"));
      assert.equal(read.length, 10);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), 390);
      assert.deepEqual(errors, []);
      await page.close();
    });
  }

  await check("optional blocks absent, 3 stories", async () => {
    const lean = { ...sample, stories: sample.stories.slice(0, 3).map(s => { const y = { ...s }; delete y.chart; delete y.headline_number; return y; }) };
    delete lean.hero; delete lean.markets; delete lean.upcoming; delete lean.takeaway;
    const { page, errors } = await open(browser, "light", lean);
    assert.equal(await page.locator(".hero").count(), 0);
    assert.equal(await page.locator(".markets").count(), 0);
    assert.match(await page.locator(".mix").innerText(), /中国\s*3/);
    assert.match(await page.locator(".mix").innerText(), /海外\s*0/);
    assert.deepEqual(errors, []);
    await page.close();
  });

  await check("localStorage throws", async () => {
    const { page, errors } = await open(browser, "light", sample, () => {
      Object.defineProperty(window, "localStorage", { get() { throw new Error("blocked"); } });
    });
    assert.ok(await page.locator("[data-view='today'] .tldr").isVisible());
    await page.click("nav.tabbar [data-tab='read']");
    await page.keyboard.press("ArrowRight");
    assert.deepEqual(errors, []);
    await page.close();
  });

  await check("javascript: source url renders no link", async () => {
    const bad = structuredClone(sample);
    bad.stories[0].sources = [{ name: "坏链接", url: "javascript:alert(1)" }];
    const { page } = await open(browser, "light", bad);
    assert.equal(await page.locator(".slide[data-id='s1'] a").count(), 0);
    await page.close();
  });

  await check("archive tab lists issues and loads one", async () => {
    const { page } = await open(browser, "light");
    await page.click("nav.tabbar [data-tab='archive']");
    assert.equal(await page.locator(".archive-item").count(), 2);
    await page.click(".archive-item[data-date='2026-10-13']");
    await page.waitForSelector("[data-view='today']:not([hidden])");
    assert.match(await page.locator(".mix").innerText(), /中国\s*3/);
    await page.close();
  });

  await check("empty state when no issues", async () => {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } }); page.setDefaultTimeout(8000);
    await utf8(page);
    await page.route("**/data/index.json", r => r.fulfill({ json: { issues: [] } }));
    await page.goto(URL0);
    await page.waitForSelector(".empty");
    assert.match(await page.locator(".empty").innerText(), /7/);
    await page.close();
  });
} finally {
  await browser.close();
  server.kill();
}
console.log(failures ? `${failures} failed` : "all passed");
process.exit(failures ? 1 : 0);
