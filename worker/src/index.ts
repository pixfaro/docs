/**
 * docs.pixfaro.com — on-brand single-page developer docs + llms.txt.
 *
 * Content comes from the repo-root markdown (api.md, mcp.md, llms.txt) — the
 * single source of truth — compiled at build time into content.generated.ts
 * by scripts/gen-content.mjs (`npm run gen`, wired into `npm run deploy`).
 * Only the page shell (head, CSS, hero, footer) is hand-authored here.
 *
 * Styling: the Pixfaro design system (ink/paper + terminal-lime "beam",
 * Space Grotesk / Inter / JetBrains Mono). This repo can't import the
 * platform monorepo, so the token values below are copied by hand from
 * apps/marketing/src/index.ts — keep them in sync if the brand tokens change.
 * Light theme only, matching pixfaro.com.
 */
import { LLMS, BODY } from "./content.generated";

/** Copied from apps/marketing FAVICON_SVG (the "p" monogram over a beam bar). */
const FAVICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="#0B0C0E"/><text x="16" y="22" font-family="Space Grotesk,sans-serif" font-weight="700" font-size="19" fill="#FDFDFB" text-anchor="middle">p</text><rect x="9" y="25" width="14" height="3" rx="1.5" fill="#B4E33D"/></svg>`;
const FAVICON_DATA_URI = `data:image/svg+xml,${encodeURIComponent(FAVICON_SVG)}`;

/** Brand tokens, copied from apps/marketing/src/index.ts `:root`. */
const TOKENS_CSS = `:root{--ink:#0B0C0E;--paper:#FDFDFB;--night:#10151C;--beam:#B4E33D;--beam-deep:#4A6414;--beam-subtle:#B4E33D2B;--beam-border:#B4E33D66;--ink-muted:#0B0C0EB0;--ink-faint:#0B0C0E14;--r-sm:6px;--r-md:10px}`;

const PAGE_CSS = `*,*::before,*::after{box-sizing:border-box}
body{margin:0;background:var(--paper);color:var(--ink);font:15px/1.6 "Inter",system-ui,sans-serif;-webkit-font-smoothing:antialiased}
:focus-visible{outline:2px solid var(--beam);outline-offset:2px}
.wrap{max-width:820px;margin:0 auto;padding:0 clamp(20px,5vw,36px)}
.nav{display:flex;align-items:center;justify-content:space-between;gap:16px;border-bottom:1px solid var(--ink-faint);position:sticky;top:0;background:var(--paper);z-index:5;padding:14px clamp(20px,5vw,36px)}
.nav a.brand{color:var(--ink);text-decoration:none}
.wm{font-family:"Space Grotesk";letter-spacing:-.02em;font-weight:300;font-size:20px;line-height:1}.wm b{font-weight:700}
.nav .links{display:flex;gap:18px;font-size:13.5px}
.nav .links a{color:var(--ink-muted);text-decoration:none;font-weight:500}
.nav .links a:hover{color:var(--ink)}
.hero{padding:clamp(24px,5vw,60px) clamp(20px,5vw,36px) 0}
.eyebrow{font-family:"JetBrains Mono",monospace;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--beam-deep);font-weight:600}
h1{font-family:"Space Grotesk",sans-serif;font-size:clamp(36px,6vw,58px);line-height:1;letter-spacing:-.03em;font-weight:700;margin:10px 0 8px}
.hero p{max-width:62ch;color:var(--ink-muted)}
.endpoints{list-style:none;display:flex;flex-wrap:wrap;gap:8px;margin:16px 0 4px;padding:0}
.endpoints .chip{display:inline-flex;align-items:center;gap:8px;background:#fff;border:1px solid var(--ink-faint);border-radius:999px;padding:6px 12px;font-weight:600;color:var(--ink);text-decoration:none;font-size:13px}
a.chip:hover{border-color:var(--beam-border)}
.endpoints .chip .k{font-family:"JetBrains Mono",monospace;font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:var(--ink-muted);font-weight:600}
.endpoints .chip code{background:none;border:none;padding:0;color:var(--beam-deep);font-size:12.5px}
h2{font-family:"Space Grotesk",sans-serif;font-size:clamp(24px,3.5vw,32px);letter-spacing:-.02em;font-weight:700;margin:44px 0 4px;border-top:1px solid var(--ink-faint);padding-top:28px}
h3{font-family:"Space Grotesk",sans-serif;font-size:19px;font-weight:700;margin:24px 0 6px}
h4{font-size:15.5px;margin:18px 0 6px}
hr{border:none;border-top:1px solid var(--ink-faint);margin:32px 0 0}
p,li{max-width:72ch}
a{color:var(--beam-deep);text-decoration:none;font-weight:600}
a:hover{text-decoration:underline}
code{font-family:"JetBrains Mono",monospace;background:var(--ink-faint);border-radius:var(--r-sm);padding:.08em .35em;font-size:.88em}
pre{background:var(--night);color:#E8EAED;border-radius:var(--r-md);padding:18px 20px;overflow-x:auto;margin:14px 0;font-size:13px;line-height:1.55}
pre code{background:none;border:none;color:inherit;padding:0;font-size:inherit}
.pill{display:inline-block;background:var(--beam-subtle);color:var(--beam-deep);border:1px solid var(--beam-border);border-radius:999px;padding:.12em .7em;font-family:"JetBrains Mono",monospace;font-size:11px;font-weight:600;margin-left:8px;vertical-align:middle}
.method{display:inline-block;background:var(--beam);color:var(--ink);border-radius:var(--r-sm);padding:.05em .5em;font-family:"JetBrains Mono",monospace;font-weight:600;font-size:.72em;vertical-align:middle;margin-right:2px}
.tbl{overflow-x:auto;margin:18px 0;border:1px solid var(--ink-faint);border-radius:var(--r-md);background:#fff}
table{border-collapse:collapse;width:100%;min-width:540px;font-size:14px}
th,td{text-align:left;padding:12px 16px;border-bottom:1px solid var(--ink-faint);vertical-align:top}
table tr:last-child td{border-bottom:none}
th{color:var(--ink-muted);font-family:"JetBrains Mono",monospace;font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;font-weight:600}
td:first-child{white-space:nowrap}
footer{margin-top:56px;border-top:1px solid var(--ink-faint);padding:20px clamp(20px,5vw,36px) clamp(24px,5vw,64px);color:var(--ink-muted);font-size:13px}
footer a{color:var(--ink-muted);text-decoration:underline;font-weight:500}
ul,ol{padding-left:22px}
ol li{margin:4px 0}
`;

const PAGE = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Pixfaro — Developer Docs (Image Generation API & MCP)</title>
<meta name="description" content="REST API + MCP server reference for Pixfaro: every image model behind one endpoint, one key, one prepaid balance.">
<meta property="og:title" content="Pixfaro Developer Docs">
<meta property="og:description" content="Image generation API + MCP server reference — every major model, one key, one prepaid balance.">
<link rel="icon" type="image/svg+xml" href="${FAVICON_DATA_URI}">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;500;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;600&display=swap">
<style>${TOKENS_CSS}
${PAGE_CSS}</style></head><body>
<div class="nav"><a class="brand" href="https://pixfaro.com" aria-label="Pixfaro home"><span class="wm"><b>pix</b>faro</span></a>
<nav class="links"><a href="#api">REST API</a><a href="#mcp">MCP</a><a href="https://github.com/pixfaro/mcp">GitHub</a><a href="https://pixfaro.com/dashboard">Dashboard</a></nav></div>
<div class="wrap hero">
<p class="eyebrow">Developer Docs</p>
<h1>Pixfaro API &amp; MCP</h1>
<p>Every image model behind one endpoint: your agent asks for an image; Pixfaro holds the provider accounts, keys, retries and format differences, and bills one prepaid balance.</p>
<ul class="endpoints">
<li><a class="chip" href="https://pixfaro.com"><span class="k">Site</span> pixfaro.com</a></li>
<li><span class="chip"><span class="k">API</span> <code>https://api.pixfaro.com</code></span></li>
<li><span class="chip"><span class="k">MCP</span> <code>https://mcp.pixfaro.com/mcp</code></span></li>
<li><a class="chip" href="/llms.txt"><span class="k">Agents</span> <code>llms.txt</code></a></li>
</ul>

${BODY}
</div>
<footer><div class="wrap">© Pixfaro · source: <a href="https://github.com/pixfaro/docs">github.com/pixfaro/docs</a> · <a href="https://pixfaro.com/terms">Terms</a> · <a href="https://pixfaro.com/privacy">Privacy</a></div></footer>
</body></html>`;

export default {
  async fetch(req: Request): Promise<Response> {
    const url = new URL(req.url);
    if (url.pathname === "/llms.txt") return new Response(LLMS, { headers: { "content-type": "text/plain; charset=utf-8" } });
    if (url.pathname === "/api" || url.pathname === "/mcp") return Response.redirect("https://docs.pixfaro.com/#" + url.pathname.slice(1), 302);
    return new Response(PAGE, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=300" } });
  },
} satisfies ExportedHandler;
