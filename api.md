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

`GET /v1/key` answers "does this key work?" for **any** scope, free:
`{ "key": { "name", "prefix", "last4", "scope", "created_at" }, "email_verified": true }`
(plus `"balance"` for `full` keys). Run it after setup — `GET /v1/models` is
public and says nothing about your key. An unknown key answers `401`: keys are
shown once at creation, so copy the whole `pf_live_…` string or mint a new one.

New accounts must verify their email before generating — unverified calls
return `403 email_unverified`. The $1 welcome credit lands on verification
(instantly for Google/GitHub signups).

## POST /v1/images/generations

Generate an image. **Fast models answer `200` with the finished image; slow
models answer `202` with a job to poll** — which is which is the `mode` field
in [`GET /v1/models`](#get-v1models) (`"sync"` or `"async"`). Write your client
for both: a `202` is a success, not an error.

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
| `prompt` | yes | 1–4000 chars; a few models accept less — `max_prompt_chars` in `GET /v1/models` (over it: `400 invalid_prompt` naming the limit, no charge) |
| `aspect_ratio` | no | a ratio `"w:h"`, e.g. `"1:1"` (default), `"16:9"`, `"9:16"`; each model's verified list is `aspect_ratios` in `GET /v1/models`. Pixel dimensions (`"1200:628"`) snap to the nearest verified ratio |
| `mode` | no | `"auto"` (default: the model decides), `"async"` (always a job), `"sync"` (refused with `409 model_disabled` on an async-only model) |
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

**202 (async models — `qwen-image`, `seedream-lite`, `gpt-5-image`, `gpt-5-image-mini` today; always check `mode`):**

```json
{ "job_id": "j_a1c4…", "status": "queued", "poll": "/v1/jobs/j_a1c4…", "eta_s": 55 }
```

The balance is debited when the job is accepted (a `402` is still immediate),
and refunded automatically if the job fails. Poll [`GET /v1/jobs/:id`](#get-v1jobsid)
until it is `succeeded` or `failed`.

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

## GET /v1/jobs/:id

The status of an async generation or edit. Same key (or dashboard session) that
submitted it; someone else's id answers `404`. Jobs are kept **24 hours** —
the image itself stays in your history and at its URL.

| `status` | Body |
|---|---|
| `queued` / `running` | `{ "job_id", "status", "eta_s" }` — poll again in a few seconds |
| `succeeded` | the same body a sync `200` returns (`id`, `url`, `model`, `resolution`, `latency_ms`, `cost`, …) **without `balance_after`** — it would be stale by the time you poll; sum `cost`, or read `GET /v1/balance` with a `full` key |
| `failed` | `{ "error": { "code", "message" }, "charged": false }` — a failed job is refunded automatically; `charged` says so explicitly |

```bash
JOB=$(curl -s https://api.pixfaro.com/v1/images/generations \
  -H "Authorization: Bearer pf_live_…" -H "Content-Type: application/json" \
  -d '{"model":"gpt-5-image","prompt":"a lighthouse at night","aspect_ratio":"3:2"}' | jq -r .job_id)

while :; do
  R=$(curl -s "https://api.pixfaro.com/v1/jobs/$JOB" -H "Authorization: Bearer pf_live_…")
  case "$(echo "$R" | jq -r .status)" in queued|running) sleep 5 ;; *) break ;; esac
done
echo "$R" | jq -r '.url // .error.message'
```

Up to 10 jobs may be in flight per account (`429 rate_limited` beyond that).
Lost a `job_id`? Every finished image is in the dashboard under
[Generations](https://api.pixfaro.com/dashboard/generations), with download and CSV export.

## GET /v1/models

Public, no auth. Cached ~5 min.

```json
[{ "id": "nano-banana-2", "name": "Nano Banana 2",
   "best_for": "general-purpose images: blog art, social posts, mockups",
   "p50_ms": 10700, "p95_ms": 13600, "price": "0.080",
   "prices": { "1K": "0.080", "2K": "0.121", "4K": "0.181" },
   "aspect_ratios": ["1:1", "2:3", "3:2", "3:4", "4:3", "4:5", "5:4", "9:16", "16:9", "21:9"],
   "max_prompt_chars": 4000,
   "mode": "sync", "enabled": true }]
```

`mode` is `"sync"` (the generation call returns the image) or `"async"` (it
returns a job — see [`GET /v1/jobs/:id`](#get-v1jobsid)); it follows the model's
measured latency, so read it rather than hardcoding a list. `aspect_ratios` are
the shapes verified to work on that model; `max_prompt_chars` is its prompt ceiling.

`price` is the 1K figure; `prices` maps every supported resolution tier to its
retail price. `enabled: false` marks models that are coming soon (calling one
returns `409 model_disabled`).

## POST /v1/renders

Typeset a card from a template instead of generating one — flat $0.02, ~2s,
sharp type. Full reference: [Card templates](#templates).

```bash
curl https://api.pixfaro.com/v1/renders -H "Authorization: Bearer pf_live_…" \
  -H "Content-Type: application/json" \
  -d '{"template":"quote-card","slots":{"quote":"Ship it.","handle":"@you"},"style":"auto"}'
```

A render is a generation: it returns an `img_…`, lands in your history, and is
debited and refunded by the same rules.

## GET /v1/templates

Public, no auth — the card catalog with slots, style axes and price. See
[Card templates](#templates).

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
| `POST /v1/assets` | upload a PNG/JPEG (≤ 5 MB, ≤ 4096px/side, ≤ 100 live) for card slots — raw binary with `?kind=`, or JSON `{ "kind", "data" }` |
| `GET /v1/assets` · `DELETE /v1/assets/:id` | list / remove assets |
| `GET/PUT/DELETE /v1/brand-kit/identity` | name, handle, avatar and palette — what `"default"` resolves to in a card slot |

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
