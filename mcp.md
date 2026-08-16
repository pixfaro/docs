# MCP server

One MCP connection gives your agent every major image model. Two ways in:

| Transport | For | How |
|---|---|---|
| **Remote** (streamable HTTP + OAuth 2.1) | claude.ai, Claude Desktop, any HTTP-capable client | add `https://mcp.pixfaro.com/mcp` — the client runs the OAuth flow, you sign in with your Pixfaro account |
| **Local** (stdio, npm) | Claude Code, Cursor, Windsurf, config-file setups | `npx -y @pixfaro/mcp` with `PIXFARO_KEY` in env |

Source: [github.com/pixfaro/mcp](https://github.com/pixfaro/mcp) — the client is
intentionally small enough to read before you hand it a key.

## Setup

**Claude Code:**
```bash
claude mcp add pixfaro -e PIXFARO_KEY=pf_live_… -- npx -y @pixfaro/mcp
```

**Cursor / Windsurf / Claude Desktop** (config file):
```json
{
  "mcpServers": {
    "pixfaro": {
      "command": "npx",
      "args": ["-y", "@pixfaro/mcp"],
      "env": { "PIXFARO_KEY": "pf_live_…" }
    }
  }
}
```

**claude.ai / Claude Desktop connector (remote, no key in a file):** add custom
connector with URL `https://mcp.pixfaro.com/mcp`.

## Tools

| Tool | What it does |
|---|---|
| `generate_image` | prompt (+ optional `model`, `aspect_ratio`) → hosted image URL, with cost and remaining balance in the reply |
| `edit_image` | natural-language edit of a previous generation by its `img_…` id |
| `list_models` | live models with price, latency, and what each is best for |
| `get_balance` | current prepaid balance |

Replies are agent-readable text carrying a hosted URL — never base64, so your
agent's context stays small. When the balance runs low, replies append a
top-up warning.

## Environment (stdio)

| Variable | Meaning |
|---|---|
| `PIXFARO_KEY` | API key (`pf_live_…`) from [pixfaro.com](https://pixfaro.com) |
| `PIXFARO_API_URL` | endpoint override (staging / self-hosted) |

## CLI

The same repo ships the `pixfaro` CLI for scripts, CI, and pipelines — the
literal one-command time-to-first-image:

```bash
export PIXFARO_KEY=pf_live_…
npx pixfaro gen "a lighthouse at night, minimal flat style" -a 16:9 -o cover.png
npx pixfaro edit img_8f2a… "make the sky darker" -o v2.png
npx pixfaro models
npx pixfaro balance
```

`-o` downloads the image; without it the CLI prints the hosted URL. A failed
download never swallows the URL you already paid for.
