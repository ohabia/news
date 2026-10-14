# 每日速读 App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A phone-first "清透质感" news reader at a fixed claude.ai Artifact URL, refilled every morning by a scheduled Routine with ≤10 verified business/tech/entertainment stories (China : global ≈ 7 : 3).

**Architecture:** One static page (`site/index.html`) plus one pure-logic module (`site/lib.js`, loaded by the page as a published file and imported by Node tests and the validator CLI). Each day the Routine writes only `data/YYYY-MM-DD.json` + `data/index.json` and republishes them to the same Artifact URL. No build step, no backend.

**Tech Stack:** Plain HTML/CSS/JS (ES2020, no framework), hand-drawn SVG charts, Node 18+ `node:test` for logic, Playwright (preinstalled Chromium) for UI smoke tests, Claude Code Routine + Artifact tool for delivery.

**Spec:** `docs/superpowers/specs/2026-10-14-daily-news-app-design.md` (style references: `docs/design-reference/clear-ui-*.png` — look at them before Task 2).

## Global Constraints

- Artifact URL is fixed: `https://claude.ai/artifact/BVXAJfsgjVPQaf4TbfDaYZ`; update in place, never create a new one.
- Issue JSON schema exactly as spec §4.2; optional: `hero`, `markets`, `headline_number`, `chart`, `upcoming`, `takeaway`.
- Max 10 stories; target 7 `cn` / 3 `global`; categories only `business|tech|ent`.
- Length caps (characters): title ≤22, hook ≤40, each point ≤35 (≤3 points), why ≤50, tldr item ≤30 (exactly 3), takeaway ≤40, upcoming.what ≤30.
- Up/down: US convention — green up, red down — always with ▲ / ▼ glyph; flat uses "—" in neutral grey.
- One saturated accent per screen (with a matching soft glow); region tags 中国/海外 are neutral grey pills.
- Artifact page contract: no own `<html>/<head>/<body>`; `<title>每日速读</title>` + `<meta name="claude:viewport-fit-sides" content="cover">` at top; side gutter `max(16px, env(safe-area-inset-*))`; light + dark tokens (`prefers-color-scheme` guarded by `:root:not([data-theme="light"])` and `:root[data-theme="dark"]`); fonts only from Google Fonts; all user-visible strings rendered via `textContent`; links only `http(s)`.
- localStorage access always wrapped in try/catch; page works without it.
- Copy is Simplified Chinese; times are PT.
- Required UI/UX skills before/after Task 2: `frontend-design`, `dataviz`, `design:design-system`, `design:ux-copy`, `design:accessibility-review`; after Task 2, `design:design-critique` one pass.

## Review Focus

1. A day with fewer stories (e.g. 3, or 0 `cn`) — mix chart, progress dots and "done" page still render; 0 stories shows a designed empty state, not a blank screen.
2. Optional fields absent (`hero`, `chart`, `headline_number`, `markets`) — their blocks disappear without leaving empty cards.
3. Text at the length caps on a 360px-wide phone — nothing overflows horizontally.
4. localStorage throws (private mode) — reader still works, progress just isn't remembered.
5. Malformed data from the Routine (bad URL, unknown category, series with 1 point) — validator rejects before publish; page ignores bad links rather than crashing.

---

### Task 1: Pure logic module + validator

**Files:**
- Create: `site/lib.js` (UMD-style: assigns `globalThis.NewsLib` and `module.exports` when present)
- Create: `tools/validate.mjs` (CLI)
- Create: `tests/lib.test.mjs`, `tests/fixtures/sample-issue.json` (clearly fake "示例" content, never published)
- Create: `package.json` with `"scripts": {"test": "node --test tests/", "validate": "node tools/validate.mjs"}`

**Interfaces (Produces):**
- `validateIssue(issue: object) -> {ok: boolean, errors: string[]}` — enforces schema, enums, caps, max 10 stories, unique ids, `http(s)` URLs, each story ≥1 source, `chart.points` and `hero.series` length ≥2 with numeric `y`.
- `mixStats(stories) -> {cn: number, global: number, byCat: {business, tech, ent}}`
- `sparkGeometry(points: {y:number}[], w: number, h: number, pad=4) -> {line: string, area: string, last: {x:number, y:number}, min:number, max:number}` — SVG path `d` strings; flat series draws a centred horizontal line.
- `changeView(dir: "up"|"down"|"flat") -> {glyph: "▲"|"▼"|"—", cls: "up"|"down"|"flat"}`
- `safeUrl(u: string) -> string|null`
- `upsertIndex(index: {issues: []}, entry: {date, count, headline}, keep=60) -> {issues: []}` — replaces same date, sorts newest first, trims to `keep`.
- CLI: `node tools/validate.mjs <issue.json>` exits 0 and prints `OK`, or exits 1 and prints one error per line.

- [ ] **Step 1: Write failing tests** in `tests/lib.test.mjs`:
  - `validateIssue(sample).ok === true`
  - 11 stories → error contains `"stories"`; `category: "politics"` → error; title of 23 chars → error; `url: "javascript:x"` → error; `chart.points` with 1 point → error; duplicate story id → error.
  - `mixStats` on sample (fixture has 7 cn / 3 global, 4 business / 4 tech / 2 ent) returns those counts; on `[]` returns all zeros.
  - `sparkGeometry([{y:1},{y:3},{y:2}], 100, 40).last` equals `{x: 96, y: 20}`; `line` starts with `"M4,"`; `sparkGeometry([{y:5},{y:5}],100,40).line` is `"M4,20L96,20"`.
  - `changeView("up")` → `{glyph:"▲", cls:"up"}`; `"down"` → `▼/down`; `"flat"` → `—/flat`.
  - `safeUrl("https://a.com/x")` → same; `safeUrl("javascript:alert(1)")` → `null`; `safeUrl("nope")` → `null`.
  - `upsertIndex({issues:[{date:"2026-10-13"}]}, {date:"2026-10-14",count:8,headline:"h"})` → first entry is 10-14; inserting 10-14 again keeps length 2; 61 entries trimmed to 60.
- [ ] **Step 2:** `npm test` → FAIL (module missing).
- [ ] **Step 3:** Implement `site/lib.js` and `tools/validate.mjs` (validator imports via `createRequire`).
- [ ] **Step 4:** `npm test` → all PASS; `node tools/validate.mjs tests/fixtures/sample-issue.json` → `OK`.
- [ ] **Step 5:** Commit `feat: news lib and issue validator`.

### Task 2: The app page (清透质感 UI)

**Files:**
- Replace: `site/index.html` (prototype is discarded)
- Create: `tests/ui.spec.mjs` (Playwright script, run with `node tests/ui.spec.mjs`; serves `site/` + fixture via `python3 -m http.server`)
- Create: `tools/preview.sh` — copies `site/` to a temp dir, puts fixture at `data/2026-10-14.json` and a matching `data/index.json`, serves on :8765.

**Interfaces:**
- Consumes: `NewsLib.*` from Task 1 via `<script src="lib.js"></script>`.
- Produces: page reads `data/index.json` then `data/<date>.json` (`fetch(..., {cache:"no-store"})`); deep link `#YYYY-MM-DD`; localStorage keys `read:<date>` (array of story ids), `tab`.

Screens (spec §4.1): bottom capsule tab bar `今天 · 速读 · 往期`, centre raised button = "开始" (jumps to 速读 at first unread card).
- **今天:** greeting by PT hour (早上好 / 下午好 / 晚上好) + date; hero card (big number + unit, change chip, sparkline with end-value bubble and x tick labels); mix: segmented ring or bar (中国 n · 海外 n) + category counts; "三句话看完今天" + takeaway; market chips row if `markets`.
- **速读:** horizontal scroll-snap carousel (`scroll-snap-type: x mandatory`), one card per story, progress dots at top, tap left/right third to move, keyboard ←/→; card content per spec; reaching a card marks it read; final slide = "今天读完了" + 接下来 72 小时 list.
- **往期:** list from `index.json` (date, count, headline); tap loads that issue into 今天/速读.
- Empty state (no issues or 0 stories): designed card saying content updates daily around 7:00 PT.

- [ ] **Step 1:** Load skills `frontend-design`, `dataviz`, `design:design-system`, `design:ux-copy`, `design:accessibility-review`; view all six reference images. Write the token block (`:root` + both dark blocks) as the first thing in `<style>`.
- [ ] **Step 2: Write failing UI test** `tests/ui.spec.mjs` at viewport 390×844, both color schemes:
  - `document.documentElement.scrollWidth === 390`
  - tab bar has 3 tabs + centre button; clicking 开始 shows 速读 with dot 1 active
  - pressing ArrowRight 10× reaches the slide containing "今天读完了"; reload → `localStorage['read:2026-10-14']` has 10 ids
  - fixture variant with `hero`, `chart`, `markets` removed and 3 stories → no `.hero` element, mix shows `中国 3`/`海外 0` (or actual), no console errors
  - `localStorage` stubbed to throw (`page.addInitScript`) → page still renders 今天 with no uncaught errors
  - a story with `sources[0].url = "javascript:x"` renders no `<a>` for it
  - writes screenshots `tests/out/{light,dark}-{today,read}.png`
- [ ] **Step 3:** Run `node tests/ui.spec.mjs` → FAIL.
- [ ] **Step 4:** Implement `site/index.html`.
- [ ] **Step 5:** Run → PASS; look at the four screenshots once against the reference images; fix what's visibly off.
- [ ] **Step 6:** Run `design:design-critique` and `design:accessibility-review` on the screenshots; apply fixes; rerun test → PASS.
- [ ] **Step 7:** Commit `feat: clear-style daily news reader`.

### Task 3: Routine prompt

**Files:**
- Create: `routine/prompt.md`

**Interfaces:**
- Consumes: issue schema + `validate.mjs` behaviour (Task 1); Artifact layout (`index.html`, `lib.js`, `data/*`).
- Produces: the exact text passed to `create_trigger` in Task 4.

Content requirements (Simplified Chinese, self-contained — the fired session has no repo):
- Unattended, no questions; PT times; window = NOW−24h → NOW.
- Keep from old Routine (`get_trigger trig_01XeM4XfCyypo8x2pYVb2ja4`): 时间纪律 section; Stage 2 checks 1–10; credibility tiers; APPROVE/HOLD/REJECT rules; "UNCONFIRMED 一律不得 APPROVE"; "不得为了增加新闻数量降低证据标准".
- New scope: business / tech / entertainment; China sources first (公司公告、交易所公告、工信部/证监会/国家统计局、财新、第一财经、36氪、界面、猫眼/灯塔等) plus global; politics only when it directly changes business/markets, written from that angle; target 7 cn / 3 global, ≤10, explain deviations in the summary.
- Writing: caps from Global Constraints; `why` explains mechanism; numbers and chart points only from fetched sources, each with `source_url`.
- Delivery steps: (1) `Artifact read` url + `path: "data/index.json"` (missing → `{"issues":[]}`), and `path: "lib.js"` saved locally; (2) write `data/<date>.json`; (3) validate with an inline Node one-liner using the downloaded `lib.js` (`validateIssue`) — fix and revalidate until OK; (4) `upsertIndex`; (5) `Artifact publish` with `url`, `files` = the two data files only; retry once; on failure print the JSON in the session.
- Final message (becomes the push notification): ≤3 lines — `今日速读 · MM-DD · N 条（中国 a / 海外 b）`, top headline, link.

- [ ] **Step 1:** Write `routine/prompt.md`.
- [ ] **Step 2:** Dry-check: extract the validation one-liner from the prompt and run it against `tests/fixtures/sample-issue.json` with `site/lib.js` → prints `OK`.
- [ ] **Step 3:** Commit `feat: daily routine prompt`.

### Task 4: Ship and first live run

**Files:** none new (publishes `site/index.html`, `site/lib.js`, `site/data/index.json`).

- [ ] **Step 1:** Publish `site/index.html` to the same Artifact (same file path as the original publish, or `url`), `files`: `lib.js`, `data/index.json` (`{"issues":[]}`). Open the URL; empty state shows.
- [ ] **Step 2:** `create_trigger`: name `每日速读（06:50 PT）`, cron `CRON_TZ=America/Los_Angeles 50 6 * * *`, `create_new_session_on_fire: true`, `notifications: {push: true}`, `connectors: []`, prompt = `routine/prompt.md`, `initiation: human_request`. Leave old trigger disabled.
- [ ] **Step 3:** `fire_trigger` once; when the fired session finishes (`get_session` / `list_events`), `Artifact read` `data/index.json` → contains today's date; open the page and check the issue renders.
- [ ] **Step 4:** Update spec status to "已实现"; commit + push `chore: ship daily news app`.
