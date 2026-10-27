# **ai-decision-collapsible-gen-card**

Generic AI questionnaire cards: expandable/collapsible question and answer blocks, radio + checkbox, multi-language with RTL, zero dependencies.

An AI assistant passes **one JSON object**; the engine renders a compact, white decision card and returns the user's answers as **JSON**. The assistant never re-generates the UI, so each card costs only its data.

## **Features**

- Single-choice (radio) and multi-choice (checkbox) questions in one card
- Collapsible "explain" region for every question **and** every answer — collapsed by default
- Global **Expand all ⇄ Collapse all** button
- Recommended answers pre-selected and tagged
- **My own answer** option on every question (free text, required when chosen)
- Optional **comment** box per question + **Summary comments** for the card — multi-line, auto-growing, resizable (Enter / Shift+Enter = new line, **Ctrl+Enter = send**)
- **Attach** files at card, question and selected-answer level; **Ctrl+V** pastes screenshots in the browser page. File content is **never** put inside the JSON:
  - in an AI chat widget, the card lists the files and the user pastes/drops them into the chat after Send;
  - in the browser page, Send saves `answers.json`, `answers.md` and the **real files** into a folder chosen once (File System Access API, Chrome/Edge), falling back to downloads.
- **Dictate** button in the browser page (speech recognition). Chat sandboxes block the microphone, so in a chat the card suggests the OS dictation (Windows: Win+H)
- **Open in browser**: the same card, with current answers, in the [viewer page](https://alexbrs.github.io/ai-decision-collapsible-gen-card/); card data travels only in the link's `#` part
- Blocking validation: nothing is sent until required questions are answered
- Any language; built-in English and Hebrew; full **RTL** mirroring via logical CSS
- Forced light theme; hardened against host button styles (chat sandboxes)
- One file, no dependencies, ~33 KB

## **Quick start — inline (AI chat widget / any web page)**

```html
<div id="q"></div>
<script src="https://cdn.jsdelivr.net/gh/AlexBrs/ai-decision-collapsible-gen-card@v1.1.0/ai-decision-card.js"></script>
<script>
AiDecisionCard.render({
  "id": "DEMO",
  "q": [{ "id": "Q1", "t": "Ship today?", "x": ["All tests pass."],
          "o": [{ "k": "yes", "l": "Yes", "r": 1 }, { "k": "no", "l": "No, wait" }] }]
}, { target: "#q" });
</script>
```

In an environment that provides `sendPrompt(text)` (e.g. Claude inline widgets), **Send answers** posts a readable line plus the JSON output. Elsewhere use `onSubmit` or `mode: "standalone"`.

## **Quick start — standalone (CLI)**

```bash
node render.js examples/generic.json
```

Writes a self-contained HTML page (engine embedded, works offline) and opens it. Answers can be copied or downloaded as JSON / Markdown. Environment: `AIDC_OUT_DIR` (output folder), `AIDC_PREFIX` (file-name prefix).

## **API**

```js
AiDecisionCard.render(input, { target, mode, lang, onSubmit, viewer, state, speechLang })
AiDecisionCard.fromHash(location.hash, { target })   // used by the viewer page
```

| Option | Default | Meaning |
|---|---|---|
| `target` | new `<div>` | Element or CSS selector |
| `mode` | `inline` if `sendPrompt` exists, else `standalone` | `standalone`: Send saves answers + files to a chosen folder, Dictate and Ctrl+V paste enabled, payload panel with Copy/Download |
| `lang` | `input.lang` or `en` | Display language |
| `onSubmit` | — | Receives `{ line, json }`; overrides default sending |
| `viewer` | GitHub Pages viewer | URL for **Open in browser**, or `false` to hide it |
| `state` | — | Restore selections / texts (`{sel, notes, other, cm}`), used by the viewer |
| `speechLang` | from `lang` | Dictation language, e.g. `he-IL` |

## **Input (JSON object or JSON string)** — [`schema/input.schema.json`](schema/input.schema.json)

| Field | Meaning |
|---|---|
| `id`, `lang`, `title` | Card id (echoed in output), display language, optional page title |
| `strings` | Per-language UI text overrides / new languages (`dir` required for a new language) |
| `q[].id`, `q[].t`, `q[].x` | Question key, title, optional explanation bullets |
| `q[].m` | Multi-choice (default `false`) |
| `q[].b` | Blocking / required (default `true`) |
| `q[].c` | Show **My own answer** (default `true`) |
| `q[].n` | Show per-question comment box (default `true`) |
| `q[].a`, `a` | Attach buttons for the question / the card (default `true`) |
| `inbox` | Optional display path shown in the browser page's "Saved to …" message |
| `q[].o[].k`, `.l`, `.d`, `.x`, `.r` | Option key (stable, never translated; `__other` reserved), label, one-line description, explanation bullets, recommended |

Any text field is a string or `{ "en": "...", "he": "..." }`. Omit `x` and no toggle is shown.

## **Output** — [`schema/output.schema.json`](schema/output.schema.json)

```json
{
  "artifact_id": "DEMO", "engine": "AiDecisionCard 1.1.0", "lang": "en",
  "exported_at": "2026-10-26T12:00:00.000Z",
  "answers": {
    "Q1": { "question": "Ship today?", "blocking": true, "multi": false,
            "answer": "__other", "answer_label": "My own answer",
            "own_answer": "Ship tomorrow morning", "notes": "after the demo" }
  },
  "attachments": [ { "level": "question", "question": "Q1", "name": "screenshot_20261027_120000.png", "size": 48211, "type": "image/png",
                     "delivery": "inbox", "saved_as": "DEMO_20261027_120001/screenshot_20261027_120000.png" } ],
  "summary_comments": "", "missing_blocking": []
}
```

Parse by **keys** (`answer`), not by displayed labels.

## **License**

MIT — see [LICENSE](LICENSE).
