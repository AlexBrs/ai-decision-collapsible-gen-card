# **Changelog**

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
