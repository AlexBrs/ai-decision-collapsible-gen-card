/*! ai-decision-collapsible-gen-card v1.2.0 (AiDecisionCard) | Spec: README.md | Schemas: schema/*.json
 * Usage: AiDecisionCard.render(input, {target:"#el", mode:"inline"|"standalone", lang, onSubmit:fn, viewer:url|false, state, speechLang})
 * input: JSON object or JSON string - {id, ref?, lang, title?, strings?, a?, viewer?, who?, q:[{id, t, v?, x?, m?, b?, c?, n?, a?, o:[{k, l, v?, d?, x?, r?, s?}]}], confirm?}
 * v = visual: "i:<icon name>" built-in icon | "p:<path d>" 24x24 SVG path | "https://..." image. ref = reference ID shown under the title.
 * s = option rating 1-10 (badge: >=8 green, 5-7 amber, <=4 red). confirm = chat cards: show 'Ready to submit' (default: only when 2+ questions).
 * Text: string or {en:"..", he:".."}. x = explanation bullets. m = multi-choice (0). b = blocking (1). c = "My own answer" (1).
 * n = per-question comment box (1). a = attach buttons (1; card-level input.a, question/answer-level q[].a). r = recommended.
 * Output JSON: {artifact_id, engine, lang, exported_at, answers:{id:{question, blocking, multi, answer, answer_label, own_answer, notes, answer_notes?}}, card_ref?,
 *               attachments:[{level, question?, answer?, name, size, type, delivery:"chat"|"zip", saved_as?}], respondent?, summary_comments, missing_blocking}
 * Files never go inside the JSON. Inline (chat): files are listed; the user pastes/drops them into the chat after Send.
 * Standalone (browser): Paste screenshot / Capture screen / Ctrl+V add images; Send downloads ONE zip: answers.json, answers.md, files/*.
 * who = ask the respondent's name (required) - for cards sent to a team.
 * Own answer key = "__other". Keys: Enter / Shift+Enter = new line, Ctrl+Enter = send.
 */
(function (g) {
"use strict";
var VER = "1.2.0", VIEWER = "https://alexbrs.github.io/ai-decision-collapsible-gen-card/";
var STR = {
 en:{dir:"ltr",expand:"Expand all",collapse:"Collapse all",rec:"Recommended",blk:"Blocking",opt:"Optional",multi:"Select all that apply",send:"Submit to Claude",exportZip:"Export answers (ZIP)",ph:"Summary comments (optional)",notes:"Comments (optional)",other:"My own answer",otherPh:"Type your answer",eO:"Type your own answer first",e1:"Choose an answer",eM:"Select at least one option",exp:"Explain",payload:"Answer payload",copy:"Copy JSON",dlj:"Download JSON",dlm:"Download Markdown",open:"Open in browser",attach:"Attach",mic:"Dictate",micOn:"Listening… click to stop",micErr:"Microphone not available here — use Windows voice typing (Win+H)",rm:"Remove",keys:"Enter = new line · Ctrl+Enter = send",winh:"Dictate: press Win+H in any box",paste:"Ctrl+V pastes a screenshot",chatFile:"after Send, paste/drop it into the chat",files:"Files",chatFiles:"Files to paste into the chat next",shotTip:"Screenshot: Win+Shift+S, then Ctrl+V into the message box",pasteShot:"Paste screenshot",capture:"Capture screen",noImg:"No image in the clipboard — press Win+Shift+S first",capErr:"Screen capture not available here",who:"Your name / ID",whoPh:"Type your name or ID",eWho:"Type your name or ID",zipping:"Preparing ZIP…",zipped:"Downloaded {f} — drop it into the chat, or send it back to whoever asked",zipErr:"ZIP failed",req:"Required",mTitleMiss:"Required information missing",mTitleSent:"Answers sent",mTitleZip:"Answers saved — ZIP downloaded",mCard:"Card",mAnswered:"Questions answered",mMissing:"Missing",mFiles:"Files",mMic:"Microphone",micStopped:"stopped",mZip:"ZIP file",mChatFiles:"Now paste or drop the attached files into the chat.",btnOk:"OK",btnBack:"Back to card",go:"Go to",dupNote:"already attached ({w}) — skipped",mTitleOkC:"Ready to submit",mTitleOkZ:"Ready to export",mFileName:"File name",btnCancel:"Cancel",cont:"Continue",close:"Close",details:"Add details",hideDetails:"Hide details",ansNote:"Comment on this answer (optional)",cardLvl:"card",sent:"Submitted to Claude",mRef:"Reference",expDet:"Explanation and details",rating:"Rating"},
 he:{dir:"rtl",expand:"הרחב הכל",collapse:"כווץ הכל",rec:"מומלץ",blk:"חוסם",opt:"אופציונלי",multi:"ניתן לבחור כמה",send:"שלח ל-Claude",exportZip:"ייצוא תשובות (ZIP)",ph:"הערות מסכמות (אופציונלי)",notes:"הערות (אופציונלי)",other:"תשובה משלי",otherPh:"הקלד את תשובתך",eO:"יש להקליד תשובה משלך",e1:"יש לבחור תשובה",eM:"יש לבחור לפחות אפשרות אחת",exp:"הסבר",payload:"תשובות",copy:"העתק JSON",dlj:"הורד JSON",dlm:"הורד Markdown",open:"פתח בדפדפן",attach:"צרף",mic:"הכתבה",micOn:"מקשיב… לחץ לעצירה",micErr:"המיקרופון לא זמין כאן — השתמש בהקלדה קולית של Windows (Win+H)",rm:"הסר",keys:"Enter = שורה חדשה · Ctrl+Enter = שליחה",winh:"הכתבה: Win+H בכל תיבה",paste:"Ctrl+V מדביק צילום מסך",chatFile:"אחרי השליחה הדבק/גרור אותו לצ'אט",files:"קבצים",chatFiles:"קבצים להדבקה בצ'אט",shotTip:"צילום מסך: Win+Shift+S ואז Ctrl+V בתיבת ההודעה",pasteShot:"הדבק צילום מסך",capture:"צלם מסך",noImg:"אין תמונה בלוח — לחץ קודם Win+Shift+S",capErr:"צילום מסך לא זמין כאן",who:"שם / מזהה",whoPh:"הקלד שם או מזהה",eWho:"יש להקליד שם או מזהה",zipping:"מכין ZIP…",zipped:"ירד הקובץ {f} — גרור אותו לצ'אט או שלח אותו בחזרה",zipErr:"יצירת ZIP נכשלה",req:"חובה",mTitleMiss:"חסר מידע נדרש",mTitleSent:"התשובות נשלחו",mTitleZip:"התשובות נשמרו — קובץ ה-ZIP ירד",mCard:"כרטיס",mAnswered:"שאלות שנענו",mMissing:"חסר",mFiles:"קבצים",mMic:"מיקרופון",micStopped:"נעצר",mZip:"קובץ ZIP",mChatFiles:"עכשיו הדבק או גרור את הקבצים לצ'אט.",btnOk:"אישור",btnBack:"חזרה לכרטיס",go:"עבור ל",dupNote:"כבר מצורף ({w}) — דולג",mTitleOkC:"מוכן לשליחה",mTitleOkZ:"מוכן לייצוא",mFileName:"שם קובץ",btnCancel:"ביטול",cont:"המשך",close:"סגור",details:"הוסף פרטים",hideDetails:"הסתר פרטים",ansNote:"הערה לתשובה זו (אופציונלי)",cardLvl:"כרטיס",sent:"נשלח ל-Claude",mRef:"הפניה",expDet:"הסבר ופרטים",rating:"דירוג"}
};
var CSS = [
".adc{--bg:#fff;--fg:#1b1f24;--mu:#5b6672;--ru:#d8dee6;--ct:#c9d1db;--pa:#f6f8fa;--p2:#e3e8ee;--ac:#0b5cad;--as:#e7f0fa;--ok:#2e7d32;--bd:#b3261e;--bb:#fdecec;--wn:#8a5a00;color-scheme:light;background:var(--bg);color:var(--fg);font:14px/1.5 -apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;padding:12px;border-radius:4px;box-sizing:border-box}",
".adc{position:relative}",
".adc .req{color:var(--bd);font-weight:700;margin-inline-start:4px}",
".adc .mbg{position:fixed;inset:0;background:rgba(27,31,36,.45);display:flex;align-items:center;justify-content:center;z-index:2147483000;padding:16px}.adc .mbg.inl{position:absolute;align-items:flex-end}",
".adc .mdl{background:#fff;color:var(--fg);border-radius:6px;box-shadow:0 10px 30px rgba(0,0,0,.25);width:100%;max-width:520px;padding:18px 20px;max-height:90vh;overflow:auto}.adc .mdl h2{font-size:18px;font-weight:700;margin:0 0 10px}",
".adc .mtb{border-collapse:collapse;width:100%;margin:0 0 10px;font-size:13px}.adc .mtb th{text-align:start;color:var(--mu);font-weight:600;padding:3px 12px 3px 0;padding-inline:0 12px;white-space:nowrap;vertical-align:top}.adc .mtb td{padding:3px 0;text-align:start;word-break:break-word}",
".adc .mmiss{border-top:1px solid var(--ru);padding-top:8px;font-size:13px}.adc .mrow{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:6px}.adc .mrow input.wi{flex:1 1 160px;width:auto!important}",
".adc .mbtn{display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap;margin-top:14px}.adc .flash{outline:3px solid var(--ac);outline-offset:2px}",
".adc .mdl{position:relative}.adc .mdl h2{padding-inline-end:30px}.adc button.mx{position:absolute;top:10px;inset-inline-end:10px;width:28px!important;height:28px!important;min-width:0!important;padding:0!important;border:0!important;background:transparent!important;color:var(--mu)!important;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:none!important}.adc button.mx svg{width:18px!important;height:18px!important;min-width:18px!important}",
".adc .hdr{margin:0 0 10px}.adc .hdr b{display:block;font-size:17px;line-height:1.3}.adc .hdr .ref{font-size:11px;color:var(--mu);unicode-bidi:plaintext}",
".adc .vis{flex:none;display:inline-flex;align-items:center;justify-content:center}.adc .vis svg{width:28px!important;height:28px!important;min-width:28px!important;fill:var(--fg)}.adc .rh .vis svg{width:22px!important;height:22px!important;min-width:22px!important}.adc .vis img{display:block;max-width:120px;max-height:80px;border:1px solid var(--ru)}",
".adc .chip{position:relative}.adc .chip .th{display:none;position:absolute;bottom:100%;inset-inline-start:0;z-index:20;margin-bottom:4px;background:#fff;border:1px solid var(--ru);padding:4px;box-shadow:0 4px 12px rgba(0,0,0,.18)}.adc .chip:hover .th{display:block}.adc .chip .th img{display:block;max-width:220px;max-height:160px}.adc .chip .nm.pv{cursor:zoom-in;text-decoration:underline dotted}",
".adc .mdl.big{max-width:min(92vw,1100px)}.adc .mdl.big img{display:block;max-width:100%;max-height:75vh;margin:0 auto}.adc .mrow input.fn{flex:1 1 220px;width:auto!important}.adc .adw{margin-top:6px}",
".adc button.send{display:inline-flex!important;align-items:center;gap:6px}.adc button.send svg{fill:#fff}.adc[dir=rtl] button.send svg{transform:scaleX(-1)}",
".adc button.tg.dot{position:relative!important;overflow:visible!important}.adc button.tg.dot::after{content:\"\";position:absolute;top:-4px;inset-inline-end:-4px;width:8px;height:8px;border-radius:50%;background:var(--ac);border:1px solid #fff}",
".adc .sc{font-size:11px;font-weight:700;padding:1px 7px;border-radius:10px;border:1px solid;margin-inline-start:6px;white-space:nowrap}.adc .sc.g{color:var(--ok);border-color:var(--ok);background:#eaf5ea}.adc .sc.a{color:var(--wn);border-color:#c9a227;background:#fff6dc}.adc .sc.r{color:var(--bd);border-color:var(--bd);background:var(--bb)}",
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
".adc .who{margin:0 0 12px}.adc .who b{display:block;font-size:13px;margin-bottom:4px}",
".adc input.wi{display:block!important;width:100%!important;max-width:100%!important;min-width:0!important;box-sizing:border-box!important;margin:0!important;padding:6px 8px!important;border:1px solid var(--ct)!important;border-radius:2px!important;background:#fff!important;color:var(--fg)!important;font-size:14px!important;height:auto!important;box-shadow:none!important;unicode-bidi:plaintext}",
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
var ICO = {"tray":"M5 20h14v-2H5v2zm14-11h-4V3H9v6H5l7 7 7-7z","file":"M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-2 16l-4-4h3v-4h2v4h3l-4 4zm1-9V3.5L18.5 9H13z","zip":"M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM12 17.5L6.5 12H10v-2h4v2h3.5L12 17.5zM5.12 5l.81-1h12l.94 1H5.12z","save":"M17 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7l-4-4zm-5 16a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm3-10H5V5h10v4z","share":"M16 5l-1.42 1.42-1.59-1.59V16h-1.98V4.83L9.42 6.42 8 5l4-4 4 4zm4 5v11c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V10c0-1.11.89-2 2-2h3v2H6v11h12V10h-3V8h3c1.1 0 2 .89 2 2z","plane":"M2.01 21L23 12 2.01 3 2 10l15 2-15 2z","check":"M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z","reply":"M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z","note":"M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z","info":"M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z","warn":"M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z","star":"M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z","mail":"M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z","db":"M12 3C7.58 3 4 4.79 4 7v10c0 2.21 3.58 4 8 4s8-1.79 8-4V7c0-2.21-3.58-4-8-4zm0 2c3.87 0 6 1.5 6 2s-2.13 2-6 2-6-1.5-6-2 2.13-2 6-2zm6 12c0 .5-2.13 2-6 2s-6-1.5-6-2v-2.23c1.61.78 3.72 1.23 6 1.23s4.39-.45 6-1.23V17zm0-5c0 .5-2.13 2-6 2s-6-1.5-6-2V9.77C7.61 10.55 9.72 11 12 11s4.39-.45 6-1.23V12z"};
function svgP(d) { return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + String(d).replace(/[^0-9a-zA-Z.,\s+-]/g, "") + '"/></svg>'; }
var SVG = {
 zip:svgP(ICO.zip), plane:svgP(ICO.plane), note:svgP(ICO.note),
 r:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6z"/></svg>',
 l:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6z"/></svg>',
 d:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6z"/></svg>',
 mic:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11z"/></svg>',
 clip:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.5 6v11.5a4 4 0 0 1-8 0V5a2.5 2.5 0 0 1 5 0v10.5a1 1 0 0 1-2 0V6H10v9.5a2.5 2.5 0 0 0 5 0V5a4 4 0 0 0-8 0v12.5a5.5 5.5 0 0 0 11 0V6z"/></svg>',
 ext:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3zM19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2z"/></svg>',
 paste:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 2h-4.18C14.4.84 13.3 0 12 0S9.6.84 9.18 2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm7 18H5V4h2v3h10V4h2v16z"/></svg>',
 scr:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2H8v2h8v-2h-2v-2h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z"/></svg>',
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
 var open = {}, flip = false, cm = st.cm || "", notes = st.notes || {}, other = st.other || {}, ansN = st.ansN || {}, adOpen = {}, errs = {}, heights = {}, micErr = {};
 var files = [], fseq = 0, rec = null, recFid = null, last = null, who = st.who || "", askWho = on(data.who, false), modal = null, pendingSend = false, micWasOn = false, dupNote = {}, stMsg = null, fname = "";
 var sel = Q.map(function (q) {
  var s = {};
  if (st.sel && st.sel[q.id]) st.sel[q.id].forEach(function (k) { s[k] = 1; });
  else q.o.forEach(function (o) { if (o.r) s[o.k] = 1; });
  if (!q.m) { var ks = Object.keys(s); if (ks.length > 1) { s = {}; s[ks[0]] = 1; } }
  return s;
 });
 var hasEx = Q.some(function (q) { return arr(q.x).length || q.o.some(function (o) { return arr(o.x).length; }); });
 function closed() { return S.dir === "rtl" ? SVG.l : SVG.r; }
 function tg(k, dot, lbl) { return '<button type="button" class="tg' + (dot ? " dot" : "") + '" data-k="' + esc(k) + '" aria-expanded="' + !!open[k] + '" aria-label="' + esc(lbl || S.exp) + '" title="' + esc(lbl || S.exp) + '">' + (open[k] ? SVG.d : closed()) + '</button>'; }
 function ul(a) { return "<ul>" + a.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>"; }
 function getVal(fid) { var p = fid.split(":"), k = p.slice(1).join(":"); return p[0] === "n" ? (notes[k] || "") : p[0] === "ot" ? (other[k] || "") : p[0] === "an" ? (ansN[k] || "") : cm; }
 function setVal(fid, v) { var p = fid.split(":"), k = p.slice(1).join(":"); if (p[0] === "n") notes[k] = v; else if (p[0] === "ot") other[k] = v; else if (p[0] === "an") ansN[k] = v; else cm = v; }
 function vis(v) {
  v = tx(v); if (!v || typeof v !== "string") return ""; var m = /^i:(\w+)$/.exec(v);
  if (m) return ICO[m[1]] ? '<span class="vis">' + svgP(ICO[m[1]]) + "</span>" : SVG[m[1]] ? '<span class="vis">' + SVG[m[1]] + "</span>" : "";
  if (/^p:/.test(v)) return '<span class="vis">' + svgP(v.slice(2)) + "</span>";
  if (/^https:\/\//i.test(v)) return '<span class="vis"><img src="' + esc(v) + '" alt="" loading="lazy" referrerpolicy="no-referrer"></span>';
  return "";
 }
 function purl(f) { if (!f.url) { try { f.url = URL.createObjectURL(f.file); } catch (e) { return ""; } } return f.url; }
 function chips(t) {
  return files.filter(function (f) { return f.t === t; }).map(function (f) {
   var im = /^image\//.test(f.type) && f.file ? purl(f) : "";
   return '<span class="chip">' + (im ? '<span class="th"><img src="' + im + '" alt=""></span>' : "") + '<span class="nm' + (im ? " pv" : "") + '"' + (im ? ' data-pv="' + f.id + '"' : "") + ' title="' + esc(im ? S.preview + ": " + f.name : f.name) + '">' + esc(f.name) + '</span>' + (mode === "inline" ? '<span class="st w">' + esc(S.chatFile) + "</span>" : '<span class="st">' + Math.max(1, Math.round(f.size / 1024)) + " KB</span>") + '<button type="button" class="x" data-rmf="' + f.id + '" aria-label="' + esc(S.rm) + '">' + SVG.x + "</button></span>";
  }).join("") + (dupNote[t] ? '<span class="merr">' + esc(dupNote[t]) + "</span>" : "");
 }
 function attBtn(t) { return '<button type="button" class="gbtn sm" data-att="' + esc(t) + '">' + SVG.clip + esc(S.attach) + '</button><input type="file" multiple data-fin="' + esc(t) + '">'; }
 function tools(fid, t) {
  var h = "";
  if (fid && SR && mode === "standalone") h += '<button type="button" class="gbtn sm mic' + (recFid === fid ? " on" : "") + '" data-mic="' + esc(fid) + '">' + SVG.mic + esc(recFid === fid ? S.micOn : S.mic) + "</button>";
  if (t) h += attBtn(t) + (mode === "standalone" ? '<button type="button" class="gbtn sm" data-pst="' + esc(t) + '">' + SVG.paste + esc(S.pasteShot) + '</button>' + (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia ? '<button type="button" class="gbtn sm" data-cap="' + esc(t) + '">' + SVG.scr + esc(S.capture) + "</button>" : "") : "") + chips(t);
  if (fid && micErr[fid]) h += '<span class="merr">' + esc(micErr[fid]) + "</span>";
  return h ? '<div class="tb">' + h + "</div>" : "";
 }
 function field(fid, ph, t) { return '<div class="fw"><textarea class="tx" rows="1" data-fid="' + esc(fid) + '" placeholder="' + esc(ph) + '">' + esc(getVal(fid)) + "</textarea>" + tools(fid, t) + "</div>"; }
 function optRow(q, qi, k, label, d, rec_, ox, v, sc) {
  var isOn = !!sel[qi][k], key = q.id + "_" + k, det = isOn && q.m && k !== OTH, ak = q.id + "|" + k, at = det && attQ(q) ? "a|" + ak : null;
  var cnt = det ? ((ansN[ak] || "").trim() ? 1 : 0) + (at ? files.filter(function (f) { return f.t === at; }).length : 0) : 0;
  sc = +sc; var badge = sc >= 1 && sc <= 10 ? '<span class="sc ' + (sc >= 8 ? "g" : sc >= 5 ? "a" : "r") + '" title="' + esc(S.rating) + '">' + (sc >= 8 ? "✓" : sc >= 5 ? "●" : "✕") + " " + Math.round(sc) + "/10</span>" : "";
  var h = '<div class="grp' + (isOn ? " on" : "") + '"><div class="col"></div><div class="tc">' + (ox.length || det ? tg(key, cnt > 0, det ? S.expDet : S.exp) : "") + '</div><label><input type="' + (q.m ? "checkbox" : "radio") + '" name="adc_' + esc(q.id) + '" data-q="' + qi + '" value="' + esc(k) + '"' + (isOn ? " checked" : "") + '>' + vis(v) + '<span class="ol"><b>' + esc(label) + "</b>" + (rec_ ? '<span class="rec">' + esc(S.rec) + "</span>" : "") + badge + (d ? '<span class="d">' + esc(d) + "</span>" : "") + "</span></label>";
  if (ox.length && open[key]) h += '<div class="oex">' + ul(ox) + "</div>";
  if (k === OTH && isOn) h += '<div class="ow">' + field("ot:" + q.id, S.otherPh, attQ(q) && q.m ? "a|" + q.id + "|" + OTH : null) + "</div>";
  if (det && open[key]) h += '<div class="aw">' + field("an:" + ak, S.ansNote, at) + "</div>";
  return h + "</div>";
 }
 function fit(t) { t.style.height = "auto"; var h = t.scrollHeight + 2, s = heights[t.getAttribute("data-fid")] || 0; t.style.height = Math.max(h, s, 36) + "px"; }
 function draw() {
  root.className = "adc"; root.dir = S.dir; root.lang = L;
  var bar = (hasEx ? '<button type="button" class="gbtn" data-fl="1">' + (flip ? closed() : SVG.d) + esc(flip ? S.collapse : S.expand) + "</button>" : "") + (viewer && mode === "inline" ? '<button type="button" class="gbtn" data-open="1">' + SVG.ext + esc(S.open) + "</button>" : "");
  var h = (data.title || data.ref ? '<div class="hdr">' + (data.title ? "<b>" + esc(tx(data.title)) + "</b>" : "") + (data.ref ? '<span class="ref">' + esc(data.ref) + "</span>" : "") + "</div>" : "") + (bar ? '<div class="gbar">' + bar + "</div>" : "");
  if (askWho) h += '<div class="who"><b>' + esc(S.who) + '<span class="req">✱</span></b><input type="text" class="wi" data-who="1" placeholder="' + esc(S.whoPh) + '" value="' + esc(who) + '">' + (errs.__who ? '<div class="merr">' + esc(S.eWho) + "</div>" : "") + "</div>";
  Q.forEach(function (q, qi) {
   var qx = arr(q.x);
   h += '<div class="reg" data-qid="' + esc(q.id) + '"><div class="rh">' + (qx.length ? tg(q.id) : "") + vis(q.v) + '<span class="t">' + esc(tx(q.t)) + (blk(q) ? '<span class="req" title="' + esc(S.req) + '">✱</span>' : "") + "</span>" + (q.m ? '<span class="bd m">' + esc(S.multi) + "</span>" : "") + (blk(q) ? '<span class="bd b">' + esc(S.blk) + "</span>" : '<span class="bd o">' + esc(S.opt) + "</span>") + "</div>";
   if (qx.length && open[q.id]) h += '<div class="ex">' + ul(qx) + "</div>";
   h += '<div class="ans">';
   q.o.forEach(function (o) { h += optRow(q, qi, o.k, tx(o.l), tx(o.d), o.r, arr(o.x), o.v, o.s); });
   if (hasOther(q)) h += optRow(q, qi, OTH, S.other, "", false, []);
   h += "</div>" + (errs[q.id] ? '<div class="err">' + esc(errs[q.id] === 2 ? S.eO : (q.m ? S.eM : S.e1)) + "</div>" : "");
   var qt = attQ(q) ? "q|" + q.id + "|" : null;
   if (hasNotes(q)) h += '<div class="qx">' + field("n:" + q.id, S.notes, qt) + "</div>";
   else if (qt) h += '<div class="qx"><div class="tb">' + attBtn(qt) + chips(qt) + "</div></div>";
   h += "</div>";
  });
  h += '<div class="ft">' + field("cm:", S.ph, cardAtt ? "c||" : null) + '<button type="button" class="send" data-send="1">' + sendLbl() + "</button></div><div class=\"hint\">" + esc(S.keys) + " · " + esc(mode === "inline" ? S.winh + " · " + S.shotTip : S.paste) + "</div>";
  h += '<div class="svst' + (stMsg ? " " + stMsg[0] : "") + '" data-svst="1"' + (stMsg ? ">" + esc(stMsg[1]) : " hidden>") + '</div>' + (mode === "standalone" ? '<div class="out" hidden><h2>' + esc(S.payload) + '</h2><pre data-o="line"></pre><pre data-o="json"></pre><button type="button" class="gbtn" data-a="copy">' + esc(S.copy) + '</button> <button type="button" class="gbtn" data-a="dlj">' + esc(S.dlj) + '</button> <button type="button" class="gbtn" data-a="dlm">' + esc(S.dlm) + "</button></div>" : "");
  h += modalHtml();
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
   if (q.m) { var an = {}; ks.forEach(function (k) { var v = (ansN[q.id + "|" + k] || "").trim(); if (v && k !== OTH) an[k] = v; }); if (Object.keys(an).length) answers[q.id].answer_notes = an; }
  });
  var att = liveFiles().map(function (f) { var a = { level: f.level }; if (f.question) a.question = f.question; if (f.answer) a.answer = f.answer; a.name = f.name; a.size = f.size; a.type = f.type; a.delivery = mode === "inline" ? "chat" : "zip"; return a; });
  var line = Q.map(function (q) { var e = answers[q.id], ks = Array.isArray(e.answer) ? e.answer : (e.answer ? [e.answer] : []); return q.id + " = " + (ks.length ? "" : "—") + ks.map(function (k) { return k === OTH ? "Own: " + e.own_answer.replace(/\s*\n\s*/g, " / ") : labelOf(q, k) + " [" + k + "]" + (e.answer_notes && e.answer_notes[k] ? " (" + e.answer_notes[k].replace(/\s*\n\s*/g, " / ") + ")" : ""); }).join(", ") + (e.notes ? " (notes: " + e.notes.replace(/\s*\n\s*/g, " / ") + ")" : ""); }).join(" | ");
  if (askWho) line = "Respondent: " + who.trim() + " | " + line;
  if (cm.trim()) line += " | Summary: " + cm.trim().replace(/\s*\n\s*/g, " / ");
  if (att.length) line += " | " + (mode === "inline" ? S.chatFiles : S.files) + ": " + att.map(function (a) { return a.name + " (" + (a.answer ? a.question + "/" + a.answer : a.question || "card") + ")"; }).join(", ");
  var json = { artifact_id: data.id || "", card_ref: data.ref || undefined, engine: "AiDecisionCard " + VER, lang: L, exported_at: new Date().toISOString(), answers: answers, attachments: att, summary_comments: cm.trim(), missing_blocking: missing };
  if (askWho) json.respondent = { name: who.trim() };
  return { line: line, json: json };
 }
 function md(p) {
  var s = "# **Answers — " + (p.json.artifact_id || "") + "**\n\n" + (p.json.respondent ? "Respondent: " + p.json.respondent.name + "\n\n" : "") + "Exported: " + p.json.exported_at + "\n\n| ID | Question | Blocking | Answer | Own answer | Notes |\n|---|---|---|---|---|---|\n";
  var cell = function (v) { return String(v || "").replace(/\|/g, "\\|").replace(/\n/g, "<br>"); };
  Q.forEach(function (q) { var e = p.json.answers[q.id], a = Array.isArray(e.answer_label) ? e.answer_label.join("; ") : (e.answer_label || "—"); s += "| " + q.id + " | " + cell(e.question) + " | " + (e.blocking ? "yes" : "no") + " | " + cell(a) + " | " + cell(e.own_answer) + " | " + cell([e.notes].concat(e.answer_notes ? Object.keys(e.answer_notes).map(function (k) { return k + ": " + e.answer_notes[k]; }) : []).filter(Boolean).join("\n")) + " |\n"; });
  if (p.json.attachments.length) { s += "\n## **Attachments**\n\n| Level | Question | Answer | File | Size | Saved as |\n|---|---|---|---|---|---|\n"; p.json.attachments.forEach(function (a) { s += "| " + a.level + " | " + (a.question || "") + " | " + (a.answer || "") + " | " + cell(a.name) + " | " + a.size + " | " + cell(a.saved_as || a.delivery) + " |\n"; }); }
  return s + "\n## **Summary Comments**\n\n" + (p.json.summary_comments || "—") + "\n";
 }
 function dl(name, text, type) { var a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([text], { type: type })); a.download = name; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500); }
 function stateObj() { var s = { sel: {}, notes: notes, other: other, ansN: ansN, cm: cm, who: who }; Q.forEach(function (q, i) { s.sel[q.id] = Object.keys(sel[i]); }); return s; }
 function openExt() {
  var d = JSON.parse(JSON.stringify(data)); d.lang = L; d._state = stateObj();
  var url = viewer + "#v=" + VER + "&d=" + b64u(JSON.stringify(d));
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
  rec.onend = function () { rec = null; recFid = null; if (pendingSend) micWasOn = true; draw(); if (pendingSend) { pendingSend = false; doSend(); } };
  try { rec.start(); } catch (e) { micErr[fid] = S.micErr; rec = null; recFid = null; }
  draw();
 }
 function digest(f) {
  var fb = function () { return f.size + ":" + f.name; };
  if (!(g.crypto && g.crypto.subtle && f.arrayBuffer)) return Promise.resolve(fb());
  return f.arrayBuffer().then(function (b) { return g.crypto.subtle.digest("SHA-256", b); }).then(function (h) { return [].map.call(new Uint8Array(h), function (x) { return ("0" + x.toString(16)).slice(-2); }).join(""); }).catch(fb);
 }
 function addFiles(t, list) {
  var p = t.split("|"), level = p[0] === "c" ? "card" : p[0] === "q" ? "question" : "answer", arr = [].slice.call(list);
  delete dupNote[t];
  return Promise.all(arr.map(digest)).then(function (hs) {
   arr.forEach(function (f, i) {
    var dup = files.filter(function (x) { return x.hash === hs[i]; })[0];
    if (dup) { dupNote[t] = f.name + " — " + S.dupNote.replace("{w}", dup.answer ? dup.question + " / " + (dup.answer === OTH ? S.other : dup.answer) : (dup.question || S.cardLvl)); return; }
    files.push({ id: ++fseq, t: t, level: level, question: p[1] || undefined, answer: p[2] || undefined, name: f.name, size: f.size, type: f.type || "", file: f, hash: hs[i] });
   });
   draw();
  });
 }
 function stamp() { var d = new Date(), p = function (n) { return String(n).padStart(2, "0"); }; return d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) + "_" + p(d.getHours()) + p(d.getMinutes()) + p(d.getSeconds()); }
 var CRC = (function () { var t = new Uint32Array(256); for (var n = 0; n < 256; n++) { var c = n; for (var k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
 function crc32(u) { var c = 0xFFFFFFFF; for (var i = 0; i < u.length; i++) c = CRC[(c ^ u[i]) & 255] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; }
 function zipBlob(entries) {
  var enc = new TextEncoder(), parts = [], cen = [], off = 0, d = new Date(), dt = ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate(), tm = (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1);
  entries.forEach(function (e) {
   var nm = enc.encode(e.name), crc = crc32(e.data), sz = e.data.length, lh = new DataView(new ArrayBuffer(30)), ch = new DataView(new ArrayBuffer(46));
   lh.setUint32(0, 0x04034b50, true); lh.setUint16(4, 20, true); lh.setUint16(6, 0x0800, true); lh.setUint16(10, tm, true); lh.setUint16(12, dt, true); lh.setUint32(14, crc, true); lh.setUint32(18, sz, true); lh.setUint32(22, sz, true); lh.setUint16(26, nm.length, true);
   ch.setUint32(0, 0x02014b50, true); ch.setUint16(4, 20, true); ch.setUint16(6, 20, true); ch.setUint16(8, 0x0800, true); ch.setUint16(12, tm, true); ch.setUint16(14, dt, true); ch.setUint32(16, crc, true); ch.setUint32(20, sz, true); ch.setUint32(24, sz, true); ch.setUint16(28, nm.length, true); ch.setUint32(42, off, true);
   parts.push(lh, nm, e.data); cen.push(ch, nm); off += 30 + nm.length + sz;
  });
  var cs = cen.reduce(function (a, p) { return a + p.byteLength; }, 0), end = new DataView(new ArrayBuffer(22));
  end.setUint32(0, 0x06054b50, true); end.setUint16(8, entries.length, true); end.setUint16(10, entries.length, true); end.setUint32(12, cs, true); end.setUint32(16, off, true);
  return new Blob(parts.concat(cen, [end]), { type: "application/zip" });
 }
 function safeName(v) { return String(v).trim().replace(/[^\p{L}\p{N}_-]+/gu, "_").replace(/^_+|_+$/g, "") || "x"; }
 function defName() { return safeName(data.id || "CARD") + (askWho && who.trim() ? "_" + safeName(who) : "") + "_" + stamp(); }
 function saveZip(p, name) {
  var live = liveFiles(), used = {};
  live.forEach(function (f, i) { var n = f.name.replace(/[\\/:*?"<>|]/g, "_"), b = n, c = 1; while (used[n.toLowerCase()]) n = (c++) + "_" + b; used[n.toLowerCase()] = 1; f.saveName = n; p.json.attachments[i].delivery = "zip"; p.json.attachments[i].saved_as = "files/" + n; });
  var fn = (String(name || "").trim().replace(/\.zip$/i, "").replace(/[\\/:*?"<>|\x00-\x1f]+/g, "_").trim() || defName()) + ".zip";
  status("", S.zipping);
  return Promise.all(live.map(function (f) { return f.file.arrayBuffer(); })).then(function (bufs) {
   var enc = new TextEncoder(), entries = [{ name: "answers.json", data: enc.encode(JSON.stringify(p.json, null, 2)) }, { name: "answers.md", data: enc.encode(md(p)) }];
   live.forEach(function (f, i) { entries.push({ name: "files/" + f.saveName, data: new Uint8Array(bufs[i]) }); });
   var blob = zipBlob(entries); last.zip = blob; last.zipName = fn;
   dl(fn, blob, "application/zip");
   p.line += " | ZIP: " + fn; showOut(p); status("ok", S.zipped.replace("{f}", fn));
  }).catch(function (e) { status("w", S.zipErr + ": " + (e && e.message)); });
 }
 function shotFile(blob, prefix) { var ext = ((blob.type || "image/png").split("/")[1] || "png").replace("jpeg", "jpg"); return new File([blob], prefix + "_" + stamp() + "." + ext, { type: blob.type || "image/png" }); }
 function pasteShot(t) {
  if (!navigator.clipboard || !navigator.clipboard.read) { status("w", S.noImg); return; }
  navigator.clipboard.read().then(function (items) {
   for (var i = 0; i < items.length; i++) { var ty = items[i].types.filter(function (x) { return /^image\//.test(x); })[0]; if (ty) return items[i].getType(ty).then(function (b) { addFiles(t, [shotFile(b, "screenshot")]); return true; }); }
   status("w", S.noImg); return false;
  }).catch(function () { status("w", S.noImg); });
 }
 function capture(t) {
  navigator.mediaDevices.getDisplayMedia({ video: true }).then(function (stream) {
   var v = document.createElement("video"); v.muted = true; v.srcObject = stream;
   return v.play().then(function () { return new Promise(function (r) { setTimeout(r, 400); }); }).then(function () {
    var c = document.createElement("canvas"); c.width = v.videoWidth; c.height = v.videoHeight; c.getContext("2d").drawImage(v, 0, 0);
    stream.getTracks().forEach(function (tr) { tr.stop(); });
    return new Promise(function (res) { c.toBlob(res, "image/png"); });
   });
  }).then(function (b) { if (b) addFiles(t, [shotFile(b, "capture")]); }).catch(function (e) { if (!e || e.name !== "NotAllowedError") status("w", S.capErr); });
 }
 function status(cls, msg) { stMsg = [cls, msg]; var el = root.querySelector("[data-svst]"); if (el) { el.hidden = false; el.className = "svst " + cls; el.textContent = msg; } }
 function showOut(p) { var out = root.querySelector(".out"); if (out) { out.hidden = false; out.querySelector('[data-o="line"]').textContent = p.line; out.querySelector('[data-o="json"]').textContent = JSON.stringify(p.json, null, 2); } }
 function onPaste(e) {
  if (mode !== "standalone" || !e.clipboardData) return;
  var fl = [].filter.call(e.clipboardData.files || [], function (f) { return f && f.size; });
  if (!fl.length) return;
  e.preventDefault();
  var a = document.activeElement, reg = a && a.closest && a.closest(".adc .reg"), t = "c||";
  if (reg) { var regs = [].slice.call(root.querySelectorAll(".reg")), i = regs.indexOf(reg); if (i >= 0 && attQ(Q[i])) t = "q|" + Q[i].id + "|"; }
  var fid = a && a.getAttribute ? a.getAttribute("data-fid") || "" : "", qOf = function (id) { return Q.filter(function (x) { return x.id === id; })[0]; };
  if (fid.indexOf("an:") === 0) { var aq = qOf(fid.slice(3).split("|")[0]); if (aq && attQ(aq)) t = "a|" + fid.slice(3); }
  else if (fid.indexOf("ot:") === 0) { var oq = qOf(fid.slice(3)); if (oq && oq.m && attQ(oq)) t = "a|" + oq.id + "|" + OTH; }
  else if (fid === "cm:") t = "c||";
  var named = fl.map(function (f, k) { return /^image\//.test(f.type) && /^image\.\w+$/i.test(f.name || "image.png") ? new File([f], "screenshot_" + stamp() + (fl.length > 1 ? "_" + (k + 1) : "") + "." + (f.type.split("/")[1] || "png").replace("jpeg", "jpg"), { type: f.type }) : f; });
  addFiles(t, named);
 }
 if (mode === "standalone") document.addEventListener("paste", onPaste);
 function missingList() {
  var m = []; if (askWho && !who.trim()) m.push({ k: "who" });
  Q.forEach(function (q, i) {
   if (blk(q) && !Object.keys(sel[i]).length) m.push({ k: "q", id: q.id, e: q.m ? S.eM : S.e1, c: 1 });
   else if (sel[i][OTH] && !(other[q.id] || "").trim()) m.push({ k: "q", id: q.id, e: S.eO, c: 2 });
  });
  return m;
 }
 function mtable(rows) { return '<table class="mtb">' + rows.map(function (r) { return "<tr><th>" + esc(r[0]) + "</th><td><bdi>" + esc(r[1]) + "</bdi></td></tr>"; }).join("") + "</table>"; }
 function useZip() { return mode === "standalone" && typeof opts.onSubmit !== "function"; }
 function sendLbl() { return useZip() ? SVG.zip + esc(S.exportZip) : SVG.plane + esc(S.send); }
 function modalHtml() {
  if (!modal) return "";
  var x = '<button type="button" class="mx" data-mclose="1" aria-label="' + esc(S.close) + '" title="' + esc(S.close) + '">' + SVG.x + "</button>", hd, body, btns, big = "";
  if (modal.type === "img") {
   big = " big"; hd = modal.f.name; body = '<img src="' + purl(modal.f) + '" alt="">';
   btns = '<button type="button" class="gbtn" data-mclose="1">' + esc(S.close) + "</button>";
  } else {
   var rows = [[S.mCard, data.id || "—"]]; if (data.ref) rows.push([S.mRef, data.ref]);
   if (modal.type === "miss") {
    hd = S.mTitleMiss;
    body = mtable(rows) + '<div class="mmiss"><b>' + esc(S.mMissing) + ":</b>" + modal.miss.map(function (m) {
     return m.k === "who" ? '<div class="mrow"><b>' + esc(S.who) + '<span class="req">✱</span></b><input type="text" class="wi" data-who="1" placeholder="' + esc(S.whoPh) + '" value="' + esc(who) + '"></div>'
      : '<div class="mrow"><button type="button" class="gbtn sm" data-jump="' + esc(m.id) + '">' + esc(S.go) + " " + esc(m.id) + '</button><span class="merr">' + esc(m.e) + "</span></div>";
    }).join("") + "</div>";
    btns = '<button type="button" class="gbtn" data-mclose="1">' + esc(S.btnBack) + '</button><button type="button" class="send" data-send="1">' + esc(S.cont) + "</button>";
   } else {
    var z = useZip(); hd = z ? S.mTitleOkZ : S.mTitleOkC;
    if (askWho) rows.push([S.who, who.trim()]);
    rows.push([S.mAnswered, modal.answered + " / " + modal.total], [S.mFiles, String(modal.files)]);
    if (modal.mic) rows.push([S.mMic, S.micStopped]);
    body = mtable(rows) + (z ? '<div class="mrow"><b>' + esc(S.mFileName) + '</b><input type="text" class="wi fn" data-fn="1" value="' + esc(fname) + '"><span class="hint">.zip</span></div>' : "") + (!z && mode === "inline" && modal.files ? '<div class="hint">' + esc(S.mChatFiles) + "</div>" : "");
    btns = '<button type="button" class="gbtn" data-mclose="1">' + esc(S.btnCancel) + '</button><button type="button" class="send" data-go="1">' + sendLbl() + "</button>";
   }
  }
  return '<div class="mbg' + (mode === "inline" ? " inl" : "") + '"><div class="mdl' + big + '" role="dialog" aria-modal="true" data-mtype="' + modal.type + '">' + x + "<h2>" + esc(hd) + "</h2>" + body + '<div class="mbtn">' + btns + "</div></div></div>";
 }
 function focusModal() {
  var m = root.querySelector(".mdl"); if (!m) return;
  var f = m.querySelector("input.wi") || m.querySelector(".mbtn .send") || m.querySelector(".mbtn .gbtn");
  if (f) { f.focus(); if (f.dataset && f.dataset.fn) { try { f.setSelectionRange(f.value.length, f.value.length); } catch (e) {} } }
  if (mode === "inline" && m.scrollIntoView) m.scrollIntoView({ block: "center" });
 }
 function doSend() {
  if (rec) { pendingSend = true; try { rec.stop(); } catch (e) { pendingSend = false; rec = null; recFid = null; } if (pendingSend) return; }
  var miss = missingList();
  errs = {}; miss.forEach(function (m) { if (m.k === "who") errs.__who = 1; else errs[m.id] = m.c; });
  if (miss.length) { modal = { type: "miss", miss: miss }; draw(); focusModal(); return; }
  var n = 0; Q.forEach(function (q, i) { if (Object.keys(sel[i]).length) n++; });
  fname = defName();
  if (!useZip() && !on(data.confirm, Q.length > 1)) { modal = { type: "ok" }; go(); return; }
  modal = { type: "ok", answered: n, total: Q.length, files: liveFiles().length, mic: micWasOn };
  draw(); focusModal();
 }
 function go() {
  if (!modal || modal.type !== "ok") return;
  var fi = root.querySelector(".mdl input[data-fn]"); if (fi) fname = fi.value;
  modal = null; micWasOn = false; last = payload(); draw();
  if (typeof opts.onSubmit === "function") { opts.onSubmit(last); status("ok", S.sent); return; }
  if (mode === "inline" && typeof g.sendPrompt === "function") { g.sendPrompt(last.line + "\n```json\n" + JSON.stringify(last.json) + "\n```"); status("ok", S.sent + (last.json.attachments.length ? " — " + S.mChatFiles : "")); return; }
  saveZip(last, fname);
 }
 root.addEventListener("input", function (e) { var t = e.target; if (t.dataset && t.dataset.fn) { fname = t.value; return; } if (t.dataset && t.dataset.who) { who = t.value; if (errs.__who) { delete errs.__who; var we = root.querySelector(".who .merr"); if (we) we.remove(); } return; } if (t.matches && t.matches("textarea.tx")) { setVal(t.getAttribute("data-fid"), t.value); fit(t); var f = t.getAttribute("data-fid"); if (f.indexOf("ot:") === 0) { var qid = f.slice(3); if (errs[qid] === 2) { delete errs[qid]; var er = t.closest(".reg").querySelector(".err"); if (er) er.remove(); } } } });
 root.addEventListener("pointerup", function (e) { var t = e.target; if (t.matches && t.matches("textarea.tx")) heights[t.getAttribute("data-fid")] = t.offsetHeight; });
 root.addEventListener("keydown", function (e) { if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); if (modal && modal.type === "ok") go(); else doSend(); } else if (e.key === "Enter" && modal && e.target.dataset && (e.target.dataset.fn || e.target.dataset.who)) { e.preventDefault(); if (modal.type === "ok") go(); else doSend(); } else if (e.key === "Escape" && modal) { modal = null; draw(); } });
 root.addEventListener("change", function (e) {
  var i = e.target;
  if (i.matches && i.matches("input[type=file]")) { addFiles(i.getAttribute("data-fin"), i.files); i.value = ""; return; }
  if (!i.dataset || i.dataset.q == null) return;
  var qi = +i.dataset.q; if (Q[qi].m) { if (i.checked) sel[qi][i.value] = 1; else delete sel[qi][i.value]; } else { sel[qi] = {}; sel[qi][i.value] = 1; }
  delete errs[Q[qi].id]; draw();
  if (i.value === OTH && i.checked) { var f = root.querySelector('textarea[data-fid="ot:' + Q[qi].id + '"]'); if (f) f.focus(); }
 });
 root.addEventListener("click", function (e) {
  var t = e.target.closest("[data-k],[data-fl],[data-send],[data-a],[data-open],[data-mic],[data-att],[data-rmf],[data-pst],[data-cap],[data-mclose],[data-jump],[data-ad],[data-pv],[data-go]"); if (!t) return;
  if (t.dataset.go) { go(); return; }
  if (t.dataset.pv) { var pf = files.filter(function (f) { return f.id === +t.dataset.pv; })[0]; if (pf) { modal = { type: "img", f: pf }; draw(); focusModal(); } return; }
  if (t.dataset.ad) { var ak = t.dataset.ad; adOpen[ak] = !adOpen[ak]; draw(); if (adOpen[ak]) { var ta = root.querySelector('textarea[data-fid="an:' + ak.replace(/"/g, '\\"') + '"]'); if (ta) ta.focus(); } return; }
  if (t.dataset.k) { var kk = t.dataset.k; open[kk] = !open[kk]; draw(); if (open[kk]) { var u = kk.indexOf("_"), dt = u > 0 ? root.querySelector('textarea[data-fid="an:' + kk.slice(0, u) + "|" + kk.slice(u + 1) + '"]') : null; if (dt) dt.focus(); } return; }
  if (t.dataset.fl) { flip = !flip; open = {}; if (flip) Q.forEach(function (q) { open[q.id] = 1; q.o.forEach(function (o) { open[q.id + "_" + o.k] = 1; }); }); draw(); return; }
  if (t.dataset.open) { openExt(); return; }
  if (t.dataset.mic) { micToggle(t.dataset.mic); return; }
  if (t.dataset.pst) { pasteShot(t.dataset.pst); return; }
  if (t.dataset.cap) { capture(t.dataset.cap); return; }
  if (t.dataset.mclose) { modal = null; draw(); return; }
  if (t.dataset.jump) { var jid = t.dataset.jump; modal = null; draw(); var rg = root.querySelector('.reg[data-qid="' + jid + '"]'); if (rg) { rg.scrollIntoView({ block: "center" }); rg.classList.add("flash"); setTimeout(function () { rg.classList.remove("flash"); }, 1500); } return; }
  if (t.dataset.att) { var fi = root.querySelector('input[data-fin="' + t.dataset.att + '"]'); if (fi) fi.click(); return; }
  if (t.dataset.rmf) { var id = +t.dataset.rmf; files = files.filter(function (f) { if (f.id === id && f.url) URL.revokeObjectURL(f.url); return f.id !== id; }); draw(); return; }
  if (t.dataset.send) { doSend(); return; }
  if (t.dataset.a && last) {
   var js = JSON.stringify(last.json, null, 2), base = (data.id || "CARD") + "_ANSWERS";
   if (t.dataset.a === "copy") { try { navigator.clipboard.writeText(js); } catch (x) {} }
   if (t.dataset.a === "dlj") dl(base + ".json", js, "application/json");
   if (t.dataset.a === "dlm") dl(base + ".md", md(last), "text/markdown");
  }
 });
 draw();
 return { payload: payload, redraw: draw, openUrl: function () { var d = JSON.parse(JSON.stringify(data)); d.lang = L; d._state = stateObj(); return viewer + "#v=" + VER + "&d=" + b64u(JSON.stringify(d)); }, addFiles: addFiles, paste: onPaste, lastResult: function () { return last; } };
}
function fromHash(hash, opts) {
 var m = /[#&]d=([^&]+)/.exec(hash || g.location.hash); if (!m) return null;
 var d = JSON.parse(unb64u(m[1])); opts = opts || {}; if (d._state) { opts.state = d._state; delete d._state; }
 if (!opts.mode) opts.mode = "standalone"; return render(d, opts);
}
g.AiDecisionCard = { render: render, fromHash: fromHash, version: VER, strings: STR, encode: b64u, decode: unb64u };
})(typeof window !== "undefined" ? window : this);
