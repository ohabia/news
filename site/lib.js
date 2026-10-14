/* NewsLib: pure helpers shared by the page, the tests and the daily validator. */
(function (root) {
  "use strict";

  var REGIONS = ["cn", "global"];
  var CATEGORIES = ["business", "tech", "ent"];
  var IMPORTANCE = ["high", "medium"];
  var CREDIBILITY = ["confirmed", "credible", "developing"];
  var DIRS = ["up", "down", "flat"];
  var MAX_STORIES = 10;

  function safeUrl(u) {
    if (typeof u !== "string") return null;
    try {
      var x = new URL(u);
      return x.protocol === "http:" || x.protocol === "https:" ? x.href : null;
    } catch (e) {
      return null;
    }
  }

  function len(s) {
    return Array.from(s).length;
  }

  function validateIssue(issue) {
    var errors = [];
    function err(m) { errors.push(m); }
    function str(v, path, max, required) {
      if (v == null || v === "") { if (required) err(path + ": required"); return; }
      if (typeof v !== "string") return err(path + ": must be a string");
      if (max && len(v) > max) err(path + ": " + len(v) + " chars, max " + max);
    }
    function oneOf(v, list, path) {
      if (list.indexOf(v) < 0) err(path + ": must be one of " + list.join("|"));
    }
    function url(v, path) {
      if (!safeUrl(v)) err(path + ": url must be http(s)");
    }
    function series(arr, path) {
      if (!Array.isArray(arr) || arr.length < 2) return err(path + ": needs at least 2 points");
      arr.forEach(function (p, i) {
        if (!p || typeof p.y !== "number" || !isFinite(p.y)) err(path + "[" + i + "].y: must be a number");
      });
    }

    if (!issue || typeof issue !== "object") return { ok: false, errors: ["issue: not an object"] };
    if (!/^\d{4}-\d{2}-\d{2}$/.test(issue.date || "")) err("date: must be YYYY-MM-DD");
    str(issue.window_pt, "window_pt", 0, true);
    str(issue.cutoff_pt, "cutoff_pt", 0, true);
    if (!Array.isArray(issue.tldr) || issue.tldr.length !== 3) err("tldr: must have exactly 3 items");
    else issue.tldr.forEach(function (t, i) { str(t, "tldr[" + i + "]", 30, true); });
    str(issue.takeaway, "takeaway", 40, false);

    if (issue.hero != null) {
      var h = issue.hero;
      str(h.label, "hero.label", 0, true);
      str(h.value, "hero.value", 0, true);
      if (h.dir != null) oneOf(h.dir, DIRS, "hero.dir");
      if (h.series != null) series(h.series, "hero.series");
      if (!h.source) err("hero.source: required");
      else url(h.source.url, "hero.source.url");
    }

    (issue.markets || []).forEach(function (m, i) {
      var p = "markets[" + i + "]";
      str(m.label, p + ".label", 0, true);
      str(m.value, p + ".value", 0, true);
      if (m.dir != null) oneOf(m.dir, DIRS, p + ".dir");
      url(m.source_url, p + ".source_url");
    });

    if (!Array.isArray(issue.stories)) err("stories: must be an array");
    else {
      if (issue.stories.length > MAX_STORIES) err("stories: " + issue.stories.length + " items, max " + MAX_STORIES);
      var seen = {};
      issue.stories.forEach(function (s, i) {
        var p = "stories[" + i + "]";
        if (!s.id) err(p + ".id: required");
        else if (seen[s.id]) err(p + ".id: duplicate " + s.id);
        seen[s.id] = true;
        oneOf(s.region, REGIONS, p + ".region");
        oneOf(s.category, CATEGORIES, p + ".category");
        oneOf(s.importance, IMPORTANCE, p + ".importance");
        oneOf(s.credibility, CREDIBILITY, p + ".credibility");
        str(s.title, p + ".title", 22, true);
        str(s.hook, p + ".hook", 40, true);
        str(s.why, p + ".why", 50, true);
        if (!Array.isArray(s.points) || s.points.length < 1 || s.points.length > 3) err(p + ".points: 1-3 items");
        else s.points.forEach(function (t, j) { str(t, p + ".points[" + j + "]", 35, true); });
        if (s.headline_number != null) str(s.headline_number.value, p + ".headline_number.value", 10, true);
        if (s.chart != null) {
          oneOf(s.chart.type, ["line", "bar"], p + ".chart.type");
          series(s.chart.points, p + ".chart.points");
          url(s.chart.source_url, p + ".chart.source_url");
        }
        if (!Array.isArray(s.sources) || !s.sources.length) err(p + ".sources: at least 1");
        else s.sources.forEach(function (x, j) { url(x && x.url, p + ".sources[" + j + "].url"); });
      });
    }

    (issue.upcoming || []).forEach(function (u, i) {
      str(u.when, "upcoming[" + i + "].when", 0, true);
      str(u.what, "upcoming[" + i + "].what", 30, true);
    });

    return { ok: errors.length === 0, errors: errors };
  }

  function mixStats(stories) {
    var out = { cn: 0, global: 0, byCat: { business: 0, tech: 0, ent: 0 } };
    (stories || []).forEach(function (s) {
      if (s.region === "cn") out.cn++; else out.global++;
      if (out.byCat[s.category] != null) out.byCat[s.category]++;
    });
    return out;
  }

  function r1(n) { return Math.round(n * 10) / 10; }

  function sparkGeometry(points, w, h, pad) {
    if (pad == null) pad = 4;
    var ys = points.map(function (p) { return p.y; });
    var min = Math.min.apply(null, ys), max = Math.max.apply(null, ys);
    var n = points.length;
    var xy = points.map(function (p, i) {
      var x = n === 1 ? w / 2 : pad + (i * (w - 2 * pad)) / (n - 1);
      var y = max === min ? h / 2 : pad + ((max - p.y) * (h - 2 * pad)) / (max - min);
      return [r1(x), r1(y)];
    });
    var line = xy.map(function (c, i) { return (i ? "L" : "M") + c[0] + "," + c[1]; }).join("");
    var area = line + "L" + xy[n - 1][0] + "," + h + "L" + xy[0][0] + "," + h + "Z";
    var last = xy[n - 1];
    return { line: line, area: area, last: { x: last[0], y: last[1] }, min: min, max: max };
  }

  function changeView(dir) {
    if (dir === "up") return { glyph: "▲", cls: "up" };
    if (dir === "down") return { glyph: "▼", cls: "down" };
    return { glyph: "—", cls: "flat" };
  }

  function upsertIndex(index, entry, keep) {
    if (keep == null) keep = 60;
    var issues = ((index && index.issues) || []).filter(function (i) { return i.date !== entry.date; });
    issues.push(entry);
    issues.sort(function (a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : 0; });
    return { issues: issues.slice(0, keep) };
  }

  var api = {
    validateIssue: validateIssue, mixStats: mixStats, sparkGeometry: sparkGeometry,
    changeView: changeView, safeUrl: safeUrl, upsertIndex: upsertIndex
  };
  root.NewsLib = api;
  if (typeof module === "object" && module.exports) module.exports = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
