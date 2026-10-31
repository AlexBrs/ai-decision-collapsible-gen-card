---
name: ai-decision-card
description: Ask the user every question that has answer options (approvals, yes/no, choices, step confirmations) as an AiDecisionCard — a collapsible decision card with recommended options, 1-10 ratings, own answers, comments and file attachments, returning JSON. Batch a whole phase's decisions into one card. Use whenever you need a decision, approval or choice from the user.
---

# AiDecisionCard — ask decisions as a card, not as prose

Engine: `https://github.com/AlexBrs/ai-decision-collapsible-gen-card`, pin a released tag (currently **v1.2.1**).
Schemas: `schema/input.schema.json`, `schema/output.schema.json`.

**Golden rule: send DATA only.** Never write the card's HTML, CSS or JS yourself and never paste the engine — a card costs a few KB of JSON instead of ~55 KB of UI code.

## When
- Every question that has answer options, including a single yes/no or an approval.
- **Batch**: one card per phase with all its decisions, then do the work, then report once. Ask separately only for deletes, production systems, a failed test, or anything the approved card did not cover.
- Free-text-only questions stay in plain chat.
- Irreversible actions: make the question blocking and still confirm the action itself explicitly.
- Production: use the warning visual (`"v":"i:warn"`) and say "PRODUCTION" in the title.
- Cards meant for several people: set `"who":1` (name/ID required).

## Where
1. **Chat app with an inline HTML widget**:
```html
<h2 style="position:absolute;left:-9999px">One-sentence summary of the card</h2>
<div id="q"></div>
<script src="https://cdn.jsdelivr.net/gh/AlexBrs/ai-decision-collapsible-gen-card@v1.2.1/ai-decision-card.js"></script>
<script>AiDecisionCard.render({ ...card data... },{target:"#q"});</script>
```
2. **Terminal agents (Claude Code and similar)**: write the card JSON to a file and run `node <clone>/render.js <file>.json [--multi]` — it writes a self-contained page and opens it in the browser. The user exports the answers (JSON or ZIP) and returns them. For 1–2 trivial questions a plain picker is fine.
3. **Any other web page**: load the same script tag and call `AiDecisionCard.render(data, {target})`.

## Card data (short keys)
```json
{"id":"MYPROJ_BACKUP","title":"Upgrade — backup","ref":"20261031_1200_MYPROJ_BACKUP","lang":"en",
 "q":[{"id":"B2","t":"B2: back up the current version first?","v":"i:save",
       "x":["why this matters, one bullet per line"],"m":0,"b":1,"c":1,"n":1,"a":1,
       "o":[{"k":"ok","l":"Yes, make the backup","d":"Free, reversible","x":["details"],"r":1,"s":9},
            {"k":"stop","l":"Stop here","d":"Nothing changes","s":4}]}]}
```
| Key | Meaning | Default |
|---|---|---|
| `id` | Short card id, include a project prefix (`<PROJECT>_<TOPIC>`); names the export ZIP | — |
| `title` / `ref` | Header / reference shown under it | none |
| `lang` | UI language (`en`, `he` RTL, …) | `en` |
| `who` | Multi-user: respondent name/ID required | 0 |
| `q[].id` / `t` | Question key / title (prefix with the key) | — |
| `q[].x` | Collapsed explanation bullets — the card must be understandable on its own | none |
| `q[].m` `b` `c` `n` `a` | Multi-choice / blocking / "my own answer" / comment box / attach | 0 1 1 1 1 |
| `q[].v` / `o[].v` | `"i:<icon>"` (tray, file, zip, save, share, plane, check, reply, note, info, warn, star, mail, db, mic, clip, paste, scr, ext), `"p:<24x24 svg path>"`, or an https image | none |
| `o[].k` | Stable machine key (`__other` reserved) | — |
| `o[].l` / `d` / `x` | Label / one-line effect (cost, reversibility) / details | — |
| `o[].r` | Recommended: tagged and pre-selected | 0 |
| `o[].s` | Rating 1–10 badge (≥8 green, 5–7 amber, ≤4 red) — give one on every option | none |

Any text can be `"string"` or `{"en":"…","he":"…"}`.

Good cards: one decision per question; plain words, no bare internal codes; cost and undo stated; recommended option marked; ratings on every option.

## Reading the answer
A JSON block (chat) or a ZIP (`answers.json`, `answers.md`, `files/*`) from the browser page:
```json
{"artifact_id":"MYPROJ_BACKUP","card_ref":"…","engine":"AiDecisionCard 1.2.1","answers":{"B2":{"question":"…","blocking":true,"multi":false,"answer":"ok","answer_label":"…","own_answer":"","notes":""}},"attachments":[],"summary_comments":"","missing_blocking":[]}
```
Decide on `answer` keys (array when multi, `__other` → `own_answer`). Always read `notes`, `answer_notes` and `summary_comments` — they often carry new requirements. File contents are never inside the JSON.

## Before showing a card
Tell the user in one or two plain lines what approving it does and what changes.
