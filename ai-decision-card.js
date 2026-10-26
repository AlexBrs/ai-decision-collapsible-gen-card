/*! ai-decision-collapsible-gen-card v1.0.0 (AiDecisionCard) | Spec: README.md | Schemas: schema/*.json
 * Usage: AiDecisionCard.render(input, {target:"#el", mode:"inline"|"standalone", lang:"en"|"he"|..., onSubmit:fn})
 * input: JSON object or JSON string - {id, lang, title?, strings?:{<lang>:{...}}, q:[{id, t, x?, m?, b?, c?, n?, o:[{k, l, d?, x?, r?}]}]}
 * Text fields: string or {en:"..", he:".."}. x = explanation bullets. m = multi-choice (default 0). b = blocking (default 1).
 * c = "My own answer" option (default 1). n = per-question comment box (default 1). r = recommended/pre-selected.
 * Output JSON: {artifact_id, engine, lang, exported_at, answers:{id:{question, blocking, multi, answer, answer_label, own_answer, notes}}, summary_comments, missing_blocking}
 * Own answer key = "__other".
 */
(function (g) {
"use strict";
var VER = "1.0.0";
var STR = {
 en:{dir:"ltr",expand:"Expand all",collapse:"Collapse all",rec:"Recommended",blk:"Blocking",opt:"Optional",multi:"Select all that apply",send:"Send answers",ph:"Summary comments (optional)",notes:"Comments (optional)",other:"My own answer",otherPh:"Type your answer",eO:"Type your own answer first",e1:"Choose an answer",eM:"Select at least one option",exp:"Explain",payload:"Answer payload",copy:"Copy JSON",dlj:"Download JSON",dlm:"Download Markdown"},
 he:{dir:"rtl",expand:"הרחב הכל",collapse:"כווץ הכל",rec:"מומלץ",blk:"חוסם",opt:"אופציונלי",multi:"ניתן לבחור כמה",send:"שלח תשובות",ph:"הערות מסכמות (אופציונלי)",notes:"הערות (אופציונלי)",other:"תשובה משלי",otherPh:"הקלד את תשובתך",eO:"יש להקליד תשובה משלך",e1:"יש לבחור תשובה",eM:"יש לבחור לפחות אפשרות אחת",exp:"הסבר",payload:"תשובות",copy:"העתק JSON",dlj:"הורד JSON",dlm:"הורד Markdown"}
};
var CSS = [
".adc{--bg:#fff;--fg:#1b1f24;--mu:#5b6672;--ru:#d8dee6;--ct:#c9d1db;--pa:#f6f8fa;--p2:#e3e8ee;--ac:#0b5cad;--as:#e7f0fa;--ok:#2e7d32;--bd:#b3261e;--bb:#fdecec;color-scheme:light;background:var(--bg);color:var(--fg);font:14px/1.5 -apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;padding:12px;border-radius:4px;box-sizing:border-box}",
".adc *{box-sizing:border-box}.adc button,.adc input,.adc textarea{font:inherit}",
".adc .gbar{display:flex;justify-content:flex-start;margin-bottom:10px}",
".adc .gbtn{display:inline-flex;align-items:center;gap:6px;background:#fff;color:var(--fg);border:1px solid var(--ct);border-radius:2px;padding:4px 10px;font-size:12px;cursor:pointer}",
".adc .reg{border:1px solid var(--ru);border-radius:2px;margin-bottom:12px;background:#fff}",
".adc .rh{display:flex;align-items:center;gap:10px;padding:9px 12px;background:var(--pa);border-bottom:1px solid var(--ru)}.adc .rh .t{flex:1;font-weight:700;font-size:15px}",
".adc .tg{width:24px;height:24px;display:inline-flex;align-items:center;justify-content:center;border:1px solid var(--ct);border-radius:2px;background:#fff;cursor:pointer;padding:0;flex:none;color:var(--fg)}",
".adc svg{width:14px;height:14px;display:block;fill:currentColor}.adc .gbtn svg{width:12px;height:12px}",
".adc .bd{font-size:11px;font-weight:600;padding:1px 8px;border-radius:10px;border:1px solid;white-space:nowrap}.adc .bd.b{color:var(--bd);border-color:var(--bd);background:var(--bb)}.adc .bd.o{color:var(--mu);border-color:var(--ru);background:var(--pa)}.adc .bd.m{color:var(--ac);border-color:var(--ac);background:var(--as)}",
".adc .ex{padding:8px 14px;background:var(--pa);border-bottom:1px solid var(--ru);font-size:13px;color:var(--mu);line-height:1.6}",
".adc ul{margin:0;padding-inline-start:18px}.adc li{unicode-bidi:plaintext;text-align:start}",
".adc .ans{margin:8px 12px 10px;margin-inline-start:23px;padding-inline-start:12px;border-inline-start:2px solid var(--ct)}",
".adc .grp{display:grid;grid-template-columns:42px minmax(0,1fr);grid-template-rows:auto auto;border:1px solid var(--ru);border-radius:2px;margin-top:6px;background:#fff}.adc .grp.on{border-color:var(--ac);background:var(--as)}",
".adc .col{grid-column:1;grid-row:1/3;border-inline-end:1px solid var(--ru)}.adc .grp.on .col{border-inline-end-color:var(--ac)}",
".adc .tc{grid-column:1;grid-row:1;display:flex;align-items:center;justify-content:center}",
".adc .grp label{grid-column:2;grid-row:1;display:flex;align-items:center;gap:10px;padding:7px 10px;cursor:pointer}",
".adc .grp input{width:16px;height:16px;accent-color:var(--ac);margin:0;flex:none}",
".adc .ol b{font-weight:600}.adc .ol .d{display:block;font-size:12px;color:var(--mu)}.adc .rec{color:var(--ok);font-size:12px;font-weight:600;margin-inline-start:6px}",
".adc .oex{grid-column:2;grid-row:2;margin:0 10px 8px;padding:6px 12px;background:var(--pa);border:1px solid var(--p2);font-size:13px;color:var(--mu);line-height:1.55}",
".adc .err{color:var(--bd);font-size:13px;margin:0 12px 8px;margin-inline-start:37px}",
".adc .oti{grid-column:2;grid-row:2;display:block;width:calc(100% - 20px);margin:0 10px 8px;border:1px solid var(--ct);border-radius:2px;padding:6px 8px;background:#fff;color:var(--fg)}",
".adc .qn{display:block;width:calc(100% - 49px);margin-block:0 10px;margin-inline:37px 12px;border:1px solid var(--ct);border-radius:2px;padding:5px 8px;font-size:13px;background:#fff;color:var(--fg)}",
".adc .ft{display:flex;gap:10px;align-items:center}.adc .ft input{flex:1;background:#fff;color:var(--fg);border:1px solid var(--ct);border-radius:2px;padding:7px 10px}",
".adc .send{background:var(--ac);color:#fff;border:1px solid var(--ac);padding:7px 16px;border-radius:2px;font-weight:600;cursor:pointer;white-space:nowrap}",
".adc .out{margin-top:14px;border:1px solid var(--ru);background:var(--pa);padding:10px 12px}.adc .out h2{font-size:14px;font-weight:700;margin:0 0 6px}",
".adc .out pre{white-space:pre-wrap;word-break:break-word;background:#fff;border:1px solid var(--ru);padding:8px;font-size:12px;margin:0 0 8px}",
".adc button.tg,.adc button.gbtn,.adc button.send{min-width:0!important;min-height:0!important;box-shadow:none!important;transform:none!important;line-height:1.2!important}",
".adc button.tg{width:24px!important;height:24px!important;padding:0!important;background:#fff!important;border:1px solid var(--ct)!important;color:var(--fg)!important;flex:none!important}",
".adc button.gbtn{padding:4px 10px!important;background:#fff!important;border:1px solid var(--ct)!important;color:var(--fg)!important;height:auto!important}",
".adc button.send{padding:7px 16px!important;background:var(--ac)!important;border:1px solid var(--ac)!important;color:#fff!important;height:auto!important}",
".adc svg{flex:none!important;width:14px!important;height:14px!important;min-width:14px!important}.adc .gbtn svg{width:12px!important;height:12px!important;min-width:12px!important}",
"@media print{.adc .gbar,.adc .ft,.adc .out{display:none}}"
].join("");
var SVG = {
 r:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6z"/></svg>',
 l:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6z"/></svg>',
 d:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6z"/></svg>'
};
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];});}
function injectCss(){if(document.getElementById("adc-css"))return;var s=document.createElement("style");s.id="adc-css";s.textContent=CSS;(document.head||document.documentElement).appendChild(s);}
function render(data, opts) {
 if (typeof data === "string") data = JSON.parse(data);
 opts = opts || {}; injectCss();
 var root = typeof opts.target === "string" ? document.querySelector(opts.target) : opts.target;
 if (!root) { root = document.createElement("div"); document.body.appendChild(root); }
 var mode = opts.mode || (typeof g.sendPrompt === "function" ? "inline" : "standalone");
 var L = opts.lang || data.lang || "en";
 var S = {}; [STR.en, STR[L] || {}, (data.strings || {})[L] || {}].forEach(function (o) { for (var k in o) S[k] = o[k]; });
 var Q = data.q || [], OTH = "__other";
 function tx(v) { if (v == null) return ""; if (typeof v === "string" || Array.isArray(v)) return v; return v[L] != null ? v[L] : (v.en != null ? v.en : ""); }
 function arr(v) { var r = tx(v); return Array.isArray(r) ? r : (r ? [r] : []); }
 function blk(q) { return q.b !== false && q.b !== 0; }
 function hasOther(q) { return q.c !== false && q.c !== 0; }
 function hasNotes(q) { return q.n !== false && q.n !== 0; }
 var open = {}, flip = false, cm = "", notes = {}, other = {}, errs = {};
 var sel = Q.map(function (q) { var s = {}; q.o.forEach(function (o) { if (o.r) s[o.k] = 1; }); if (!q.m) { var ks = Object.keys(s); if (ks.length > 1) { s = {}; s[ks[0]] = 1; } } return s; });
 var hasEx = Q.some(function (q) { return arr(q.x).length || q.o.some(function (o) { return arr(o.x).length; }); });
 function closed() { return S.dir === "rtl" ? SVG.l : SVG.r; }
 function tg(k) { return '<button type="button" class="tg" data-k="' + esc(k) + '" aria-expanded="' + !!open[k] + '" aria-label="' + esc(S.exp) + '">' + (open[k] ? SVG.d : closed()) + '</button>'; }
 function ul(a) { return "<ul>" + a.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>"; }
 function optRow(q, qi, k, label, d, rec, ox, extra) {
  var on = !!sel[qi][k], key = q.id + "_" + k;
  return '<div class="grp' + (on ? " on" : "") + '"><div class="col"></div><div class="tc">' + (ox.length ? tg(key) : "") + '</div><label><input type="' + (q.m ? "checkbox" : "radio") + '" name="adc_' + esc(q.id) + '" data-q="' + qi + '" value="' + esc(k) + '"' + (on ? " checked" : "") + '><span class="ol"><b>' + esc(label) + "</b>" + (rec ? '<span class="rec">' + esc(S.rec) + "</span>" : "") + (d ? '<span class="d">' + esc(d) + "</span>" : "") + "</span></label>" + (ox.length && open[key] ? '<div class="oex">' + ul(ox) + "</div>" : "") + (extra || "") + "</div>";
 }
 function draw() {
  root.className = "adc"; root.dir = S.dir; root.lang = L;
  var h = hasEx ? '<div class="gbar"><button type="button" class="gbtn" data-fl="1">' + (flip ? closed() : SVG.d) + esc(flip ? S.collapse : S.expand) + "</button></div>" : "";
  Q.forEach(function (q, qi) {
   var qx = arr(q.x);
   h += '<div class="reg"><div class="rh">' + (qx.length ? tg(q.id) : "") + '<span class="t">' + esc(tx(q.t)) + "</span>" + (q.m ? '<span class="bd m">' + esc(S.multi) + "</span>" : "") + (blk(q) ? '<span class="bd b">' + esc(S.blk) + "</span>" : '<span class="bd o">' + esc(S.opt) + "</span>") + "</div>";
   if (qx.length && open[q.id]) h += '<div class="ex">' + ul(qx) + "</div>";
   h += '<div class="ans">';
   q.o.forEach(function (o) { h += optRow(q, qi, o.k, tx(o.l), tx(o.d), o.r, arr(o.x)); });
   if (hasOther(q)) h += optRow(q, qi, OTH, S.other, "", false, [], sel[qi][OTH] ? '<input type="text" class="oti" data-ot="' + esc(q.id) + '" placeholder="' + esc(S.otherPh) + '" value="' + esc(other[q.id] || "") + '">' : "");
   h += "</div>" + (errs[q.id] ? '<div class="err">' + esc(errs[q.id] === 2 ? S.eO : (q.m ? S.eM : S.e1)) + "</div>" : "");
   if (hasNotes(q)) h += '<input type="text" class="qn" data-n="' + esc(q.id) + '" placeholder="' + esc(S.notes) + '" value="' + esc(notes[q.id] || "") + '">';
   h += "</div>";
  });
  h += '<div class="ft"><input type="text" data-cm="1" placeholder="' + esc(S.ph) + '" value="' + esc(cm) + '"><button type="button" class="send" data-send="1">' + esc(S.send) + " &#8599;</button></div>";
  if (mode === "standalone") h += '<div class="out" hidden><h2>' + esc(S.payload) + '</h2><pre data-o="line"></pre><pre data-o="json"></pre><button type="button" class="gbtn" data-a="copy">' + esc(S.copy) + '</button> <button type="button" class="gbtn" data-a="dlj">' + esc(S.dlj) + '</button> <button type="button" class="gbtn" data-a="dlm">' + esc(S.dlm) + "</button></div>";
  root.innerHTML = h;
 }
 function labelOf(q, k) { if (k === OTH) return S.other; var o = q.o.filter(function (x) { return x.k === k; })[0]; return o ? tx(o.l) : k; }
 function payload() {
  var answers = {}, missing = [];
  Q.forEach(function (q, i) {
   var order = q.o.map(function (o) { return o.k; });
   var ks = Object.keys(sel[i]).filter(function (k) { return k === OTH ? hasOther(q) : true; });
   ks.sort(function (a, b) { return (a === OTH ? 1e9 : order.indexOf(a)) - (b === OTH ? 1e9 : order.indexOf(b)); });
   if (blk(q) && !ks.length) missing.push(q.id);
   var e = { question: tx(q.t), blocking: blk(q), multi: !!q.m, answer: q.m ? ks : (ks[0] || null), answer_label: q.m ? ks.map(function (k) { return labelOf(q, k); }) : (ks[0] ? labelOf(q, ks[0]) : null), own_answer: sel[i][OTH] ? (other[q.id] || "").trim() : "", notes: (notes[q.id] || "").trim() };
   answers[q.id] = e;
  });
  var line = Q.map(function (q) { var e = answers[q.id], ks = Array.isArray(e.answer) ? e.answer : (e.answer ? [e.answer] : []); return q.id + " = " + ks.map(function (k) { return k === OTH ? "Own: " + e.own_answer : labelOf(q, k) + " [" + k + "]"; }).join(", ") + (e.notes ? " (notes: " + e.notes + ")" : ""); }).join(" | ");
  if (cm.trim()) line += " | Summary: " + cm.trim();
  var json = { artifact_id: data.id || "", engine: "AiDecisionCard " + VER, lang: L, exported_at: new Date().toISOString(), answers: answers, summary_comments: cm.trim(), missing_blocking: missing };
  return { line: line, json: json };
 }
 function md(p) {
  var s = "# **Answers — " + (p.json.artifact_id || "") + "**\n\nExported: " + p.json.exported_at + "\n\n| ID | Question | Blocking | Answer | Own answer | Notes |\n|---|---|---|---|---|---|\n";
  Q.forEach(function (q) { var e = p.json.answers[q.id], a = Array.isArray(e.answer_label) ? e.answer_label.join("; ") : (e.answer_label || "—"); s += "| " + q.id + " | " + e.question + " | " + (e.blocking ? "yes" : "no") + " | " + a + " | " + e.own_answer + " | " + e.notes.replace(/\n/g, " ") + " |\n"; });
  return s + "\n## **Summary Comments**\n\n" + (p.json.summary_comments || "—") + "\n";
 }
 function dl(name, text, type) { var a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([text], { type: type })); a.download = name; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500); }
 var last = null;
 root.addEventListener("input", function (e) { var t = e.target; if (t.dataset.cm) cm = t.value; if (t.dataset.n) notes[t.dataset.n] = t.value; if (t.dataset.ot) { other[t.dataset.ot] = t.value; for (var i = 0; i < Q.length; i++) if (Q[i].id === t.dataset.ot && errs[Q[i].id] === 2) { delete errs[Q[i].id]; var er = t.closest(".reg").querySelector(".err"); if (er) er.remove(); } } });
 root.addEventListener("change", function (e) { var i = e.target; if (!i.dataset || i.dataset.q == null) return; var qi = +i.dataset.q; if (Q[qi].m) { if (i.checked) sel[qi][i.value] = 1; else delete sel[qi][i.value]; } else { sel[qi] = {}; sel[qi][i.value] = 1; } delete errs[Q[qi].id]; draw(); if (i.value === OTH && i.checked) { var f = root.querySelector('[data-ot="' + Q[qi].id + '"]'); if (f) f.focus(); } });
 root.addEventListener("click", function (e) {
  var t = e.target.closest("[data-k],[data-fl],[data-send],[data-a]"); if (!t) return;
  if (t.dataset.k) { open[t.dataset.k] = !open[t.dataset.k]; draw(); return; }
  if (t.dataset.fl) { flip = !flip; open = {}; if (flip) Q.forEach(function (q) { open[q.id] = 1; q.o.forEach(function (o) { open[q.id + "_" + o.k] = 1; }); }); draw(); return; }
  if (t.dataset.send) {
   errs = {}; Q.forEach(function (q, i) { if (blk(q) && !Object.keys(sel[i]).length) errs[q.id] = 1; else if (sel[i][OTH] && !(other[q.id] || "").trim()) errs[q.id] = 2; });
   if (Object.keys(errs).length) { draw(); return; }
   last = payload();
   if (typeof opts.onSubmit === "function") { opts.onSubmit(last); return; }
   if (mode === "inline" && typeof g.sendPrompt === "function") { g.sendPrompt(last.line + "\n```json\n" + JSON.stringify(last.json) + "\n```"); return; }
   var out = root.querySelector(".out"); if (out) { out.hidden = false; out.querySelector('[data-o="line"]').textContent = last.line; out.querySelector('[data-o="json"]').textContent = JSON.stringify(last.json, null, 2); }
   return;
  }
  if (t.dataset.a && last) {
   var js = JSON.stringify(last.json, null, 2), base = (data.id || "CARD") + "_ANSWERS";
   if (t.dataset.a === "copy") { try { navigator.clipboard.writeText(js); } catch (x) {} }
   if (t.dataset.a === "dlj") dl(base + ".json", js, "application/json");
   if (t.dataset.a === "dlm") dl(base + ".md", md(last), "text/markdown");
  }
 });
 draw();
 return { payload: payload, redraw: draw };
}
g.AiDecisionCard = { render: render, version: VER, strings: STR };
})(typeof window !== "undefined" ? window : this);
