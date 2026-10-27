/*! ai-decision-collapsible-gen-card v1.1.0 (AiDecisionCard) | Spec: README.md | Schemas: schema/*.json
 * Usage: AiDecisionCard.render(input, {target:"#el", mode:"inline"|"standalone", lang, onSubmit:fn, viewer:url|false, state, speechLang})
 * input: JSON object or JSON string - {id, lang, title?, strings?, a?, viewer?, q:[{id, t, x?, m?, b?, c?, n?, a?, o:[{k, l, d?, x?, r?}]}]}
 * Text: string or {en:"..", he:".."}. x = explanation bullets. m = multi-choice (0). b = blocking (1). c = "My own answer" (1).
 * n = per-question comment box (1). a = attach buttons (1; card-level input.a, question/answer-level q[].a). r = recommended.
 * Output JSON: {artifact_id, engine, lang, exported_at, answers:{id:{question, blocking, multi, answer, answer_label, own_answer, notes}},
 *               attachments:[{level, question?, answer?, name, size, type, delivery:"chat"|"inbox"|"download", saved_as?}], summary_comments, missing_blocking}
 * Files never go inside the JSON. Inline (chat): files are listed; the user pastes/drops them into the chat after Send.
 * Standalone (browser): Ctrl+V pastes screenshots; Send saves answers.json, answers.md and the real files into a chosen inbox folder.
 * Own answer key = "__other". Keys: Enter / Shift+Enter = new line, Ctrl+Enter = send.
 */
(function (g) {
"use strict";
var VER = "1.1.0", VIEWER = "https://alexbrs.github.io/ai-decision-collapsible-gen-card/";
var STR = {
 en:{dir:"ltr",expand:"Expand all",collapse:"Collapse all",rec:"Recommended",blk:"Blocking",opt:"Optional",multi:"Select all that apply",send:"Send answers",ph:"Summary comments (optional)",notes:"Comments (optional)",other:"My own answer",otherPh:"Type your answer",eO:"Type your own answer first",e1:"Choose an answer",eM:"Select at least one option",exp:"Explain",payload:"Answer payload",copy:"Copy JSON",dlj:"Download JSON",dlm:"Download Markdown",open:"Open in browser",attach:"Attach",mic:"Dictate",micOn:"Listening… click to stop",micErr:"Microphone not available here — use Windows voice typing (Win+H)",rm:"Remove",keys:"Enter = new line · Ctrl+Enter = send",winh:"Dictate: press Win+H in any box",paste:"Ctrl+V pastes a screenshot",chatFile:"after Send, paste/drop it into the chat",files:"Files",chatFiles:"Files to paste into the chat next",saving:"Saving…",saved:"Saved to {p} — tell Claude it is there",saveCancel:"Not saved — press Send again and choose the inbox folder",saveDl:"Folder saving not available — files downloaded to your Downloads folder",pick:"Choose your inbox folder"},
 he:{dir:"rtl",expand:"הרחב הכל",collapse:"כווץ הכל",rec:"מומלץ",blk:"חוסם",opt:"אופציונלי",multi:"ניתן לבחור כמה",send:"שלח תשובות",ph:"הערות מסכמות (אופציונלי)",notes:"הערות (אופציונלי)",other:"תשובה משלי",otherPh:"הקלד את תשובתך",eO:"יש להקליד תשובה משלך",e1:"יש לבחור תשובה",eM:"יש לבחור לפחות אפשרות אחת",exp:"הסבר",payload:"תשובות",copy:"העתק JSON",dlj:"הורד JSON",dlm:"הורד Markdown",open:"פתח בדפדפן",attach:"צרף",mic:"הכתבה",micOn:"מקשיב… לחץ לעצירה",micErr:"המיקרופון לא זמין כאן — השתמש בהקלדה קולית של Windows (Win+H)",rm:"הסר",keys:"Enter = שורה חדשה · Ctrl+Enter = שליחה",winh:"הכתבה: Win+H בכל תיבה",paste:"Ctrl+V מדביק צילום מסך",chatFile:"אחרי השליחה הדבק/גרור אותו לצ'אט",files:"קבצים",chatFiles:"קבצים להדבקה בצ'אט",saving:"שומר…",saved:"נשמר ב-{p} — עדכן את Claude",saveCancel:"לא נשמר — לחץ שוב שלח ובחר את תיקיית ה-inbox",saveDl:"שמירה לתיקייה לא זמינה — הקבצים ירדו לתיקיית ההורדות",pick:"בחר את תיקיית ה-inbox"}
};
var CSS = [
".adc{--bg:#fff;--fg:#1b1f24;--mu:#5b6672;--ru:#d8dee6;--ct:#c9d1db;--pa:#f6f8fa;--p2:#e3e8ee;--ac:#0b5cad;--as:#e7f0fa;--ok:#2e7d32;--bd:#b3261e;--bb:#fdecec;--wn:#8a5a00;color-scheme:light;background:var(--bg);color:var(--fg);font:14px/1.5 -apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;padding:12px;border-radius:4px;box-sizing:border-box}",
".adc *{box-sizing:border-box}.adc button,.adc input,.adc textarea{font:inherit}",
".adc .gbar{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-start;margin-bottom:10px}",
".adc .gbtn{display:inline-flex;align-items:center;gap:6px;background:#fff;color:var(--fg);border:1px solid var(--ct);border-radius:2px;padding:4px 10px;font-size:12px;cursor:pointer}",
".adc .reg{border:1px solid var(--ru);border-radius:2px;margin-bottom:12px;background:#fff}",
".adc .rh{display:flex;align-items:center;gap:10px;padding:9px 12px;background:var(--pa);border-bottom:1px solid var(--ru)}.adc .rh .t{flex:1;font-weight:700;font-size:15px}",
".adc .tg{width:24px;height:24px;display:inline-flex;align-items:center;justify-content:center;border:1px solid var(--ct);border-radius:2px;background:#fff;cursor:pointer;padding:0;flex:none;color:var(--fg)}",
".adc svg{width:14px;height:14px;display:block;fill:currentColor}",
".adc .bd{font-size:11px;font-weight:600;padding:1px 8px;border-radius:10px;border:1px solid;white-space:nowrap}.adc .bd.b{color:var(--bd);border-color:var(--bd);background:var(--bb)}.adc .bd.o{color:var(--mu);border-color:var(--ru);background:var(--pa)}.adc .bd.m{color:var(--ac);border-color:var(--ac);background:var(--as)}",
".adc .ex{padding:8px 14px;background:var(--pa);border-bottom:1px solid var(--ru);font-size:13px;color:var(--mu);line-height:1.6}",
".adc ul{margin:0;padding-inline-start:18px}.adc li{unicode-bidi:plaintext;text-align:start}",
".adc .ans{margin:8px 12px 10px;margin-inline-start:23px;padding-inline-start:12px;border-inline-start:2px solid var(--ct)}",
".adc .grp{display:grid;grid-template-columns:42px minmax(0,1fr);grid-template-rows:auto auto auto auto;border:1px solid var(--ru);border-radius:2px;margin-top:6px;background:#fff}.adc .grp.on{border-color:var(--ac);background:var(--as)}",
".adc .col{grid-column:1;grid-row:1/5;border-inline-end:1px solid var(--ru)}.adc .grp.on .col{border-inline-end-color:var(--ac)}",
".adc .tc{grid-column:1;grid-row:1;display:flex;align-items:center;justify-content:center}",
".adc .grp label{grid-column:2;grid-row:1;display:flex;align-items:center;gap:10px;padding:7px 10px;cursor:pointer}",
".adc .grp input[type=radio],.adc .grp input[type=checkbox]{width:16px!important;height:16px!important;min-width:16px!important;accent-color:var(--ac);margin:0!important;padding:0!important;flex:none}",
".adc .ol b{font-weight:600}.adc .ol .d{display:block;font-size:12px;color:var(--mu)}.adc .rec{color:var(--ok);font-size:12px;font-weight:600;margin-inline-start:6px}",
".adc .oex{grid-column:2;grid-row:2;margin:0 10px 8px;padding:6px 12px;background:var(--pa);border:1px solid var(--p2);font-size:13px;color:var(--mu);line-height:1.55}",
".adc .ow{grid-column:2;grid-row:3;margin:0 10px 8px;min-width:0}.adc .aw{grid-column:2;grid-row:4;margin:0 10px 8px;min-width:0}",
".adc .err{color:var(--bd);font-size:13px;margin:0 12px 8px;margin-inline-start:37px}",
".adc .qx{margin:0 12px 10px;margin-inline-start:37px;min-width:0}",
".adc .fw{display:block;min-width:0}",
".adc textarea.tx{display:block!important;width:100%!important;max-width:100%!important;min-width:0!important;margin:0!important;padding:6px 8px!important;min-height:36px!important;resize:vertical!important;overflow-y:auto;box-sizing:border-box!important;border:1px solid var(--ct)!important;border-radius:2px!important;background:#fff!important;color:var(--fg)!important;font-size:13px!important;line-height:1.45!important;box-shadow:none!important;unicode-bidi:plaintext}",
".adc textarea.tx:focus{outline:2px solid var(--as)!important;border-color:var(--ac)!important}",
".adc .tb{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-top:4px}",
".adc .chip{display:inline-flex;align-items:center;gap:4px;font-size:12px;border:1px solid var(--ru);background:var(--pa);border-radius:10px;padding:1px 4px 1px 8px;max-width:100%}",
".adc .chip .nm{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:240px;unicode-bidi:plaintext}.adc .chip .st{color:var(--mu)}.adc .chip .st.w{color:var(--wn)}",
".adc .hint{font-size:11px;color:var(--mu);margin-top:4px}.adc .merr{font-size:12px;color:var(--bd)}.adc .svst{font-size:13px;margin:6px 0;font-weight:600}.adc .svst.ok{color:var(--ok)}.adc .svst.w{color:var(--wn)}",
".adc .ft{display:flex;gap:10px;align-items:flex-start}.adc .ft .fw{flex:1;min-width:0}",
".adc input[type=file]{display:none!important}",
".adc .out{margin-top:14px;border:1px solid var(--ru);background:var(--pa);padding:10px 12px}.adc .out h2{font-size:14px;font-weight:700;margin:0 0 6px}",
".adc .out pre{white-space:pre-wrap;word-break:break-word;background:#fff;border:1px solid var(--ru);padding:8px;font-size:12px;margin:0 0 8px}",
".adc button.tg,.adc button.gbtn,.adc button.send,.adc button.x{min-width:0!important;min-height:0!important;box-shadow:none!important;transform:none!important;line-height:1.2!important;width:auto;cursor:pointer}",
".adc button.tg{width:24px!important;height:24px!important;padding:0!important;background:#fff!important;border:1px solid var(--ct)!important;color:var(--fg)!important;flex:none!important}",
".adc button.gbtn{padding:4px 10px!important;background:#fff!important;border:1px solid var(--ct)!important;color:var(--fg)!important;height:auto!important}",
".adc button.gbtn.sm{padding:2px 8px!important;font-size:12px!important}",
".adc button.gbtn.mic.on{background:var(--bb)!important;border-color:var(--bd)!important;color:var(--bd)!important}",
".adc button.x{width:18px!important;height:18px!important;padding:0!important;border:0!important;background:transparent!important;color:var(--mu)!important;display:inline-flex;align-items:center;justify-content:center}",
".adc button.send{padding:7px 16px!important;background:var(--ac)!important;border:1px solid var(--ac)!important;color:#fff!important;height:auto!important;font-weight:600;white-space:nowrap}",
".adc svg{flex:none!important;width:14px!important;height:14px!important;min-width:14px!important}.adc .gbtn svg,.adc button.x svg{width:12px!important;height:12px!important;min-width:12px!important}",
"@media print{.adc .gbar,.adc .ft,.adc .out,.adc .tb{display:none}}"
].join("");
var SVG = {
 r:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6z"/></svg>',
 l:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6z"/></svg>',
 d:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6z"/></svg>',
 mic:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11z"/></svg>',
 clip:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.5 6v11.5a4 4 0 0 1-8 0V5a2.5 2.5 0 0 1 5 0v10.5a1 1 0 0 1-2 0V6H10v9.5a2.5 2.5 0 0 0 5 0V5a4 4 0 0 0-8 0v12.5a5.5 5.5 0 0 0 11 0V6z"/></svg>',
 ext:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3zM19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2z"/></svg>',
 x:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>'
};
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];});}
function injectCss(){if(document.getElementById("adc-css"))return;var s=document.createElement("style");s.id="adc-css";s.textContent=CSS;(document.head||document.documentElement).appendChild(s);}
function b64u(str){var b=new TextEncoder().encode(str),s="";for(var i=0;i<b.length;i++)s+=String.fromCharCode(b[i]);return btoa(s).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");}
function unb64u(s){s=s.replace(/-/g,"+").replace(/_/g,"/");while(s.length%4)s+="=";var bin=atob(s),b=new Uint8Array(bin.length);for(var i=0;i<bin.length;i++)b[i]=bin.charCodeAt(i);return new TextDecoder().decode(b);}
function render(data, opts) {
 if (typeof data === "string") data = JSON.parse(data);
 opts = opts || {}; injectCss();
 var root = typeof opts.target === "string" ? document.querySelector(opts.target) : opts.target;
 if (!root) { root = document.createElement("div"); document.body.appendChild(root); }
 var mode = opts.mode || (typeof g.sendPrompt === "function" ? "inline" : "standalone");
 var L = opts.lang || data.lang || "en";
 var S = {}; [STR.en, STR[L] || {}, (data.strings || {})[L] || {}].forEach(function (o) { for (var k in o) S[k] = o[k]; });
 var Q = data.q || [], OTH = "__other";
 var SR = g.SpeechRecognition || g.webkitSpeechRecognition;
 function on(v, d) { return v == null ? d : !(v === false || v === 0); }
 function tx(v) { if (v == null) return ""; if (typeof v === "string" || Array.isArray(v)) return v; return v[L] != null ? v[L] : (v.en != null ? v.en : ""); }
 function arr(v) { var r = tx(v); return Array.isArray(r) ? r : (r ? [r] : []); }
 function blk(q) { return on(q.b, true); }
 function hasOther(q) { return on(q.c, true); }
 function hasNotes(q) { return on(q.n, true); }
 function attQ(q) { return on(q.a, true); }
 var cardAtt = on(data.a, true);
 var viewer = opts.viewer === false || data.viewer === false ? null : (opts.viewer || data.viewer || VIEWER);
 var st = opts.state || {};
 var open = {}, flip = false, cm = st.cm || "", notes = st.notes || {}, other = st.other || {}, errs = {}, heights = {}, micErr = {};
 var files = [], fseq = 0, rec = null, recFid = null, last = null;
 var sel = Q.map(function (q) {
  var s = {};
  if (st.sel && st.sel[q.id]) st.sel[q.id].forEach(function (k) { s[k] = 1; });
  else q.o.forEach(function (o) { if (o.r) s[o.k] = 1; });
  if (!q.m) { var ks = Object.keys(s); if (ks.length > 1) { s = {}; s[ks[0]] = 1; } }
  return s;
 });
 var hasEx = Q.some(function (q) { return arr(q.x).length || q.o.some(function (o) { return arr(o.x).length; }); });
 function closed() { return S.dir === "rtl" ? SVG.l : SVG.r; }
 function tg(k) { return '<button type="button" class="tg" data-k="' + esc(k) + '" aria-expanded="' + !!open[k] + '" aria-label="' + esc(S.exp) + '">' + (open[k] ? SVG.d : closed()) + '</button>'; }
 function ul(a) { return "<ul>" + a.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>"; }
 function getVal(fid) { var p = fid.split(":"), k = p.slice(1).join(":"); return p[0] === "n" ? (notes[k] || "") : p[0] === "ot" ? (other[k] || "") : cm; }
 function setVal(fid, v) { var p = fid.split(":"), k = p.slice(1).join(":"); if (p[0] === "n") notes[k] = v; else if (p[0] === "ot") other[k] = v; else cm = v; }
 function chips(t) {
  return files.filter(function (f) { return f.t === t; }).map(function (f) {
   return '<span class="chip"><span class="nm" title="' + esc(f.name) + '">' + esc(f.name) + '</span>' + (mode === "inline" ? '<span class="st w">' + esc(S.chatFile) + "</span>" : '<span class="st">' + Math.max(1, Math.round(f.size / 1024)) + " KB</span>") + '<button type="button" class="x" data-rmf="' + f.id + '" aria-label="' + esc(S.rm) + '">' + SVG.x + "</button></span>";
  }).join("");
 }
 function attBtn(t) { return '<button type="button" class="gbtn sm" data-att="' + esc(t) + '">' + SVG.clip + esc(S.attach) + '</button><input type="file" multiple data-fin="' + esc(t) + '">'; }
 function tools(fid, t) {
  var h = "";
  if (fid && SR && mode === "standalone") h += '<button type="button" class="gbtn sm mic' + (recFid === fid ? " on" : "") + '" data-mic="' + esc(fid) + '">' + SVG.mic + esc(recFid === fid ? S.micOn : S.mic) + "</button>";
  if (t) h += attBtn(t) + chips(t);
  if (fid && micErr[fid]) h += '<span class="merr">' + esc(micErr[fid]) + "</span>";
  return h ? '<div class="tb">' + h + "</div>" : "";
 }
 function field(fid, ph, t) { return '<div class="fw"><textarea class="tx" rows="1" data-fid="' + esc(fid) + '" placeholder="' + esc(ph) + '">' + esc(getVal(fid)) + "</textarea>" + tools(fid, t) + "</div>"; }
 function optRow(q, qi, k, label, d, rec_, ox) {
  var isOn = !!sel[qi][k], key = q.id + "_" + k;
  var h = '<div class="grp' + (isOn ? " on" : "") + '"><div class="col"></div><div class="tc">' + (ox.length ? tg(key) : "") + '</div><label><input type="' + (q.m ? "checkbox" : "radio") + '" name="adc_' + esc(q.id) + '" data-q="' + qi + '" value="' + esc(k) + '"' + (isOn ? " checked" : "") + '><span class="ol"><b>' + esc(label) + "</b>" + (rec_ ? '<span class="rec">' + esc(S.rec) + "</span>" : "") + (d ? '<span class="d">' + esc(d) + "</span>" : "") + "</span></label>";
  if (ox.length && open[key]) h += '<div class="oex">' + ul(ox) + "</div>";
  if (k === OTH && isOn) h += '<div class="ow">' + field("ot:" + q.id, S.otherPh, null) + "</div>";
  if (isOn && attQ(q)) h += '<div class="aw"><div class="tb">' + attBtn("a|" + q.id + "|" + k) + chips("a|" + q.id + "|" + k) + "</div></div>";
  return h + "</div>";
 }
 function fit(t) { t.style.height = "auto"; var h = t.scrollHeight + 2, s = heights[t.getAttribute("data-fid")] || 0; t.style.height = Math.max(h, s, 36) + "px"; }
 function draw() {
  root.className = "adc"; root.dir = S.dir; root.lang = L;
  var bar = (hasEx ? '<button type="button" class="gbtn" data-fl="1">' + (flip ? closed() : SVG.d) + esc(flip ? S.collapse : S.expand) + "</button>" : "") + (viewer && mode === "inline" ? '<button type="button" class="gbtn" data-open="1">' + SVG.ext + esc(S.open) + "</button>" : "");
  var h = bar ? '<div class="gbar">' + bar + "</div>" : "";
  Q.forEach(function (q, qi) {
   var qx = arr(q.x);
   h += '<div class="reg"><div class="rh">' + (qx.length ? tg(q.id) : "") + '<span class="t">' + esc(tx(q.t)) + "</span>" + (q.m ? '<span class="bd m">' + esc(S.multi) + "</span>" : "") + (blk(q) ? '<span class="bd b">' + esc(S.blk) + "</span>" : '<span class="bd o">' + esc(S.opt) + "</span>") + "</div>";
   if (qx.length && open[q.id]) h += '<div class="ex">' + ul(qx) + "</div>";
   h += '<div class="ans">';
   q.o.forEach(function (o) { h += optRow(q, qi, o.k, tx(o.l), tx(o.d), o.r, arr(o.x)); });
   if (hasOther(q)) h += optRow(q, qi, OTH, S.other, "", false, []);
   h += "</div>" + (errs[q.id] ? '<div class="err">' + esc(errs[q.id] === 2 ? S.eO : (q.m ? S.eM : S.e1)) + "</div>" : "");
   var qt = attQ(q) ? "q|" + q.id + "|" : null;
   if (hasNotes(q)) h += '<div class="qx">' + field("n:" + q.id, S.notes, qt) + "</div>";
   else if (qt) h += '<div class="qx"><div class="tb">' + attBtn(qt) + chips(qt) + "</div></div>";
   h += "</div>";
  });
  h += '<div class="ft">' + field("cm:", S.ph, cardAtt ? "c||" : null) + '<button type="button" class="send" data-send="1">' + esc(S.send) + " &#8599;</button></div><div class=\"hint\">" + esc(S.keys) + " · " + esc(mode === "inline" ? S.winh : S.paste) + "</div>";
  if (mode === "standalone") h += '<div class="svst" data-svst="1" hidden></div><div class="out" hidden><h2>' + esc(S.payload) + '</h2><pre data-o="line"></pre><pre data-o="json"></pre><button type="button" class="gbtn" data-a="copy">' + esc(S.copy) + '</button> <button type="button" class="gbtn" data-a="dlj">' + esc(S.dlj) + '</button> <button type="button" class="gbtn" data-a="dlm">' + esc(S.dlm) + "</button></div>";
  var ae = document.activeElement, keep = ae && ae.matches && ae.matches("textarea.tx") && root.contains(ae) ? { f: ae.getAttribute("data-fid"), s: ae.selectionStart, e: ae.selectionEnd } : null;
  root.innerHTML = h;
  [].forEach.call(root.querySelectorAll("textarea.tx"), fit);
  if (keep) { var n = root.querySelector('textarea[data-fid="' + keep.f + '"]'); if (n) { n.focus(); try { n.setSelectionRange(keep.s, keep.e); } catch (x) {} } }
 }
 function labelOf(q, k) { if (k === OTH) return S.other; var o = q.o.filter(function (x) { return x.k === k; })[0]; return o ? tx(o.l) : k; }
 function liveFiles() {
  return files.filter(function (f) {
   if (f.level !== "answer") return true;
   for (var i = 0; i < Q.length; i++) if (Q[i].id === f.question) return !!sel[i][f.answer];
   return false;
  });
 }
 function payload() {
  var answers = {}, missing = [];
  Q.forEach(function (q, i) {
   var order = q.o.map(function (o) { return o.k; });
   var ks = Object.keys(sel[i]).filter(function (k) { return k === OTH ? hasOther(q) : true; });
   ks.sort(function (a, b) { return (a === OTH ? 1e9 : order.indexOf(a)) - (b === OTH ? 1e9 : order.indexOf(b)); });
   if (blk(q) && !ks.length) missing.push(q.id);
   answers[q.id] = { question: tx(q.t), blocking: blk(q), multi: !!q.m, answer: q.m ? ks : (ks[0] || null), answer_label: q.m ? ks.map(function (k) { return labelOf(q, k); }) : (ks[0] ? labelOf(q, ks[0]) : null), own_answer: sel[i][OTH] ? (other[q.id] || "").trim() : "", notes: (notes[q.id] || "").trim() };
  });
  var att = liveFiles().map(function (f) { var a = { level: f.level }; if (f.question) a.question = f.question; if (f.answer) a.answer = f.answer; a.name = f.name; a.size = f.size; a.type = f.type; a.delivery = mode === "inline" ? "chat" : "inbox"; return a; });
  var line = Q.map(function (q) { var e = answers[q.id], ks = Array.isArray(e.answer) ? e.answer : (e.answer ? [e.answer] : []); return q.id + " = " + (ks.length ? "" : "—") + ks.map(function (k) { return k === OTH ? "Own: " + e.own_answer.replace(/\s*\n\s*/g, " / ") : labelOf(q, k) + " [" + k + "]"; }).join(", ") + (e.notes ? " (notes: " + e.notes.replace(/\s*\n\s*/g, " / ") + ")" : ""); }).join(" | ");
  if (cm.trim()) line += " | Summary: " + cm.trim().replace(/\s*\n\s*/g, " / ");
  if (att.length) line += " | " + (mode === "inline" ? S.chatFiles : S.files) + ": " + att.map(function (a) { return a.name + " (" + (a.answer ? a.question + "/" + a.answer : a.question || "card") + ")"; }).join(", ");
  var json = { artifact_id: data.id || "", engine: "AiDecisionCard " + VER, lang: L, exported_at: new Date().toISOString(), answers: answers, attachments: att, summary_comments: cm.trim(), missing_blocking: missing };
  return { line: line, json: json };
 }
 function md(p) {
  var s = "# **Answers — " + (p.json.artifact_id || "") + "**\n\nExported: " + p.json.exported_at + "\n\n| ID | Question | Blocking | Answer | Own answer | Notes |\n|---|---|---|---|---|---|\n";
  var cell = function (v) { return String(v || "").replace(/\|/g, "\\|").replace(/\n/g, "<br>"); };
  Q.forEach(function (q) { var e = p.json.answers[q.id], a = Array.isArray(e.answer_label) ? e.answer_label.join("; ") : (e.answer_label || "—"); s += "| " + q.id + " | " + cell(e.question) + " | " + (e.blocking ? "yes" : "no") + " | " + cell(a) + " | " + cell(e.own_answer) + " | " + cell(e.notes) + " |\n"; });
  if (p.json.attachments.length) { s += "\n## **Attachments**\n\n| Level | Question | Answer | File | Size | Saved as |\n|---|---|---|---|---|---|\n"; p.json.attachments.forEach(function (a) { s += "| " + a.level + " | " + (a.question || "") + " | " + (a.answer || "") + " | " + cell(a.name) + " | " + a.size + " | " + cell(a.saved_as || a.delivery) + " |\n"; }); }
  return s + "\n## **Summary Comments**\n\n" + (p.json.summary_comments || "—") + "\n";
 }
 function dl(name, text, type) { var a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([text], { type: type })); a.download = name; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500); }
 function stateObj() { var s = { sel: {}, notes: notes, other: other, cm: cm }; Q.forEach(function (q, i) { s.sel[q.id] = Object.keys(sel[i]); }); return s; }
 function openExt() {
  var d = JSON.parse(JSON.stringify(data)); d.lang = L; d._state = stateObj();
  var url = viewer + "#d=" + b64u(JSON.stringify(d));
  if (typeof g.openLink === "function") g.openLink(url); else g.open(url, "_blank", "noopener");
  return url;
 }
 function micToggle(fid) {
  if (rec) { try { rec.stop(); } catch (e) {} return; }
  delete micErr[fid];
  try { rec = new SR(); } catch (e) { micErr[fid] = S.micErr; rec = null; draw(); return; }
  recFid = fid;
  rec.lang = opts.speechLang || (L === "he" ? "he-IL" : L === "en" ? "en-US" : L);
  rec.continuous = true; rec.interimResults = false;
  rec.onresult = function (e) {
   var t = ""; for (var i = e.resultIndex; i < e.results.length; i++) if (e.results[i].isFinal) t += e.results[i][0].transcript;
   t = t.trim(); if (!t) return;
   var v = getVal(fid); v = v + (v && !/\s$/.test(v) ? " " : "") + t; setVal(fid, v);
   var ta = root.querySelector('textarea[data-fid="' + fid + '"]'); if (ta) { ta.value = v; fit(ta); }
  };
  rec.onerror = function (e) { micErr[fid] = S.micErr + " (" + e.error + ")"; };
  rec.onend = function () { rec = null; recFid = null; draw(); };
  try { rec.start(); } catch (e) { micErr[fid] = S.micErr; rec = null; recFid = null; }
  draw();
 }
 function addFiles(t, list) {
  var p = t.split("|"), level = p[0] === "c" ? "card" : p[0] === "q" ? "question" : "answer";
  [].forEach.call(list, function (f) {
   files.push({ id: ++fseq, t: t, level: level, question: p[1] || undefined, answer: p[2] || undefined, name: f.name, size: f.size, type: f.type || "", file: f });
  });
  draw();
 }
 function stamp() { var d = new Date(), p = function (n) { return String(n).padStart(2, "0"); }; return d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) + "_" + p(d.getHours()) + p(d.getMinutes()) + p(d.getSeconds()); }
 function idb() { return new Promise(function (res, rej) { var r = indexedDB.open("aidc", 1); r.onupgradeneeded = function () { r.result.createObjectStore("h"); }; r.onsuccess = function () { res(r.result); }; r.onerror = function () { rej(r.error); }; }); }
 function idbGet(k) { return idb().then(function (db) { return new Promise(function (res) { var q = db.transaction("h").objectStore("h").get(k); q.onsuccess = function () { res(q.result || null); }; q.onerror = function () { res(null); }; }); }).catch(function () { return null; }); }
 function idbSet(k, v) { return idb().then(function (db) { db.transaction("h", "readwrite").objectStore("h").put(v, k); }).catch(function () {}); }
 function pickDir() { return g.showDirectoryPicker({ id: "aidc-inbox", mode: "readwrite" }).then(function (h) { idbSet("inbox", h); return h; }); }
 function getDir() {
  if (!g.showDirectoryPicker) return Promise.reject(new Error("nofs"));
  return idbGet("inbox").then(function (h) {
   if (!h || !h.queryPermission) return pickDir();
   return h.queryPermission({ mode: "readwrite" }).then(function (p) { return p === "granted" ? h : h.requestPermission({ mode: "readwrite" }).then(function (p2) { return p2 === "granted" ? h : pickDir(); }); }).catch(pickDir);
  });
 }
 function writeFile(dir, name, blob) { return dir.getFileHandle(name, { create: true }).then(function (fh) { return fh.createWritable(); }).then(function (w) { return w.write(blob).then(function () { return w.close(); }); }); }
 function status(cls, msg) { var el = root.querySelector("[data-svst]"); if (el) { el.hidden = false; el.className = "svst " + cls; el.textContent = msg; } }
 function showOut(p) { var out = root.querySelector(".out"); if (out) { out.hidden = false; out.querySelector('[data-o="line"]').textContent = p.line; out.querySelector('[data-o="json"]').textContent = JSON.stringify(p.json, null, 2); } }
 function saveInbox(p) {
  var sub = (data.id || "CARD").replace(/[^A-Za-z0-9_-]/g, "_") + "_" + stamp(), live = liveFiles(), used = {};
  live.forEach(function (f, i) { var n = f.name.replace(/[\\/:*?"<>|]/g, "_"), b = n, c = 1; while (used[n.toLowerCase()]) n = (c++) + "_" + b; used[n.toLowerCase()] = 1; p.json.attachments[i].saved_as = sub + "/" + n; f.saveName = n; });
  status("", S.saving);
  return getDir().then(function (dir) {
   return dir.getDirectoryHandle(sub, { create: true }).then(function (d) {
    var chain = Promise.resolve();
    live.forEach(function (f) { chain = chain.then(function () { return writeFile(d, f.saveName, f.file); }); });
    return chain.then(function () { return writeFile(d, "answers.json", new Blob([JSON.stringify(p.json, null, 2)], { type: "application/json" })); })
     .then(function () { return writeFile(d, "answers.md", new Blob([md(p)], { type: "text/markdown" })); })
     .then(function () { var where = (data.inbox ? String(data.inbox).replace(/[\\/]+$/, "") + "\\" : (dir.name ? dir.name + "/" : "")) + sub; p.line += " | Saved: " + where; showOut(p); status("ok", S.saved.replace("{p}", where)); });
   });
  }).catch(function (e) {
   if (e && e.name === "AbortError") { status("w", S.saveCancel); return; }
   p.json.attachments.forEach(function (a) { a.delivery = "download"; delete a.saved_as; });
   dl((data.id || "CARD") + "_answers.json", JSON.stringify(p.json, null, 2), "application/json");
   live.forEach(function (f) { var a = document.createElement("a"); a.href = URL.createObjectURL(f.file); a.download = f.name; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000); });
   showOut(p); status("w", S.saveDl);
  });
 }
 function onPaste(e) {
  if (mode !== "standalone" || !e.clipboardData) return;
  var fl = [].filter.call(e.clipboardData.files || [], function (f) { return f && f.size; });
  if (!fl.length) return;
  e.preventDefault();
  var a = document.activeElement, reg = a && a.closest && a.closest(".adc .reg"), t = "c||";
  if (reg) { var regs = [].slice.call(root.querySelectorAll(".reg")), i = regs.indexOf(reg); if (i >= 0 && attQ(Q[i])) t = "q|" + Q[i].id + "|"; }
  var named = fl.map(function (f, k) { return /^image\//.test(f.type) && /^image\.\w+$/i.test(f.name || "image.png") ? new File([f], "screenshot_" + stamp() + (fl.length > 1 ? "_" + (k + 1) : "") + "." + (f.type.split("/")[1] || "png").replace("jpeg", "jpg"), { type: f.type }) : f; });
  addFiles(t, named);
 }
 if (mode === "standalone") document.addEventListener("paste", onPaste);
 function doSend() {
  errs = {}; Q.forEach(function (q, i) { if (blk(q) && !Object.keys(sel[i]).length) errs[q.id] = 1; else if (sel[i][OTH] && !(other[q.id] || "").trim()) errs[q.id] = 2; });
  if (Object.keys(errs).length) { draw(); var e1 = root.querySelector(".err"); if (e1 && e1.scrollIntoView) e1.scrollIntoView({ block: "center" }); return; }
  last = payload();
  if (typeof opts.onSubmit === "function") { opts.onSubmit(last); return; }
  if (mode === "inline" && typeof g.sendPrompt === "function") { g.sendPrompt(last.line + "\n```json\n" + JSON.stringify(last.json) + "\n```"); return; }
  saveInbox(last);
 }
 root.addEventListener("input", function (e) { var t = e.target; if (t.matches && t.matches("textarea.tx")) { setVal(t.getAttribute("data-fid"), t.value); fit(t); var f = t.getAttribute("data-fid"); if (f.indexOf("ot:") === 0) { var qid = f.slice(3); if (errs[qid] === 2) { delete errs[qid]; var er = t.closest(".reg").querySelector(".err"); if (er) er.remove(); } } } });
 root.addEventListener("pointerup", function (e) { var t = e.target; if (t.matches && t.matches("textarea.tx")) heights[t.getAttribute("data-fid")] = t.offsetHeight; });
 root.addEventListener("keydown", function (e) { if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); doSend(); } });
 root.addEventListener("change", function (e) {
  var i = e.target;
  if (i.matches && i.matches("input[type=file]")) { addFiles(i.getAttribute("data-fin"), i.files); i.value = ""; return; }
  if (!i.dataset || i.dataset.q == null) return;
  var qi = +i.dataset.q; if (Q[qi].m) { if (i.checked) sel[qi][i.value] = 1; else delete sel[qi][i.value]; } else { sel[qi] = {}; sel[qi][i.value] = 1; }
  delete errs[Q[qi].id]; draw();
  if (i.value === OTH && i.checked) { var f = root.querySelector('textarea[data-fid="ot:' + Q[qi].id + '"]'); if (f) f.focus(); }
 });
 root.addEventListener("click", function (e) {
  var t = e.target.closest("[data-k],[data-fl],[data-send],[data-a],[data-open],[data-mic],[data-att],[data-rmf]"); if (!t) return;
  if (t.dataset.k) { open[t.dataset.k] = !open[t.dataset.k]; draw(); return; }
  if (t.dataset.fl) { flip = !flip; open = {}; if (flip) Q.forEach(function (q) { open[q.id] = 1; q.o.forEach(function (o) { open[q.id + "_" + o.k] = 1; }); }); draw(); return; }
  if (t.dataset.open) { openExt(); return; }
  if (t.dataset.mic) { micToggle(t.dataset.mic); return; }
  if (t.dataset.att) { var fi = root.querySelector('input[data-fin="' + t.dataset.att + '"]'); if (fi) fi.click(); return; }
  if (t.dataset.rmf) { var id = +t.dataset.rmf; files = files.filter(function (f) { return f.id !== id; }); draw(); return; }
  if (t.dataset.send) { doSend(); return; }
  if (t.dataset.a && last) {
   var js = JSON.stringify(last.json, null, 2), base = (data.id || "CARD") + "_ANSWERS";
   if (t.dataset.a === "copy") { try { navigator.clipboard.writeText(js); } catch (x) {} }
   if (t.dataset.a === "dlj") dl(base + ".json", js, "application/json");
   if (t.dataset.a === "dlm") dl(base + ".md", md(last), "text/markdown");
  }
 });
 draw();
 return { payload: payload, redraw: draw, openUrl: function () { var d = JSON.parse(JSON.stringify(data)); d.lang = L; d._state = stateObj(); return viewer + "#d=" + b64u(JSON.stringify(d)); }, addFiles: addFiles, paste: onPaste };
}
function fromHash(hash, opts) {
 var m = /[#&]d=([^&]+)/.exec(hash || g.location.hash); if (!m) return null;
 var d = JSON.parse(unb64u(m[1])); opts = opts || {}; if (d._state) { opts.state = d._state; delete d._state; }
 if (!opts.mode) opts.mode = "standalone"; return render(d, opts);
}
g.AiDecisionCard = { render: render, fromHash: fromHash, version: VER, strings: STR, encode: b64u, decode: unb64u };
})(typeof window !== "undefined" ? window : this);
