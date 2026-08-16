# Pixfaro Docs

Public developer documentation for the **Pixfaro** image generation API and MCP server.

Pixfaro puts every major image model behind one API and one MCP connection: your
agent (or your script) asks for an image; Pixfaro holds the provider accounts,
keys, retries and format differences, and bills one prepaid balance.

- **Docs site:** https://docs.pixfaro.com
- **API base:** `https://api.pixfaro.com`
- **MCP endpoint:** `https://mcp.pixfaro.com/mcp`
- **Agent index:** https://docs.pixfaro.com/llms.txt
- **MCP server / CLI source:** https://github.com/pixfaro/mcp

## Quickstart

**Claude Code (MCP):**
```bash
claude mcp add pixfaro -e PIXFARO_KEY=pf_live_… -- npx -y @pixfaro/mcp
```
Or the remote server (OAuth, no key in a config file): add
`https://mcp.pixfaro.com/mcp` as a connector.

**REST:**
```bash
curl -sX POST https://api.pixfaro.com/v1/images/generations \
  -H "authorization: Bearer pf_live_…" -H 'content-type: application/json' \
  -d '{"model":"nano-banana-2","prompt":"a lighthouse at night, minimal flat style","aspect_ratio":"16:9"}'
```

**CLI:**
```bash
PIXFARO_KEY=pf_live_… npx pixfaro gen "a lighthouse at night" -a 16:9 -o cover.png
```

Get an API key at [pixfaro.com](https://pixfaro.com) — top up, no subscription;
new accounts start with $1 of free credit.

See [`api.md`](./api.md) and [`mcp.md`](./mcp.md) for the full reference.

## Editing the docs

`api.md`, `mcp.md`, and `llms.txt` at the repo root are the **single source of
truth**. The docs.pixfaro.com worker page is generated from them: run
`npm run gen` in `worker/` to regenerate `worker/src/content.generated.ts`
(never edit that file by hand — it's overwritten, and `npm run check` fails
CI-style if it drifts). Deploys (`npm run deploy`) regenerate automatically.

Found a mistake, or something the docs don't answer? [Open an
issue](https://github.com/pixfaro/docs/issues) — issues here double as public
support.

---
© Pixfaro · content licensed CC-BY-4.0
