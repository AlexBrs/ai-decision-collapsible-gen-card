#!/usr/bin/env node
/* AiDecisionCard standalone renderer v1.0.0
 * Usage: node render.js <card.json> [out.html] [--no-open]
 * Builds a self-contained white HTML page (engine embedded, no network) and opens it in the default browser.
 * Defaults: output folder = AIDC_OUT_DIR or the input file's folder; file name = <AIDC_PREFIX><YYYYMMDD>_<HHMM>_<card id>.html
 */
"use strict";
const fs = require("fs"), path = require("path"), cp = require("child_process");
const args = process.argv.slice(2), noOpen = args.includes("--no-open"), pos = args.filter(a => !a.startsWith("--"));
if (!pos[0]) { console.error("Usage: node render.js <card.json> [out.html] [--no-open]"); process.exit(1); }
const data = JSON.parse(fs.readFileSync(pos[0], "utf8"));
if (!Array.isArray(data.q) || !data.q.length) { console.error("Invalid card: 'q' must be a non-empty array"); process.exit(2); }
for (const q of data.q) {
  if (!q.id || !Array.isArray(q.o) || !q.o.length) { console.error("Invalid question: " + JSON.stringify(q).slice(0, 80)); process.exit(2); }
  for (const o of q.o) if (!o.k || o.k === "__other") { console.error("Missing or reserved option key in " + q.id); process.exit(2); }
}
const engine = fs.readFileSync(path.join(__dirname, "ai-decision-card.js"), "utf8");
const d = new Date(), p2 = n => String(n).padStart(2, "0");
const ts = d.getFullYear() + p2(d.getMonth() + 1) + p2(d.getDate()) + "_" + p2(d.getHours()) + p2(d.getMinutes());
const safeId = String(data.id || "CARD").replace(/[^A-Za-z0-9_-]/g, "_");
const pageId = (process.env.AIDC_PREFIX || "") + ts + "_" + safeId;
const out = pos[1] || path.join(process.env.AIDC_OUT_DIR || path.dirname(path.resolve(pos[0])), pageId + ".html");
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const title = typeof data.title === "string" ? data.title : (data.title && (data.title[data.lang] || data.title.en)) || ("Decision card " + safeId);
const json = JSON.stringify(data).replace(/</g, "\\u003c");
const html = `<!doctype html>
<html lang="${esc(data.lang || "en")}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<!-- Page ID: ${pageId} | AiDecisionCard engine embedded | self-contained -->
<style>html,body{margin:0;background:#fff;color:#1b1f24;color-scheme:light}body{padding:16px 24px 40px;font:14px/1.5 -apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}h1{font-size:20px;font-weight:700;margin:0 0 2px}.meta{font-size:12px;color:#5b6672;margin-bottom:12px}</style>
</head><body>
<h1>${esc(title)}</h1><div class="meta">ID: <b>${pageId}</b></div>
<div id="qa"></div>
<script>${engine}</script>
<script>AiDecisionCard.render(${json},{target:"#qa",mode:"standalone"});</script>
</body></html>
`;
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, html, "utf8");
console.log("WROTE " + out + " (" + html.length + " bytes)");
if (!noOpen) {
  if (process.platform === "win32") { cp.exec('start "" "' + out + '"'); cp.exec('explorer /select,"' + out + '"'); }
  else cp.exec((process.platform === "darwin" ? "open" : "xdg-open") + ' "' + out + '"');
}
