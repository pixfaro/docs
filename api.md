# REST API

Base URL `https://api.pixfaro.com`. JSON everywhere. Errors use one envelope:

```json
{ "error": { "code": "insufficient_balance", "message": "…", "request_id": "rq_a1c4f0" } }
```

Every response carries an `x-request-id` header — include it when you contact
support. Money is always a **USD decimal string** (`"0.080"`, never a float).
Times are ISO 8601 UTC.

## Authentication

| Principal | How |
|---|---|
| API key | `Authorization: Bearer pf_live_…` |
| MCP | OAuth 2.1 at `https://mcp.pixfaro.com` (remote) or `PIXFARO_KEY` env (stdio) |

Keys are created on the [dashboard](https://api.pixfaro.com/dashboard). Scopes:
`generate` (default — image endpoints only) and `full` (adds balance, billing,
logos, and brand-kit management).

New accounts must verify their email before generating — unverified calls
return `403 email_unverified`. The $1 welcome credit lands on verification
(instantly for Google/GitHub signups).

## POST /v1/images/generations

Generate an image. Sync — the response is the finished image.

```json
{
  "model": "nano-banana-2",
  "prompt": "a lighthouse at night, minimal flat style",
  "aspect_ratio": "16:9",
  "resolution": "1K",
  "overlay": "default"
}
```

| Field | Required | Notes |
|---|---|---|
| `model` | yes | id from `GET /v1/models` |
| `prompt` | yes | 1–4000 chars |
| `aspect_ratio` | no | `"w:h"`, e.g. `"1:1"` (default), `"16:9"`, `"9:16"` |
| `resolution` | no | per-model tiers from `GET /v1/models` `prices` (default `1K`) |
| `overlay` | no | corner branding: `"default"` applies your saved brand kit, or an explicit object (below) |

`n` > 1 and `response_format` other than `"url"` are not supported yet — one
image per request, delivered as a hosted URL (your agent's context never
carries base64).

**200:**

```json
{
  "id": "img_8f2a…", "url": "https://api.pixfaro.com/i/…", "model": "nano-banana-2",
  "resolution": "1K", "latency_ms": 10400, "cost": "0.080", "balance_after": "12.32",
  "overlay_applied": false, "request_id": "rq_a1c4f0"
}
```

**Errors:** `402 insufficient_balance` (body includes `balance`, `needed`,
`topup_url`), `400 invalid_model` / `invalid_prompt` / `invalid_request`,
`403 email_unverified`, `409 model_disabled`, `429 rate_limited`,
`502 provider_failed` — **no charge**, and the body says so explicitly:
`"charged": false`.

### Overlay object

Brands a corner of the image with your handle or logo. Exactly one of `text`
(≤ 64 chars) or `logo_id` (a `logo_…` from `POST /v1/logos`):

```json
{ "overlay": { "text": "@yourbrand", "position": "bottom-right", "opacity": 0.9 } }
```

Optional: `position` (default `bottom-right`), `opacity` (0.2–1.0; text
defaults to 0.9, logos to 1.0), `logo_style` (`sticker` — default — | `shadow`
| `outline` | `none`), `size`,
`margin`, and for text `font` / `weight` / `color` (`"auto"` picks ink or paper
per corner brightness). Save your defaults once via `PUT /v1/brand-kit`, then
`"overlay": "default"` everywhere. A bad overlay fails the request **before**
generation — you are not charged.

## POST /v1/images/edits

Edit a previous generation with a natural-language instruction. Same response
shape as generations.

```json
{ "model": "nano-banana-2", "image": "img_8f2a…", "instruction": "make the sky darker" }
```

- `image` takes an `img_…` id from a previous generation (URLs are not
  accepted).
- `instruction`: 1–4000 chars — what to change; everything else stays put.
- Omitted `aspect_ratio` **keeps the source image's shape** (generations
  default to 1:1).
- Omitted `resolution` inherits — and bills at — the source image's tier.

## GET /v1/models

Public, no auth. Cached ~5 min.

```json
[{ "id": "nano-banana-2", "name": "Nano Banana 2",
   "best_for": "general-purpose images: blog art, social posts, mockups",
   "p50_ms": 10700, "p95_ms": 13600, "price": "0.080",
   "prices": { "1K": "0.080", "2K": "0.121", "4K": "0.181" },
   "mode": "sync", "enabled": true }]
```

`price` is the 1K figure; `prices` maps every supported resolution tier to its
retail price. `enabled: false` marks models that are coming soon (calling one
returns `409 model_disabled`).

## GET /v1/balance

Requires scope `full` (a default `generate` key gets `403 insufficient_scope`).

```json
{ "balance": "12.32" }
```

## Account endpoints (scope `full`)

| Endpoint | What |
|---|---|
| `POST /v1/topups` | `{ "amount_usd": 25 }` → `{ "checkout_url": … }` (Stripe; integer 5–1000, default 10) |
| `GET/PATCH /v1/autoreload` | auto top-up: `{ enabled, threshold, amount, monthly_cap }` — explicit opt-in |
| `POST /v1/logos` | upload a transparent PNG (≤ 1 MB, ≤ 2048px/side, ≤ 10 live logos) — raw binary body, or JSON `{ "image": "<base64 or data URI>", "name"? }` |
| `GET /v1/logos` · `DELETE /v1/logos/:id` | list / remove logos |
| `GET/PUT/DELETE /v1/brand-kit` | saved overlay defaults used by `"overlay": "default"` |

Top-ups, keys, and usage are also on the [dashboard](https://api.pixfaro.com/dashboard).

## POST /v1/abuse-reports

Public, no auth — report a generated image that violates our
[acceptable use policy](https://pixfaro.com/acceptable-use):
`{ "image_url", "reason", "details"?, "reporter_email"? }` — `image_url` must
be a Pixfaro-served image link (`…/i/…`); `reason` is one of `csam`,
`nonconsensual`, `violence_hate`, `infringement`, `other`.

## Rate limits

Fair-use limits apply on auth and abuse-prone endpoints (`429 rate_limited`).
There is no fixed per-key request cap today; sustained high volume is welcome —
talk to us if you're planning a big batch.

## Versioning

Path-versioned (`/v1/`). Additive changes (new optional fields) don't bump the
version; breaking changes go to `/v2/` with 6 months of `/v1/` support. The
`x-pixfaro-deprecation` header announces sunsets ahead of time.
