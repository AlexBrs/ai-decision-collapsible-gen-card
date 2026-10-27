# **Changelog**

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
