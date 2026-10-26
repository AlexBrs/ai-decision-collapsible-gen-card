# **Changelog**

## **v1.0.0 — 2026-10-26**

- First public release of `AiDecisionCard` (`ai-decision-card.js`).
- Radio + checkbox questions; collapsible explanations for questions and answers; Expand ⇄ Collapse all.
- "My own answer" option and per-question comment box (both on by default); Summary comments.
- Blocking validation; recommended answers pre-selected.
- Input: JSON object or string ([schema](schema/input.schema.json)). Output: JSON ([schema](schema/output.schema.json)) + readable line; inline (`sendPrompt`) or standalone (Copy/Download JSON + Markdown).
- i18n with built-in English and Hebrew; full RTL via logical CSS properties.
- Hardened against host-page button styles (prevents squeezed toggle icons in chat sandboxes).
- `render.js`: JSON → self-contained HTML page (no network).
