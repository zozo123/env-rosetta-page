// Simple gallery: 4 framework cards, each showing vendor + code excerpt + sample rollout.
// We don't display share URLs — they're short-lived; the point is the side-by-side comparison.
const CARDS_URL = "https://raw.githubusercontent.com/zozo123/env-rosetta/main/env-rosetta-page-cards.json";

const FALLBACK = [
  { framework: "openenv",   name: "OpenEnv",   vendor: "Meta",                 color: "#8b5cf6",
    code_excerpt_path: "envs/wordle_env/openenv/server/app.py", code_excerpt: "",
    rollout: { transcript: "" } },
  { framework: "ors",       name: "ORS",       vendor: "Open Reward Standard", color: "#a78bfa",
    code_excerpt_path: "envs/wordle_env/ors/server.py", code_excerpt: "",
    rollout: { transcript: "" } },
  { framework: "nemo_gym",  name: "NeMo Gym",  vendor: "NVIDIA",               color: "#7c3aed",
    code_excerpt_path: "envs/wordle_env/nemo_gym/server.py", code_excerpt: "",
    rollout: { transcript: "" } },
  { framework: "verifiers", name: "Verifiers", vendor: "@willccbb",            color: "#a78bfa",
    code_excerpt_path: "envs/wordle_env/verifiers/env.py", code_excerpt: "",
    rollout: { transcript: "" } },
];

function esc(s) {
  if (s == null) return "";
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function colorizeTranscript(text) {
  return esc(text).replace(/WIN[^\n]*/, m => `<span class="ok">${m}</span>`);
}

function renderCard(c) {
  const repoPath = c.code_excerpt_path
    ? `https://github.com/adithya-s-k/RL_Envs_101/blob/main/${c.code_excerpt_path}`
    : null;
  const fileLink = repoPath
    ? `<a href="${esc(repoPath)}" target="_blank">${esc(c.code_excerpt_path)}</a>`
    : esc(c.code_excerpt_path || "");

  return `
    <article class="card" style="--card-accent: ${esc(c.color || "#8b5cf6")};">
      <div class="head">
        <div class="name">${esc(c.name)}</div>
        <div class="vendor">${esc(c.vendor)}</div>
      </div>
      <div class="section-label">${fileLink}</div>
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
