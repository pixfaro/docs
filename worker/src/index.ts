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
 * platform monorepo, so the design-kit token block below is a checked-in
 * VERBATIM snippet of design/ui-mockups-v2.html — re-diff it whenever the
 * kit changes (see TOKENS_CSS). Light theme only, matching pixfaro.com.
 */
import { LLMS, BODY } from "./content.generated";

/** Copied from apps/marketing FAVICON_SVG (the "p" monogram over a beam bar). */
const FAVICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="#0B0C0E"/><text x="16" y="22" font-family="Space Grotesk,sans-serif" font-weight="700" font-size="19" fill="#FDFDFB" text-anchor="middle">p</text><rect x="9" y="25" width="14" height="3" rx="1.5" fill="#B4E33D"/></svg>`;
const FAVICON_DATA_URI = `data:image/svg+xml,${encodeURIComponent(FAVICON_SVG)}`;

/**
 * Brand tokens — copied VERBATIM from design/ui-mockups-v2.html `:root`
 * (the canonical kit; DAS-195 closed the drift from hand-copying).
 * Do NOT hand-edit values here: when the kit changes, re-diff this block
 * against the kit's `:root` and paste it wholesale.
 */
const TOKENS_CSS = `:root{
  --ink:#0B0C0E; --paper:#FDFDFB; --night:#10151C; --beam:#B4E33D; --beam-deep:#4A6414;
  --beam-subtle:#B4E33D2B; --beam-border:#B4E33D66; --ink-muted:#0B0C0EB0; --ink-faint:#0B0C0E14;
  --ok:#00A868; --ok-bg:#00A86814; --err:#E5484D; --err-bg:#E5484D14; --warn:#E5A000; --warn-bg:#E5A00014; --info:#0E6FDE; --info-bg:#0E6FDE14;
  --r-sm:4px; --r-md:6px; --r-lg:8px; --r-xl:12px;
}`;

const PAGE_CSS = `*,*::before,*::after{box-sizing:border-box}
body{margin:0;background:var(--paper);color:var(--ink);font:15px/1.6 "Inter",system-ui,sans-serif;-webkit-font-smoothing:antialiased}
:focus-visible{outline:2px solid var(--beam);outline-offset:2px}
.wrap{max-width:820px;margin:0 auto;padding:0 clamp(20px,5vw,36px)}
.nav{display:flex;align-items:center;justify-content:space-between;gap:16px;border-bottom:1px solid var(--ink-faint);position:sticky;top:0;background:var(--paper);z-index:5;padding:14px clamp(20px,5vw,36px)}
.nav a.brand{color:var(--ink);text-decoration:none}
.wm{font-family:"Space Grotesk";letter-spacing:-.02em;font-weight:300;font-size:20px;line-height:1}.wm b{font-weight:700}
.nav .links{display:flex;align-items:center;gap:8px;font-size:13.5px}
.nav .links a{color:var(--ink-muted);text-decoration:none;font-weight:500;padding:6px 10px;border-radius:var(--r-md)}
.nav .links a:hover{color:var(--ink)}
.nav .links a.on{color:var(--ink);font-weight:500;background:#0B0C0E08}
.btn{font:500 13.5px "Inter";padding:9px 16px;border-radius:var(--r-md);border:1px solid transparent;cursor:pointer;display:inline-flex;align-items:center;gap:7px;text-decoration:none}
.btn.pri{background:var(--ink);color:var(--paper)}
.btn.pri:hover{background:#23252B;text-decoration:none}
.nav .links a.btn.pri{color:var(--paper);padding:9px 16px}
.nav .links a.btn.pri:hover{color:var(--paper);background:#23252B}
@media(max-width:640px){.nav .links a:not(.btn){display:none}}
.hero{padding:clamp(24px,5vw,60px) clamp(20px,5vw,36px) 0}
.seclbl{font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.13em;color:var(--beam-deep);margin-bottom:10px}
h1{font-family:"Space Grotesk",sans-serif;font-size:clamp(36px,6vw,58px);line-height:1;letter-spacing:-.03em;font-weight:700;margin:10px 0 8px}
.hero p{max-width:62ch;color:var(--ink-muted)}
.endpoints{list-style:none;display:flex;flex-wrap:wrap;gap:8px;margin:16px 0 4px;padding:0}
.chip{font-family:"JetBrains Mono",monospace;font-size:11px;font-weight:600;padding:3px 8px;border-radius:var(--r-sm);white-space:nowrap}
.chip.model{background:var(--beam-subtle);border:1px solid var(--beam-border);color:var(--beam-deep)}
.chip.neutral{background:#0B0C0E0a;border:1px solid var(--ink-faint);color:var(--ink)}
.endpoints .chip{display:inline-flex;align-items:center;gap:6px;text-decoration:none}
a.chip:hover{border-color:var(--beam-border)}
.endpoints .chip .k{font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:var(--ink-muted)}
.endpoints .chip code{background:none;border:none;padding:0;color:var(--beam-deep);font-size:inherit}
h2{font-family:"Space Grotesk",sans-serif;font-size:clamp(24px,3.5vw,32px);letter-spacing:-.02em;font-weight:700;margin:44px 0 4px;border-top:1px solid var(--ink-faint);padding-top:28px}
h3{font-family:"Space Grotesk",sans-serif;font-size:19px;font-weight:700;margin:24px 0 6px}
h4{font-size:15.5px;margin:18px 0 6px}
hr{border:none;border-top:1px solid var(--ink-faint);margin:32px 0 0}
p,li{max-width:72ch}
a{color:var(--beam-deep);text-decoration:none;font-weight:600}
a:hover{text-decoration:underline}
code{font-family:"JetBrains Mono",monospace;background:var(--ink-faint);border-radius:var(--r-sm);padding:.08em .35em;font-size:.88em}
pre{background:var(--night);color:#E8EAED;border-radius:var(--r-lg);padding:13px 15px;overflow-x:auto;margin:14px 0;font-size:11.5px;line-height:1.65}
pre code{background:none;border:none;color:inherit;padding:0;font-size:inherit}
pre .a{color:var(--beam)}
pre .c{color:#8A939E}
h2 .chip{margin-left:8px;vertical-align:middle}
.method{display:inline-block;background:var(--beam);color:var(--ink);border-radius:var(--r-sm);padding:.05em .5em;font-family:"JetBrains Mono",monospace;font-weight:600;font-size:.72em;vertical-align:middle;margin-right:2px}
.tbl{overflow-x:auto;margin:18px 0}
table{border-collapse:collapse;width:100%;min-width:540px;font-size:13px}
th,td{text-align:left;padding:9px 10px;border-bottom:1px solid var(--ink-faint);vertical-align:top}
th{color:var(--ink-muted);font-size:11px;letter-spacing:.07em;text-transform:uppercase;font-weight:500;padding:8px 10px;border-bottom:1px solid #0B0C0E22;white-space:nowrap}
td:first-child{white-space:nowrap}
footer{background:var(--night);color:#E8EAEDcc;margin-top:56px;font-size:13px}
footer .cols{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:24px;padding:44px 0;font-size:13px}
footer a{color:#E8EAED99;text-decoration:none;display:block;margin-top:8px;font-weight:500}
footer a:hover{color:#E8EAED;text-decoration:none}
footer .h{font-weight:600;color:#E8EAED;font-size:12.5px;text-transform:uppercase;letter-spacing:.1em}
@media(max-width:760px){footer .cols{grid-template-columns:1fr 1fr}}
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
<nav class="links"><a href="#api">REST API</a><a href="#mcp">MCP</a><a href="https://github.com/pixfaro/mcp">GitHub</a><a href="https://pixfaro.com/dashboard">Dashboard</a><a class="btn pri" href="https://api.pixfaro.com/signup">Start free — $1 credit</a></nav></div>
<div class="wrap hero">
<div class="seclbl">Developer Docs</div>
<h1>Pixfaro API &amp; MCP</h1>
<p>Every image model behind one endpoint: your agent asks for an image; Pixfaro holds the provider accounts, keys, retries and format differences, and bills one prepaid balance.</p>
<ul class="endpoints">
<li><a class="chip neutral" href="https://pixfaro.com"><span class="k">Site</span> pixfaro.com</a></li>
<li><span class="chip neutral"><span class="k">API</span> <code>https://api.pixfaro.com</code></span></li>
<li><span class="chip neutral"><span class="k">MCP</span> <code>https://mcp.pixfaro.com/mcp</code></span></li>
<li><a class="chip neutral" href="/llms.txt"><span class="k">Agents</span> <code>llms.txt</code></a></li>
</ul>

${BODY}
</div>
<footer><div class="wrap cols">
<div><span class="wm" style="color:#FDFDFB"><b>pix</b>faro</span><p style="font-size:12.5px;color:#E8EAED80;margin-top:10px;max-width:240px">Every image model, one port.<br>She Just Works LLC</p></div>
<div><span class="h">Docs</span><a href="#api">REST API</a><a href="#mcp">MCP server</a><a href="/llms.txt">llms.txt</a><a href="https://github.com/pixfaro/docs">Source</a></div>
<div><span class="h">Product</span><a href="https://pixfaro.com/models">Models</a><a href="https://pixfaro.com/pricing">Pricing</a><a href="https://pixfaro.com/dashboard">Dashboard</a><a href="https://github.com/pixfaro/mcp">GitHub</a></div>
<div><span class="h">Legal</span><a href="https://pixfaro.com/terms">Terms of Service</a><a href="https://pixfaro.com/privacy">Privacy Policy</a><a href="https://pixfaro.com/acceptable-use">Acceptable Use</a></div>
</div></footer>
<script>(()=>{const links=[...document.querySelectorAll('.nav .links a[href^="#"]')];const secs=links.map(a=>document.getElementById(a.hash.slice(1))).filter(Boolean);if(!secs.length)return;const sync=()=>{let cur="";for(const s of secs)if(s.getBoundingClientRect().top<=90)cur=s.id;for(const a of links)a.classList.toggle("on",a.hash.slice(1)===cur)};addEventListener("scroll",sync,{passive:true});addEventListener("hashchange",sync);sync()})()</script>
</body></html>`;

export default {
  async fetch(req: Request): Promise<Response> {
    const url = new URL(req.url);
    if (url.pathname === "/llms.txt") return new Response(LLMS, { headers: { "content-type": "text/plain; charset=utf-8" } });
    if (url.pathname === "/api" || url.pathname === "/mcp") return Response.redirect("https://docs.pixfaro.com/#" + url.pathname.slice(1), 302);
    return new Response(PAGE, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=300" } });
  },
} satisfies ExportedHandler;
