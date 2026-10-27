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
- Card header with **title** and **reference ID**; optional **visuals** (built-in icons, SVG path, image) and **rating badges** (✓ 8/10 green, ● 5-7 amber, ✕ ≤4 red) per answer
- Multi-choice answers: the left toggle opens the explanation **and** a details box (comment + tools) per selected answer
- **Attach** files at card and question level (and per selected multi-choice answer); **Paste screenshot**, **Capture screen** and **Ctrl+V** (to the focused box) in the browser page; image previews; duplicates skipped. File content is **never** put inside the JSON:
  - in an AI chat widget, the card lists the files and the user pastes/drops them into the chat after submitting;
  - in the browser page, **Export answers (ZIP)** downloads ONE ZIP: `answers.json`, `answers.md` and the **real files**.
- **Multi-user cards** (`who`): required name/ID → `respondent` and the ZIP name — send one link to a team, collect the ZIPs back
- Dialogs: **Required information missing** → **Ready to export / submit** summary with editable file name, Cancel / ✕
- **Dictate** button in the browser page (stops automatically on submit). Chat sandboxes block the microphone, so in a chat the card suggests the OS dictation (Windows: Win+H)
- **Open in browser**: the same card, with current answers, in the [viewer page](https://alexbrs.github.io/ai-decision-collapsible-gen-card/); card data travels only in the link's `#` part
- Blocking validation: nothing is sent until required questions are answered
- Any language; built-in English and Hebrew; full **RTL** mirroring via logical CSS
- Forced light theme; hardened against host button styles (chat sandboxes)
- One file, no dependencies, ~55 KB

## **Quick start — inline (AI chat widget / any web page)**

```html
<div id="q"></div>
<script src="https://cdn.jsdelivr.net/gh/AlexBrs/ai-decision-collapsible-gen-card@v1.2.1/ai-decision-card.js"></script>
<script>
AiDecisionCard.render({
  "id": "DEMO",
  "q": [{ "id": "Q1", "t": "Ship today?", "x": ["All tests pass."],
          "o": [{ "k": "yes", "l": "Yes", "r": 1 }, { "k": "no", "l": "No, wait" }] }]
}, { target: "#q" });
</script>
```

In an environment that provides `sendPrompt(text)` (e.g. Claude inline widgets), **Submit to Claude** posts a readable line plus the JSON output. Elsewhere use `onSubmit` or `mode: "standalone"`.

## **Quick start — standalone (CLI)**

```bash
node render.js examples/generic.json [--multi]
```

Writes a self-contained HTML page (engine embedded, works offline) and opens it. `--multi` makes it a multi-user card. Answers can be copied or downloaded as JSON / Markdown. Environment: `AIDC_OUT_DIR` (output folder), `AIDC_PREFIX` (file-name prefix).

## **Team answers — merge**

```bash
node merge.js <folder with the team's ZIPs> [--no-open]
```

Reads every ZIP exported from a multi-user card (`who`) and writes `_merged_<YYYYMMDD_HHMMSS>/` next to them: `REPORT_<card id>_<stamp>.html` (respondents, votes per answer with names, own answers, comments, per-answer comments, files with previews), `MERGED_<card id>_<stamp>.json` and `files/<respondent>/…`. ZIPs of another card, broken ZIPs, missing names and duplicate names are flagged in the report, never silently fixed. Store and deflate ZIPs are both read.

## **API**

```js
AiDecisionCard.render(input, { target, mode, lang, onSubmit, viewer, state, speechLang })
AiDecisionCard.fromHash(location.hash, { target })   // used by the viewer page
```

| Option | Default | Meaning |
|---|---|---|
| `target` | new `<div>` | Element or CSS selector |
| `mode` | `inline` if `sendPrompt` exists, else `standalone` | `standalone`: Export answers (ZIP), Dictate, Paste / Capture screenshot, payload panel with Copy/Download |
| `lang` | `input.lang` or `en` | Display language |
| `onSubmit` | — | Receives `{ line, json }`; overrides default sending |
| `viewer` | GitHub Pages viewer | URL for **Open in browser**, or `false` to hide it |
| `state` | — | Restore selections / texts (`{sel, notes, other, ansN, cm, who}`), used by the viewer |
| `speechLang` | from `lang` | Dictation language, e.g. `he-IL` |

## **Input (JSON object or JSON string)** — [`schema/input.schema.json`](schema/input.schema.json)

| Field | Meaning |
|---|---|
| `id`, `lang`, `title`, `ref` | Card id (echoed in output, used in the ZIP name), display language, card title, reference ID (shown under the title, echoed as `card_ref`) |
| `who` | Multi-user card: required name/ID (default `false`) |
| `confirm` | Chat cards: show **Ready to submit** (default: only with 2+ questions) |
| `strings` | Per-language UI text overrides / new languages (`dir` required for a new language) |
| `q[].id`, `q[].t`, `q[].x` | Question key, title, optional explanation bullets |
| `q[].m` | Multi-choice (default `false`) |
| `q[].b` | Blocking / required (default `true`) |
| `q[].c` | Show **My own answer** (default `true`) |
| `q[].n` | Show per-question comment box (default `true`) |
| `q[].a`, `a` | Attach buttons for the question / the card (default `true`) |
| `q[].o[].k`, `.l`, `.d`, `.x`, `.r`, `.s` | Option key (stable, never translated; `__other` reserved), label, one-line description, explanation bullets, recommended, rating 1-10 |
| `q[].v`, `q[].o[].v` | Visual: `"i:check"` built-in icon, `"p:<path d>"` 24×24 SVG path, or `"https://…"` image |

Any text field is a string or `{ "en": "...", "he": "..." }`. Omit `x` and no toggle is shown.

## **Output** — [`schema/output.schema.json`](schema/output.schema.json)

```json
{
  "artifact_id": "DEMO", "card_ref": "AB_20261027_1200_ADC_DEMO", "engine": "AiDecisionCard 1.2.0", "lang": "en",
  "exported_at": "2026-10-26T12:00:00.000Z",
  "answers": {
    "Q1": { "question": "Ship today?", "blocking": true, "multi": false,
            "answer": "__other", "answer_label": "My own answer",
            "own_answer": "Ship tomorrow morning", "notes": "after the demo" }
  },
  "attachments": [ { "level": "question", "question": "Q1", "name": "screenshot_20261027_120000.png", "size": 48211, "type": "image/png",
                     "delivery": "zip", "saved_as": "files/screenshot_20261027_120000.png" } ],
  "summary_comments": "", "missing_blocking": [], "respondent": { "name": "Dana" }
}
```

Parse by **keys** (`answer`), not by displayed labels.

## **License**

MIT — see [LICENSE](LICENSE).
