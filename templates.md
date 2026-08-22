# Card templates

Not every image needs a model. A **card** is *typeset*, not generated: you send
text, we render it in a real browser and hand back a hosted PNG. Flat **$0.02**,
about two seconds, and the type comes out sharp — which is the one thing image
models still get wrong.

Same key, same balance, same MCP as everything else. A render returns an
`img_…` at `/i/…`, shows up in your history, and can be downloaded, edited or
overlaid like any other image.

```bash
curl https://api.pixfaro.com/v1/renders \
  -H "Authorization: Bearer pf_live_…" -H "Content-Type: application/json" \
  -d '{"template":"quote-card",
       "slots":{"quote":"Stop mistaking silence for nobody'\''s home.","handle":"@dashaworks"},
       "style":"auto"}'
```

```json
{ "id": "img_4e1807777fc895e5642a",
  "url": "https://api.pixfaro.com/i/usr_…/img_….png",
  "kind": "render", "template": "quote-card", "size": "16:9",
  "style": { "palette": "charcoal", "font": "schibsted", "layout": "bold-left", "shadow": true },
  "cost": "0.020", "balance_after": "12.30", "latency_ms": 1412 }
```

## GET /v1/templates

Public, no auth. Every template with its slots, style axes and exact price —
enough to build a form from, which is what the dashboard does.

```json
{ "templates": [
  { "id": "quote-card", "name": "Quote card", "tier": "simple", "price": "0.020",
    "best_for": "one line worth quoting — hooks, testimonials, pull quotes",
    "sizes": ["16:9", "1:1", "4:5", "og"],
    "slots": [ { "name": "quote", "type": "text", "required": true, "max": 280, "hint": "the line itself" } ],
    "styles": { "palettes": ["paper", "charcoal", …], "fonts": ["schibsted", …], "layouts": ["bold-left", …], "shadow": true } } ] }
```

## POST /v1/renders

| Field | What |
|---|---|
| `template` | id from `GET /v1/templates` |
| `slots` | the template's slot values (below) |
| `size` | `16:9` 1200×675 · `1:1` 1080×1080 · `4:5` 1080×1350 · `og` 1200×630 — default `16:9` |
| `style` | omit for the template default, `"auto"`, `"brand"`, or an object of axes |
| `scale` | device pixel ratio: 1, 2 (default) or 3 (+$0.01) |
| `overlay` | optional corner branding, exactly as on a generation |

Scope `generate` is enough — a render is a generation.

### Slots

Text slots take a string and are rejected (never truncated) past their `max`,
so you never pay for a card that quietly lost its last sentence. Image slots
take **only** Pixfaro-hosted references:

| Value | Meaning |
|---|---|
| `"ast_…"` or `{ "asset": "ast_…" }` | an asset you uploaded (`POST /v1/assets`) |
| `"https://api.pixfaro.com/i/…"` | one of your own generated images |
| `"data:image/png;base64,…"` | inline, ≤ 2 MB |
| `"default"` | from your brand identity (`PUT /v1/brand-kit/identity`) |

Arbitrary URLs are refused: the renderer is a real browser, and a fetchable
slot would make every card a probe into whatever that browser can reach.
`"default"` also works on the `name` and `handle` text slots.

### Style

`"auto"` picks a random combination and **avoids the one you used last** on this
template — two cards in a row that differ only in wording read as a bug, not as
a series. `"brand"` paints your saved colours (`identity.palette`). An object
pins whichever axes you name and defaults the rest:

```json
{ "style": { "palette": "charcoal", "font": "instrument", "layout": "block", "shadow": true } }
```

The chosen combination comes back in the response, so a card you like can be
re-rendered exactly.

### Errors

| Code | Meaning |
|---|---|
| `invalid_template` | unknown id — see `GET /v1/templates` |
| `invalid_slot` | with a `slot` field naming which one |
| `asset_not_found` | unknown, deleted, or not yours (404, never an existence oracle) |
| `render_busy` | 429, renderer at capacity — retry; **not charged** |
| `render_failed` | 502; refunded, and `"charged": false` says so |

## POST /v1/assets

Scope `full`. PNG or JPEG, ≤ 5 MB, ≤ 4096 px/side, 100 live per account. Raw
binary with `?kind=avatar`, or JSON:

```bash
curl https://api.pixfaro.com/v1/assets \
  -H "Authorization: Bearer pf_live_…" -H "Content-Type: application/json" \
  -d '{"kind":"avatar","data":"data:image/png;base64,…"}'
```

→ `{ "id": "ast_…", "kind": "avatar", "width": 512, "height": 512 }`

`GET /v1/assets?kind=avatar` lists yours; `DELETE /v1/assets/:id` removes one.
Assets are private — they are never served at a public URL; the renderer reads
them server-side and inlines them into the card.

Uploading a photo of a person means you have the right to use it. Personas are
self-likeness only, and attributing words to someone who did not say them is
impersonation whatever the styling — see the
[acceptable use policy](https://pixfaro.com/acceptable-use).

## Brand identity

`PUT /v1/brand-kit/identity` (scope `full`) is what `"default"` resolves to:

```json
{ "name": "Dasha", "handle": "@dashaworks", "avatar_asset_id": "ast_…",
  "palette": { "bg": "#101014", "ink": "#fdfdfb", "accent": "#b4e33d" } }
```

It sits beside the overlay brand kit (`/v1/brand-kit`) and is cleared
separately.

## Template catalog

| id | Tier | Slots |
|---|---|---|
| `quote-card` | simple · $0.02 | `quote`, `name?`, `handle?`, `avatar?` |
| `post-card` | simple · $0.02 | `text`, `name`, `handle?`, `platform?`, `date?`, `avatar?` |

More arrive with composition — an image slot you can fill with a generation in
the same request.

## Fonts

Cards are set in self-hosted [SIL OFL 1.1](https://openfontlicense.org/) faces —
no font CDN in the render path, so a card is deterministic and its typography
does not depend on a third party being up. The licence text ships beside every
family we serve.

| Face | Class | Cyrillic | Licence |
|---|---|---|---|
| Schibsted Grotesk | sans | — | OFL-1.1 |
| Space Grotesk | sans | — | OFL-1.1 |
| Manrope | sans | ✓ | OFL-1.1 |
| Inter | sans | ✓ | OFL-1.1 |
| Syne | sans | — | OFL-1.1 |
| Bricolage Grotesque | sans | — | OFL-1.1 |
| Fraunces | serif | — | OFL-1.1 |
| Playfair Display | serif | ✓ | OFL-1.1 |
| DM Serif Display | serif | — | OFL-1.1 |
| Instrument Serif | serif | — | OFL-1.1 |
| IBM Plex Mono | mono | ✓ | OFL-1.1 |

Cyrillic text set in a Latin-only face is switched to the closest
Cyrillic-capable face of the same class (Manrope, Playfair Display or IBM Plex
Mono), rather than falling through to a system font mid-headline.
