---
name: "ai-decision-card"
description: "Ask Alex every question that has answer options as an AiDecisionCard (data only, pinned engine), batched one card per phase with Recommended tags and 1-10 ratings; for Claude chat and Claude Code."
---

# AiDecisionCard — how to ask Alex a question

Engine: public repo `AlexBrs/ai-decision-collapsible-gen-card`. **This file lives in that repo and
is tagged with the engine, so the skill and the engine always match.** Never name a version here:
read the APPROVED one with `node ~/.claude/tools/approved.js get ai-decision-card-engine`. A newer
release is a CANDIDATE until AlexBrs approves it there - name it and ask, never adopt it silently. Local clone (Windows): `C:\AlexB\GitHub\ai-decision-collapsible-gen-card`. Schemas: `schema/input.schema.json`, `schema/output.schema.json`. Installed copies elsewhere are DERIVATIVES of this file and may lag; this one is authoritative.

**Golden rule: send DATA only.** Never write the card's HTML, CSS or JS yourself, and never paste the engine. That is the whole point: a few KB per card instead of about 55 KB.

## When
- Every question that has answer options, including a single yes/no, approvals and step confirmations.
- **Batch (Alex, 31/10/2026: "dont bother me every min")**: collect all decisions of a phase into ONE card, then execute the whole phase and report once. Stop separately only for: delete, PROD, a failed test, or anything not covered by the approved card.
- Free-text-only questions stay in plain chat.
- Delete / irreversible actions: the card question is Blocking, AND the action still needs its own explicit delete alert (backup location, exact paths) per Alex's rules.
- **PROD**: enlarged red warning visual (`"v":"i:warn"`, "🔴 PRODUCTION" in the title) and a per-occasion approval.
- **Cards meant for other people** (team): first ask "Multi-user card? (default N)". Yes → `"who":1`. Never ask this for Alex's own cards.

## Where (pick by environment)
1. **Inline visual widget available** (Claude app; the visualize `show_widget` tool): the widget code is exactly

```html
<h2 style="position:absolute;left:-9999px">One-sentence summary of the card</h2>
<div id="q"></div>
<script src="https://cdn.jsdelivr.net/gh/AlexBrs/ai-decision-collapsible-gen-card@<APPROVED-TAG-FROM-REGISTRY>/ai-decision-card.js"></script>
<script>AiDecisionCard.render({ ...card data... },{target:"#q"});</script>
```

   No other HTML or CSS (exception: a one-off visual sample sheet Alex asked for — say it costs more tokens). After the widget, write at most one or two lines; never repeat the questions in prose.
2. **Terminal only** (Claude Code CLI, hybrid): 1–2 simple questions → the plain picker (multiSelect + "tick your choice, and also tick Other to add a comment"). More → write the card JSON to `C:\AlexB\AI_Local\Claude\scratch\<id>.json` and run `node C:\AlexB\GitHub\ai-decision-collapsible-gen-card\render.js <that file> [--multi]`. It writes a self-contained white page and opens it in Chrome.
3. **CDN fails** (blank widget or Alex says so): fall back to embedding the engine from the local clone once, and tell Alex it cost more tokens.

## Card data (short keys)
```json
{"id":"Xlsx2Req_NODE_UPG","title":"Node upgrade — backup","ref":"AB_20261027_2340_ADC_Xlsx2Req_NODE_UPG","lang":"en",
 "q":[{"id":"B2","t":"B2: back up current Node (copy only, free)?","v":"i:save",
       "x":["why this matters, one bullet per line"],
       "m":0,"b":1,"c":1,"n":1,"a":1,
       "o":[{"k":"ok","l":"OK, make the backup","d":"one-line effect","x":["details"],"r":1,"s":9},
            {"k":"stop","l":"Stop here","d":"nothing changes","s":4}]}]}
```
| Key | Meaning | Default |
|---|---|---|
| `id` (card) | `<PROJECT>_<TOPIC>`, echoed as `artifact_id`; names the export ZIP | — |
| `title` | Card header title | none |
| `ref` | Reference ID under the title, shown (v1.2.2+) under a label line **AiDecisionCard:** (Alex, 08/11/2026, global); echoed as `card_ref`: `AB_YYYYMMDD_HHMM_ADC_<PROJECT>_<TOPIC>` (keep YYYYMMDD) | none |
| `<PROJECT>` | Short session project name (AB_31102026140000): `Xlsx2Req` for RDW_EXCEL2REQ, `Checkpoint` for RDW_CHECKPOINT_OIC, `ClaudeSetup` for Claude environment work | — |
| `lang` | `en` for technical sessions, `he` (RTL) for personal/admin sessions, per Alex's language rule | `en` |
| `who` | Multi-user: required name/ID → `respondent` + ZIP name | 0 |
| `confirm` | Chat: "Ready to submit" step (default only with 2+ questions) | auto |
| `q[].id` / `t` | Question key / title (prefix with the key, e.g. "B2: …") | — |
| `q[].x` | Explanation bullets (collapsed) — the card must stand alone: everything needed to answer lives inside it, at question AND option level | none |
| `q[].m` | Multi-choice (checkboxes); selected answers get a details box behind the left toggle | 0 |
| `q[].b` | Blocking / required | 1 |
| `q[].c` | "My own answer" option with a text field | 1 |
| `q[].n` | Per-question comment box | 1 |
| `q[].a` / `a` | Attach buttons for the question / the card | 1 |
| `q[].v` / `o[].v` | Visual: `"i:<icon>"` (tray, file, zip, save, share, plane, check, reply, note, info, warn, star, mail, db, mic, clip, paste, scr, ext), `"p:<24x24 svg path>"`, or `"https://…"` image (chat loading unverified) | none |
| `o[].k` | Stable machine key (never translated; `__other` reserved) | — |
| `o[].l` / `d` | Label / one-line effect | — |
| `o[].x` | Answer explanation bullets (collapsed) | none |
| `o[].r` | Recommended: tagged and pre-selected | 0 |
| `o[].s` | Rating 1–10 badge (≥8 green ✓, 5–7 amber ●, ≤4 red ✕). **Give a rating on EVERY option "as usual"**, including the "No/Skip" ones; reason in `d` | none |

Any text can be `"string"` or `{"en":"…","he":"…"}`.

Write good cards:
- One decision per question.
- Mark the recommended option; put ratings on every option.
- Put cost ("free" / amount) and reversibility in `d` or `x`.
- Plain words, no bare internal codes or labels Alex must decode.
- Keep `d` to one line and move detail into `x`. Keep `x` short — it costs tokens even while collapsed.
- Use `v` when a picture decides the choice (icons, layouts).

## What Alex can do in the card (v1.2.4)

File names (v1.2.4+, Alex 08/11/2026, global): every card file starts with `AiDecisionCard_` — Save as HTML file `AiDecisionCard_<card id>_<YYYYMMDD>_<HHMMSS>.html`, ZIP export `AiDecisionCard_<card id>[_<respondent>]_<YYYYMMDD>_<HHMMSS>.zip`, render.js page `AiDecisionCard_<card id>_<YYYYMMDD>_<HHMMSS>.html` (env `AIDC_PREFIX` overrides; empty = none). Don't rename these files by hand.
- Multi-line comment fields (Enter / Shift+Enter = new line, **Ctrl+Enter = submit**), resize corner, red ✱ on required items.
- **Open in browser** opens the same card with his current answers in Chrome (GitHub Pages viewer; data stays in the link's `#` part).
- **Dictation**: chat card → Win+H (the chat sandbox blocks the microphone); browser page → Dictate button, stopped automatically on submit.
- **Files and screenshots**:
  - in a chat card, Attach only *lists* the files (`delivery: "chat"`), and he pastes or drops them into the chat after submitting;
  - in the browser page, Attach, Paste screenshot, Capture screen and Ctrl+V add files; **Export answers (ZIP)** downloads ONE ZIP: `answers.json`, `answers.md`, `files/*` (`delivery: "zip"`, `saved_as`). He attaches the ZIP to the chat.
- Dialogs: "Required information missing" (name/ID box, Go to Qx) → "Ready to export / submit" summary with an editable file name. 1-question chat cards submit at once.

## Reading the answer
In the chat, the user message holds a readable line, then a ```json block — or a ZIP attachment (unzip it, read `answers.json`, view the files):
```json
{"artifact_id":"Xlsx2Req_NODE_UPG","card_ref":"AB_…","engine":"AiDecisionCard 1.2.4","lang":"en","exported_at":"…",
 "answers":{"B2":{"question":"…","blocking":true,"multi":false,"answer":"ok","answer_label":"…","own_answer":"","notes":""}},
 "attachments":[{"level":"question","question":"B2","name":"screenshot.png","size":48211,"type":"image/png","delivery":"zip","saved_as":"files/screenshot.png"}],
 "summary_comments":"","missing_blocking":[],"respondent":{"name":"…"}}
```
- Decide on `answer` keys (string, array for multi, `__other` = own answer in `own_answer`).
- Always read `notes`, `answer_notes` (multi: per selected answer) and `summary_comments`; they often carry new requirements. They may be multi-line.
- `attachments` with `delivery: "chat"` → expect the files in the same or the next message; if they are missing, ask for them.
- Flag anomalies (duplicate files, mismatched counts) immediately.
- File content is never inside the JSON.

## Before showing a card
Per Alex's understand-before-acting rule, when the card approves an action, say in one or two plain lines what it does and what changes if he says yes. After executing, report summary first (status icons with labels), then ask whether he wants the detailed version.