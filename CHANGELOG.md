# **Changelog**

## **v1.3.4 — 2026-11-23**

- **Version in the card header** (AlexBrs card ClaudeSetup_ADC_VERSION_SOURCE): the label above the reference ID now reads **AiDecisionCard-ver1.3.4:** — an old engine is visible at a glance.
- The approved version is also published as `approved.json` in this repo (chats without AlexBrs's PC read it there).
- Answers JSON unchanged.

## **v1.3.3 — 2026-11-22**

- **Recording is back** (it was wrongly removed in v1.3.2 — AlexBrs never asked for that). One mic button per comment box, labelled by device:
  - Phone: **Tap mic on keyboard** — Windows: **Win+H** — Mac/Linux: **Dictate**.
  - Where the card can record (Chrome page over https, e.g. Open in browser; PC Chrome), tapping it **records**; the button shows **Listening…** with a red stop icon — tap to stop.
  - Where it cannot (phone chat card in the Claude app, card files from phone storage), the same button puts the cursor in the box so you use the keyboard mic / Win+H.
  - If the microphone never starts, the card resets after 4 s, shows a hint and puts the cursor in the box.
- Phone evidence (AlexBrs 22/11/2026 21:56): card recording works in Chrome on Android via Open in browser.
- Answers JSON unchanged.

## **v1.3.2 — 2026-11-22**

- **Dictation buttons by device** (AlexBrs final decision, 22/11/2026):
  - **Windows PC — always "Win+H"** (chat card and Chrome page). The button puts the cursor in the box; then press Win+H (Windows voice typing). The in-page Dictate button is no longer shown on Windows.
  - **Phone — always "Tap mic on keyboard"** (Hebrew: "הקש על המיקרופון במקלדת"). The button puts the cursor in the box so the keyboard opens; then tap its microphone. The in-page Dictate button is no longer shown on phones.
  - Mac / Linux: unchanged (Dictate button where the browser supports it) — Win+H does not exist there.
- No device icon. Answers JSON unchanged.
- Phone QA 22/11/2026: note — Dictate does work on the https "Open in browser" page in Chrome on Android; AlexBrs chose one consistent rule (keyboard mic) anyway.

## **v1.3.1 — 2026-11-22**

- **Save inside the chat app** (AlexBrs card ClaudeSetup_ADC_V131_SAVE, S1 = hint): the Claude phone app blocks downloads from a chat card. After **Save as HTML file** the card now says "Nothing downloaded (phone app)? Open the card in the browser and save it there." with an **Open in browser** button, instead of claiming the file was downloaded.
- **Fix: "Listening… click to stop" could never be stopped** when the phone never really started the microphone (phone QA 22/11/2026, both in the app Preview and in Chrome). Stop now always resets within 1.5 s, and a microphone that does not start within 4 s resets by itself with a hint.
- **Dictate and Paste screenshot are hidden where they cannot work** (page not secure, e.g. a card file opened from phone storage, or no clipboard support). Attach stays.
- Hints are device-neutral: "use your keyboard's voice typing" / "use Attach and pick the screenshot" (Windows keys kept in brackets).
- **Paste screenshot is hidden on Android**: an Android screenshot is never put in the clipboard. Use Attach (gallery) or + in the chat.
- **"Download started"** instead of "Downloaded": the card cannot know whether the phone really saved the file.
- Chat-card file hint now says: add the files to the chat with +.
- Phone QA 22/11/2026 (AlexBrs, card ClaudeSetup_ADC_V131_PHONE_QA): Save hint + button shown in the chat card; in Chrome Dictate/Paste hidden, Attach works, ZIP contains the attached photo.
- Answers JSON unchanged (same functional suite as v1.3.0).

## **v1.3.0 — 2026-11-22**

- **Look unchanged except two things:** the **Blocking**, **Optional** and **Select all that apply** badges are gone (required stays the red ✱), and line breaking is fixed (long names without spaces stay on a phone screen; Hebrew mixed text such as "2.9 MB" keeps its order). No new rows, links or headings — the option's left toggle remains the only expand control.
- **Option explanations (the real fix).** Option details (`o[].x`) are now mandatory in the skill for every option that is not self-evident, and `render.js` warns about every option without them (`"x":[]` marks an option as intentionally self-evident). An `x` item may be a labelled line `{"h":"Cost","t":"free"}` → **Cost:** free; plain strings still work.
- Includes the v1.2.7 phone layout fix below (v1.2.7 was never tagged on its own).
- QA 22/11/2026: export ZIP, chat submit, required-answer dialog, multi-choice answer notes, own answer, card attachment, Hebrew card and an old card - answers JSON identical to v1.2.7 for the same clicks.
- Output JSON unchanged.

## **v1.2.7 — 2026-11-22** (not tagged; shipped in v1.3.0)

- Phone layout: under 600 px the question title takes the full row and the 'Select all that apply' / 'Blocking' badges wrap onto their own line (no more one-word-per-line titles, no clipped 'Blocking').
- Option names no longer break at hyphens (name on its own line, Recommended + rating badge below).
- Narrower left columns and indents on small screens. Desktop layout unchanged.
- Tested 360 / 390 / 800 (landscape) / 1400 px: no element wider than the screen.

## **v1.2.6 — 2026-11-16**

- **The card now orders the options itself, best answer first.** Previously the reader got whatever
  order the author happened to write, so a weak option could sit above the recommended one — which
  is exactly what happened on card `AB_20261116_1115_ADC_Oic_CONN_AUTOMATION`, where a 5/10 "keep
  doing it by hand" was drawn above the recommended 9/10. Now the rating (`s`) decides: highest at
  the top, lowest at the bottom. Equal ratings put the recommended option (`r`) first. Options with
  no usable rating sit below all rated ones, keeping their authored order among themselves except
  that a recommended one leads them — a recommended option is never buried, rated or not. A rating
  counts as a rating only if it is a finite number or a string that reads as one (`"8"`); anything
  else — missing, empty, blank, text, `true`/`false`, `NaN`, infinity, a list, an object — counts as
  unrated, so a junk value can never float to the top.
- Keys and shapes are unchanged, but **ordering inside the answers payload changes**: each
  question's options, and therefore a multi-select `answer` array, now follow the drawn order
  rather than the authored one.

## **v1.2.5 — 2026-11-08**

- Repository only: the skill document moved into this repository beside the engine, with its card-rule
  history. **No engine change**, which is why a card rendered from the `v1.2.5` tag still reports
  itself as `AiDecisionCard 1.2.4`.

## **v1.2.4 — 2026-11-08**

- File names start with **AiDecisionCard_**: Save as HTML file `AiDecisionCard_<card id>_<YYYYMMDD>_<HHMMSS>.html`; exported ZIP default `AiDecisionCard_<card id>[_<respondent>]_<YYYYMMDD>_<HHMMSS>.zip`; `render.js` page `AiDecisionCard_<card id>_<YYYYMMDD>_<HHMMSS>.html` (seconds added; `AIDC_PREFIX` overrides the prefix, empty = none).

## **v1.2.3 - 2026-11-08**

- Fix: **Open in browser** no longer silently does nothing on a long card. The link now carries the card deflate-compressed (`#z=`) instead of raw base64 (`#d=`) - a seven-question card measured 17,326 characters before and 7,562 after. `fromHash` reads `z=` first and still accepts `d=`, so every link made by an earlier version keeps working.
- New: **Save as HTML file** button on chat cards - downloads the card as one self-contained white page that opens offline, with the current answers already filled in. This is the reliable route when a card is too big for any link.

## **v1.2.2 — 2026-11-08**

- Card header: the reference ID now shows under a label line **AiDecisionCard:** (label on its own line, ID below). Same label replaces "Reference" in the summary dialog (en + he) and "Card ref" in the `merge.js` report. Input/output JSON unchanged (`ref` / `card_ref`).

## **v1.2.1 — 2026-10-28**

- Fix: export no longer fails ("file could not be read") when an attached file is edited, moved or locked after attaching — files are kept in memory from the moment they are attached.
- Layout: **Export answers / Submit** sits on its own line under the summary box (phones no longer squeeze the summary field).
- New: `merge.js` — merges a folder of team ZIPs into one HTML report + merged JSON + files per person, with flags for other cards, broken ZIPs, missing or duplicate names.

## **v1.2.0 — 2026-10-27**

- Browser page: **Export answers (ZIP)** downloads ONE ZIP — answers.json, answers.md and the real files (folder picker removed). Store-only ZIP, UTF-8 names; opens in Windows Explorer, tar and Expand-Archive.
- Two-step dialogs: **Required information missing** (name/ID box, Go to Qx) → **Ready to export / Ready to submit** summary (card, reference, respondent, answered, files, microphone) with an editable **File name**, OK / Cancel / ✕. Chat cards with one question submit at once (`confirm` overrides).
- Chat cards: button **Submit to Claude** (paper plane); browser page: **Export answers (ZIP)** (archive icon).
- Multi-user cards (`who`): required **Your name / ID** → `respondent` and the ZIP name. Red ✱ marks every required item.
- Submit stops a running dictation first and keeps its last words.
- Screenshots: **Paste screenshot** and **Capture screen** buttons; Ctrl+V attaches to the focused box (answer details, own answer, question, card).
- Hover thumbnail + click-to-enlarge preview for attached images. Identical files are skipped anywhere in the card, with a note saying where they already are.
- Single-choice questions: no per-answer Attach (the question's covers it). Multi-choice: one left toggle opens the answer's explanation **and** a details box (comment, Dictate, Attach, Paste, Capture) → `answer_notes`; a dot shows when it holds content.
- New input keys: `title` + `ref` (card header, `card_ref` in output), `v` visuals (built-in icons, SVG path, https image), `s` rating badge (1-10), `who`, `confirm`. Removed: `inbox`.
- Viewer page loads the engine version named in the link (`#v=`), falls back to the bundled engine; the card title replaces the generic heading.
- `render.js --multi`; the page header now comes from the card itself.
- Fixes: Hebrew summary values aligned and bidi-safe; the export status survives redraws.

## **v1.1.0 — 2026-10-27**

- All comment fields are multi-line textareas: auto-grow, vertical resize corner; Enter / Shift+Enter = new line, Ctrl+Enter = send.
- Fix: comment field overflowed the card in chat sandboxes that force text fields to 100% width (measured 36 px).
- Fix: the cursor stays in its text box when the card redraws (after attaching, pasting, selecting).
- New: Attach at card, question and selected-answer level; Ctrl+V screenshot paste in the browser page.
- New: browser page saves answers.json, answers.md and the real files into a chosen inbox folder (fallback: downloads). File content is never placed inside the JSON.
- New: Dictate in the browser page; chat cards suggest Win+H (chat sandboxes block the microphone — measured `not-allowed`).
- New: Open in browser — viewer page (`index.html`, GitHub Pages) restores current answers from the link's `#d=` part.
- Readable answer line flattens new lines; unanswered optional questions show `—`.

## **v1.0.0 — 2026-10-26**

- First public release of `AiDecisionCard` (`ai-decision-card.js`).
- Radio + checkbox questions; collapsible explanations for questions and answers; Expand ⇄ Collapse all.
- "My own answer" option and per-question comment box (both on by default); Summary comments.
- Blocking validation; recommended answers pre-selected.
- Input: JSON object or string ([schema](schema/input.schema.json)). Output: JSON ([schema](schema/output.schema.json)) + readable line; inline (`sendPrompt`) or standalone (Copy/Download JSON + Markdown).
- i18n with built-in English and Hebrew; full RTL via logical CSS properties.
- Hardened against host-page button styles (prevents squeezed toggle icons in chat sandboxes).
- `render.js`: JSON → self-contained HTML page (no network).
