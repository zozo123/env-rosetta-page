// Pull bundled cards.json (from raw GitHub, refreshed when env-rosetta repo bumps champion).
const CARDS_URL = "https://raw.githubusercontent.com/zozo123/env-rosetta/main/env-rosetta-page-cards.json";
const FALLBACK = [
  {
    framework: "openenv", name: "OpenEnv", vendor: "Meta",
    sandbox: "rosetta-openenv", share_url: null,
    status: "loading", color: "#3a86ff",
    rollout: { transcript: "loading…", won: false, guesses_used: 0 },
  },
];

function esc(s) {
  if (s == null) return "";
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function colorizeTranscript(text) {
  return esc(text).replace(/WIN[^\n]*/, m => `<span class="ok">${m}</span>`);
}

function renderCard(c) {
  const isLive = c.share_url && c.status === "running";
  const isProc = c.status === "in-process";
  const pill = isLive ? `<span class="pill live">live · ${c.sandbox}</span>`
              : isProc ? `<span class="pill in-process">in-process</span>`
              : `<span class="pill warming">${esc(c.status || "warming")}${c.sandbox ? ` · ${esc(c.sandbox)}` : ""}</span>`;
  const urlHtml = isLive
    ? `<div class="live-url">→ <a href="${esc(c.docs_url || c.share_url)}" target="_blank">${esc(c.share_url)}</a></div>`
    : isProc
    ? `<div class="live-url" style="color:var(--dim)">no server — runs in-process inside the rollout</div>`
    : `<div class="live-url" style="color:var(--dim)">share URL pending</div>`;

  return `
    <article class="card" style="--card-accent: ${esc(c.color)};">
      <div class="head">
        <div class="name">${esc(c.name)}</div>
        <div class="vendor">${esc(c.vendor)}</div>
      </div>
      <div class="status-row">${pill}</div>
      ${urlHtml}
      <div class="section-label">code · ${esc(c.code_excerpt_path || "")}</div>
      <pre class="code-excerpt"><code>${esc(c.code_excerpt || "")}</code></pre>
      <div class="section-label">sample rollout</div>
      <div class="transcript">${colorizeTranscript(c.rollout?.transcript || "")}</div>
    </article>
  `;
}

async function load() {
  let cards = FALLBACK;
  try {
    const r = await fetch(CARDS_URL, { cache: "no-store" });
    if (r.ok) {
      const j = await r.json();
      if (Array.isArray(j) && j.length) cards = j;
    }
  } catch (_) {}

  const grid = document.getElementById("grid");
  grid.innerHTML = cards.map(renderCard).join("");
}
load();
