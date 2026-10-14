#!/usr/bin/env node
// Usage: node tools/validate.mjs <issue.json>  → prints OK (exit 0) or one error per line (exit 1)
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";

const require = createRequire(import.meta.url);
const { validateIssue } = require("../site/lib.js");

const file = process.argv[2];
if (!file) {
  console.error("usage: node tools/validate.mjs <issue.json>");
  process.exit(2);
}
let issue;
try {
  issue = JSON.parse(readFileSync(file, "utf8"));
} catch (e) {
  console.error("invalid JSON: " + e.message);
  process.exit(1);
}
const { ok, errors } = validateIssue(issue);
if (ok) console.log("OK");
else errors.forEach(e => console.log(e));
process.exit(ok ? 0 : 1);
