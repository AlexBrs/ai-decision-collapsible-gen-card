#!/usr/bin/env node
/* AiDecisionCard team-answers merger v1.0.0
 * Usage: node merge.js <folder with the team's ZIPs> [--no-open]
 * Reads every *.zip exported by the card (answers.json, answers.md, files/*), and writes into <folder>/_merged_<YYYYMMDD_HHMMSS>/:
 *   REPORT_<card id>_<stamp>.html  - one white report: respondents, per-question tally (who chose what), own answers, notes, files
 *   MERGED_<card id>_<stamp>.json  - the same data, machine-readable
 *   files/<respondent>/...          - every attached file, sorted per person
 * Flags (never silently fixed): ZIPs of another card, unreadable ZIPs, duplicate respondents, missing names, mixed engine versions.
 * No dependencies; reads store and deflate ZIPs (so re-zipped files work too).
 */
"use strict";
const fs = require("fs"), path = require("path"), zlib = require("zlib"), cp = require("child_process");
const VER = "1.0.0";
const args = process.argv.slice(2), noOpen = args.includes("--no-open"), dir = args.filter(a => !a.startsWith("--"))[0];
if (!dir || !fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) { console.error("Usage: node merge.js <folder with ZIPs> [--no-open]"); process.exit(1); }
const p2 = n => String(n).padStart(2, "0"), d0 = new Date();
const stamp = d0.getFullYear() + p2(d0.getMonth() + 1) + p2(d0.getDate()) + "_" + p2(d0.getHours()) + p2(d0.getMinutes()) + p2(d0.getSeconds());
const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const safe = s => String(s).trim().replace(/[\\/:*?"<>|\x00-\x1f]+/g, "_").replace(/^\.+/, "_") || "_";

function readZip(buf) {
  let e = -1; for (let i = buf.length - 22; i >= Math.max(0, buf.length - 65557); i--) if (buf.readUInt32LE(i) === 0x06054b50) { e = i; break; }
  if (e < 0) throw new Error("not a ZIP (no end record)");
  const n = buf.readUInt16LE(e + 10), out = {}; let p = buf.readUInt32LE(e + 16);
  for (let k = 0; k < n; k++) {
    if (buf.readUInt32LE(p) !== 0x02014b50) throw new Error("broken central directory");
    const method = buf.readUInt16LE(p + 10), csize = buf.readUInt32LE(p + 20), nl = buf.readUInt16LE(p + 28), xl = buf.readUInt16LE(p + 30), cl = buf.readUInt16LE(p + 32), lho = buf.readUInt32LE(p + 42);
    const name = buf.slice(p + 46, p + 46 + nl).toString("utf8").replace(/\\/g, "/");
    p += 46 + nl + xl + cl;
    if (name.endsWith("/")) continue;
    const start = lho + 30 + buf.readUInt16LE(lho + 26) + buf.readUInt16LE(lho + 28), raw = buf.slice(start, start + csize);
    out[name] = method === 0 ? raw : method === 8 ? zlib.inflateRawSync(raw) : null;
    if (!out[name]) throw new Error("unsupported compression in " + name);
  }
  return out;
}

const zips = fs.readdirSync(dir).filter(f => /\.zip$/i.test(f)).sort();
if (!zips.length) { console.error("No .zip files in " + dir); process.exit(2); }
const flags = [], resp = [];
for (const z of zips) {
  let ent;
  try { ent = readZip(fs.readFileSync(path.join(dir, z))); } catch (x) { flags.push(["🔴", "Unreadable ZIP skipped", z + " — " + x.message]); continue; }
  const aj = Object.keys(ent).find(k => /(^|\/)answers\.json$/.test(k));
  if (!aj) { flags.push(["🔴", "No answers.json — skipped", z]); continue; }
  let j; try { j = JSON.parse(ent[aj].toString("utf8")); } catch (x) { flags.push(["🔴", "answers.json unreadable — skipped", z]); continue; }
  const base = aj.replace(/answers\.json$/, "");
  const files = Object.keys(ent).filter(k => k.startsWith(base + "files/")).map(k => ({ zipPath: k.slice(base.length), data: ent[k] }));
  resp.push({ zip: z, json: j, files });
}
if (!resp.length) { console.error("Nothing readable. " + flags.map(f => f[1] + ": " + f[2]).join(" | ")); process.exit(3); }
// card id = the most common one; others flagged and skipped
const ids = {}; resp.forEach(r => { ids[r.json.artifact_id] = (ids[r.json.artifact_id] || 0) + 1; });
const cardId = Object.keys(ids).sort((a, b) => ids[b] - ids[a])[0];
const team = resp.filter(r => { if (r.json.artifact_id !== cardId) { flags.push(["🔴", "Another card's ZIP skipped", r.zip + " (card " + r.json.artifact_id + ")"]); return false; } return true; });
const cardRef = (team.find(r => r.json.card_ref) || { json: {} }).json.card_ref || "";
const engines = [...new Set(team.map(r => r.json.engine))]; if (engines.length > 1) flags.push(["🟡", "Mixed engine versions", engines.join(", ")]);
// respondent names
const seen = {};
team.forEach((r, i) => {
  r.name = (r.json.respondent && r.json.respondent.name || "").trim();
  if (!r.name) { r.name = "Respondent " + (i + 1); flags.push(["🟠", "No name/ID in answers (single-user card?)", r.zip + " → shown as \"" + r.name + "\""]); }
  const key = r.name.toLowerCase(); seen[key] = (seen[key] || 0) + 1;
});
Object.keys(seen).filter(k => seen[k] > 1).forEach(k => flags.push(["🟠", "Same name/ID answered more than once — all kept", team.filter(r => r.name.toLowerCase() === k).map(r => r.zip).join(", ")]));
const used = {}; team.forEach(r => { let f = safe(r.name), b = f, c = 2; while (used[f.toLowerCase()]) f = b + "_" + c++; used[f.toLowerCase()] = 1; r.folder = f; });
// questions in first-seen order
const qs = {}, qOrder = [];
team.forEach(r => Object.keys(r.json.answers || {}).forEach(qid => {
  const a = r.json.answers[qid];
  if (!qs[qid]) { qs[qid] = { question: a.question, blocking: !!a.blocking, multi: !!a.multi, options: {}, own: [], notes: [], answer_notes: [], unanswered: [] }; qOrder.push(qid); }
  const q = qs[qid], keys = Array.isArray(a.answer) ? a.answer : a.answer == null ? [] : [a.answer], labels = Array.isArray(a.answer_label) ? a.answer_label : [a.answer_label];
  if (!keys.length) q.unanswered.push(r.name);
  keys.forEach((k, i) => { const o = q.options[k] || (q.options[k] = { label: labels[i] || k, who: [] }); o.who.push(r.name); });
  if (a.own_answer) q.own.push({ who: r.name, text: a.own_answer });
  if (a.notes) q.notes.push({ who: r.name, text: a.notes });
  Object.keys(a.answer_notes || {}).forEach(k => q.answer_notes.push({ who: r.name, key: k, label: (q.options[k] || {}).label || k, text: a.answer_notes[k] }));
}));
// output folder + files
const out = path.join(dir, "_merged_" + stamp); fs.mkdirSync(path.join(out, "files"), { recursive: true });
const fileRows = [];
team.forEach(r => {
  const meta = r.json.attachments || [];
  r.files.forEach(f => {
    const m = meta.find(a => a.saved_as === f.zipPath) || {}, fn = safe(path.basename(f.zipPath)), rel = "files/" + r.folder + "/" + fn;
    fs.mkdirSync(path.join(out, "files", r.folder), { recursive: true }); fs.writeFileSync(path.join(out, rel), f.data);
    fileRows.push({ who: r.name, level: m.level || "?", question: m.question || "", answer: m.answer || "", name: fn, size: f.data.length, path: rel });
  });
  const listed = meta.filter(a => a.delivery === "zip").length; if (listed !== r.files.length) flags.push(["🟠", "File count mismatch", r.zip + ": answers.json lists " + listed + ", ZIP holds " + r.files.length]);
});
const N = team.length;
const merged = {
  card_id: cardId, card_ref: cardRef || undefined, merged_at: d0.toISOString(), merger: "AiDecisionCard merge " + VER, engines, source_folder: path.resolve(dir),
  respondents: team.map(r => ({ name: r.name, zip: r.zip, exported_at: r.json.exported_at, lang: r.json.lang, files: r.files.length })),
  questions: Object.fromEntries(qOrder.map(id => { const q = qs[id]; return [id, { question: q.question, blocking: q.blocking, multi: q.multi, tally: Object.fromEntries(Object.keys(q.options).map(k => [k, { label: q.options[k].label, count: q.options[k].who.length, who: q.options[k].who }])), unanswered: q.unanswered, own_answers: q.own, notes: q.notes, answer_notes: q.answer_notes }]; })),
  summary_comments: team.filter(r => r.json.summary_comments).map(r => ({ who: r.name, text: r.json.summary_comments })),
  files: fileRows, flags: flags.map(f => ({ level: f[0], issue: f[1], detail: f[2] }))
};
const base = safe(cardId || "CARD") + "_" + stamp, jsonPath = path.join(out, "MERGED_" + base + ".json"), htmlPath = path.join(out, "REPORT_" + base + ".html");
fs.writeFileSync(jsonPath, JSON.stringify(merged, null, 2));
// ---------- HTML report
const reportId = "AB_" + stamp.slice(0, 13).replace("_", "_") + "_ADC_MERGE_" + safe(cardId);
const multi = t => String(t).split("\n").map(esc).join("<br>");
const fileUrl = rel => encodeURI(rel.replace(/\\/g, "/"));
let h = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Team answers — ${esc(cardId)}</title><!-- Report ID: ${esc(reportId)} -->
<style>
html,body{margin:0;background:#fff;color:#1b1f24;color-scheme:light}body{padding:16px 24px 40px;font:14px/1.5 -apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}
h1{font-size:22px;margin:0 0 2px}h2{font-size:17px;margin:22px 0 8px}h3{font-size:14px;margin:12px 0 6px}.meta{color:#5b6672;font-size:12px}
table{border-collapse:collapse;width:100%;margin:4px 0 10px}th,td{border:1px solid #d8dee6;padding:5px 8px;text-align:start;vertical-align:top}th{background:#f6f8fa;font-weight:600}
td{unicode-bidi:plaintext}.n{text-align:end;white-space:nowrap;width:1%}.bar{background:#e3e8ee;height:10px;border-radius:5px;min-width:120px}.bar i{display:block;height:10px;border-radius:5px;background:#0b5cad}
.tag{font-size:11px;font-weight:600;padding:1px 8px;border-radius:10px;border:1px solid;margin-inline-start:6px}.b{color:#b3261e;border-color:#b3261e;background:#fdecec}.o{color:#5b6672;border-color:#d8dee6;background:#f6f8fa}.m{color:#0b5cad;border-color:#0b5cad;background:#e7f0fa}
.q{border:1px solid #d8dee6;border-radius:3px;padding:4px 14px 8px;margin:12px 0}.who{color:#1b1f24}.mu{color:#5b6672}img.th{max-width:160px;max-height:110px;border:1px solid #d8dee6;display:block}a{color:#0b5cad}
</style></head><body>
<h1><b>Team answers — ${esc(cardId)}</b></h1>
<div class="meta">Report ID: <b>${esc(reportId)}</b>${cardRef ? " · Card ref: <b>" + esc(cardRef) + "</b>" : ""} · ${N} respondent${N === 1 ? "" : "s"} · merged ${esc(d0.toLocaleString("en-GB"))} · source: ${esc(path.resolve(dir))}</div>`;
h += `<h2><b>Flags</b></h2>` + (flags.length ? `<table><tr><th class="n">Status</th><th>Issue</th><th>Detail</th></tr>${flags.map(f => `<tr><td class="n">${f[0]} ${f[0] === "🔴" ? "Skipped" : f[0] === "🟠" ? "Check" : "Info"}</td><td>${esc(f[1])}</td><td>${esc(f[2])}</td></tr>`).join("")}</table>` : `<div>✅ OK — no anomalies found</div>`);
h += `<h2><b>Respondents</b></h2><table><tr><th class="n">#</th><th>Name / ID</th><th>Exported</th><th class="n">Files</th><th>ZIP</th></tr>${team.map((r, i) => `<tr><td class="n">${i + 1}</td><td><b>${esc(r.name)}</b></td><td>${esc(r.json.exported_at || "")}</td><td class="n">${r.files.length}</td><td>${esc(r.zip)}</td></tr>`).join("")}</table>`;
h += `<h2><b>Answers by question</b></h2>`;
qOrder.forEach(id => {
  const q = qs[id], ks = Object.keys(q.options).sort((a, b) => q.options[b].who.length - q.options[a].who.length);
  h += `<div class="q"><h3><b>${esc(q.question || id)}</b><span class="tag ${q.blocking ? "b" : "o"}">${q.blocking ? "Blocking" : "Optional"}</span>${q.multi ? '<span class="tag m">Multi-choice</span>' : ""}</h3>`;
  h += `<table><tr><th>Answer</th><th class="n">Votes</th><th>Share</th><th>Who</th></tr>${ks.map(k => { const c = q.options[k].who.length; return `<tr><td>${esc(k === "__other" ? "My own answer" : q.options[k].label)} <span class="mu">[${esc(k)}]</span></td><td class="n"><b>${c}</b> / ${N}</td><td><div class="bar"><i style="width:${Math.round(c / N * 100)}%"></i></div></td><td>${esc(q.options[k].who.join(", "))}</td></tr>`; }).join("")}${q.unanswered.length ? `<tr><td class="mu">— no answer</td><td class="n">${q.unanswered.length} / ${N}</td><td></td><td>${esc(q.unanswered.join(", "))}</td></tr>` : ""}</table>`;
  if (q.own.length) h += `<div><b>Own answers</b></div><table>${q.own.map(o => `<tr><td class="n who"><b>${esc(o.who)}</b></td><td>${multi(o.text)}</td></tr>`).join("")}</table>`;
  if (q.answer_notes.length) h += `<div><b>Per-answer comments</b></div><table>${q.answer_notes.map(o => `<tr><td class="n who"><b>${esc(o.who)}</b></td><td class="n">${esc(o.label)}</td><td>${multi(o.text)}</td></tr>`).join("")}</table>`;
  if (q.notes.length) h += `<div><b>Comments</b></div><table>${q.notes.map(o => `<tr><td class="n who"><b>${esc(o.who)}</b></td><td>${multi(o.text)}</td></tr>`).join("")}</table>`;
  h += `</div>`;
});
if (merged.summary_comments.length) h += `<h2><b>Summary comments</b></h2><table>${merged.summary_comments.map(o => `<tr><td class="n who"><b>${esc(o.who)}</b></td><td>${multi(o.text)}</td></tr>`).join("")}</table>`;
h += `<h2><b>Files</b> <span class="mu">(${fileRows.length})</span></h2>` + (fileRows.length ? `<table><tr><th>Who</th><th>Where</th><th>File</th><th class="n">Size</th><th>Preview</th></tr>${fileRows.map(f => `<tr><td><b>${esc(f.who)}</b></td><td>${esc(f.level === "card" ? "card" : f.question + (f.answer ? " / " + f.answer : ""))}</td><td><a href="${fileUrl(f.path)}">${esc(f.name)}</a></td><td class="n">${Math.max(1, Math.round(f.size / 1024))} KB</td><td>${/\.(png|jpe?g|gif|webp|bmp)$/i.test(f.name) ? `<a href="${fileUrl(f.path)}"><img class="th" src="${fileUrl(f.path)}" alt=""></a>` : ""}</td></tr>`).join("")}</table>` : `<div class="mu">No files attached.</div>`);
h += `<p class="meta">Merged JSON: <a href="${fileUrl(path.basename(jsonPath))}">${esc(path.basename(jsonPath))}</a> · AiDecisionCard merge ${VER}</p></body></html>\n`;
fs.writeFileSync(htmlPath, h, "utf8");
console.log("MERGED " + N + " respondent(s) | flags " + flags.length + "\nREPORT " + htmlPath + "\nJSON   " + jsonPath);
if (!noOpen && process.platform === "win32") { cp.exec('start "" "' + htmlPath + '"'); cp.exec('explorer /select,"' + htmlPath + '"'); }
else if (!noOpen) cp.exec((process.platform === "darwin" ? "open" : "xdg-open") + ' "' + htmlPath + '"');
