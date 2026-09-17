/**
 * Open Graph share-image generator.
 *
 * Renders a 1200x630 card per page in headless Edge and screenshots it, so the
 * share images use the same fonts, palette and gradient as the site itself
 * rather than drifting from it. Run with `node tools/build/og.mjs`.
 */

import { execFile } from "node:child_process";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

import { esc, site } from "./site.mjs";

const run = promisify(execFile);
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../..");
const TMP = path.join(ROOT, ".og-tmp");

const EDGE_CANDIDATES = [
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
];

const TAGLINE = "AI-powered Skills & Learning Intelligence";

/**
 * Card copy per image. The headline is the promise, not the SEO title — these
 * are read at a glance in a social feed.
 */
const CARDS = {
  home: ["AI-powered Skills & Learning Intelligence", "Measure Skills. Personalize Learning. Build Better Futures."],
  platform: ["Platform", "One platform for skills, learning and intelligence."],
  schools: ["For Schools", "Build stronger foundations."],
  "higher-education": ["For Higher Education", "Turn learning into employability."],
  enterprise: ["For Enterprise", "Build a workforce ready for what&rsquo;s next."],
  ai: ["AI", "AI that works with people, not around them."],
  skills: ["Skills", "Understand the skills that matter."],
  topic: ["Skills &amp; Learning Intelligence", "Measure skills. Close the gaps. Show the change."],
  students: ["For students", "Knows where you stand, and what to fix first."],
  faculty: ["For faculty", "A quiz in minutes. Not a Sunday evening."],
  leadership: ["For leadership", "Is the syllabus actually being covered?"],
  parents: ["For parents", "Their child. Nothing else."],
  security: ["Security", "The questions procurement asks first."],
  pricing: ["Pricing", "Prove it on one department first."],
  demo: ["Book a demo", "One conversation. One clear next step."],
  about: ["About", "Built around a question institutions cannot answer today."],
  blog: ["Blog", "Writing on learning, skills and AI."],
  privacy: ["Privacy", "How we handle personal data."],
  terms: ["Terms", "Terms of use."],
};

/** Headline size steps down as the line count grows, so tall cards still fit. */
function headlineSize(text) {
  const plain = text.replace(/&[a-z]+;/g, "x");
  if (plain.length > 62) return 52;
  if (plain.length > 44) return 58;
  return 66;
}

function card(slug, [eyebrow, headline]) {
  const fontDir = path.join(ROOT, "fonts").replace(/\\/g, "/");

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      @font-face {
        font-family: "Poppins";
        font-weight: 700;
        src: url("file:///${fontDir}/poppins-700-latin.woff2") format("woff2");
      }
      @font-face {
        font-family: "Poppins";
        font-weight: 600;
        src: url("file:///${fontDir}/poppins-600-latin.woff2") format("woff2");
      }
      @font-face {
        font-family: "Inter";
        font-weight: 400 700;
        src: url("file:///${fontDir}/inter-latin.woff2") format("woff2");
      }

      * { margin: 0; padding: 0; box-sizing: border-box; }

      body {
        width: 1200px;
        height: 630px;
        overflow: hidden;
        background: #0b1220;
        background-image: radial-gradient(110% 100% at 10% 0%, #123449 0%, #0b1220 60%);
        font-family: "Inter", sans-serif;
        -webkit-font-smoothing: antialiased;
      }

      .card {
        width: 1200px;
        height: 630px;
        padding: 76px 84px 66px;
        display: flex;
        flex-direction: column;
      }

      .brand { display: flex; align-items: center; gap: 14px; }
      .brand svg { display: block; }
      .wordmark {
        font-family: "Poppins", sans-serif;
        font-weight: 700;
        font-size: 46px;
        letter-spacing: -1px;
        color: #ffffff;
      }
      .wordmark span { color: #22d3ee; }

      .rule { width: 132px; height: 5px; background: #22d3ee; border-radius: 3px; margin-top: 22px; }

      .eyebrow {
        margin-top: 42px;
        font-size: 21px;
        font-weight: 600;
        letter-spacing: 0.17em;
        text-transform: uppercase;
        color: #22d3ee;
      }

      h1 {
        margin-top: 22px;
        max-width: 960px;
        font-family: "Poppins", sans-serif;
        font-weight: 700;
        font-size: ${headlineSize(headline)}px;
        line-height: 1.1;
        letter-spacing: -0.02em;
        color: #ffffff;
      }

      footer {
        margin-top: auto;
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        font-size: 21px;
        color: #c9dde6;
      }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="brand">
        <svg width="62" height="62" viewBox="0 0 96 96" aria-hidden="true">
          <path d="M25.48 67 A26 26 0 0 1 31.29 34.08" fill="none" stroke="#FFFFFF" stroke-opacity="0.28" stroke-width="9" stroke-linecap="round" />
          <path d="M33.09 32.70 A26 26 0 0 1 66.38 35.62" fill="none" stroke="#0E7490" stroke-width="9" stroke-linecap="round" />
          <path d="M67.92 37.29 A26 26 0 0 1 70.52 67" fill="none" stroke="#22D3EE" stroke-width="9" stroke-linecap="round" />
          <path d="M48 54 L60.62 35.98" stroke="#FFFFFF" stroke-width="5.5" stroke-linecap="round" />
          <circle cx="48" cy="54" r="4.8" fill="#FFFFFF" />
        </svg>
        <p class="wordmark">Gauge<span>Skills</span></p>
      </div>
      <div class="rule"></div>

      <p class="eyebrow">${eyebrow}</p>
      <h1>${headline}</h1>

      <footer>
        <span>${site.url.replace("https://", "")}</span>
        <span>${TAGLINE.replace("&", "&amp;")}</span>
      </footer>
    </div>
  </body>
</html>`;
}

async function main() {
  const edge = EDGE_CANDIDATES.find((p) => existsSync(p));
  if (!edge) throw new Error("Microsoft Edge not found — cannot render share images.");

  await mkdir(TMP, { recursive: true });
  await mkdir(path.join(ROOT, "og"), { recursive: true });

  const only = process.argv.slice(2);
  const slugs = only.length ? only : Object.keys(CARDS);

  for (const slug of slugs) {
    const copy = CARDS[slug];
    if (!copy) throw new Error(`no card copy defined for "${slug}"`);

    const htmlPath = path.join(TMP, `${slug}.html`);
    await writeFile(htmlPath, card(slug, copy), "utf8");

    const out = path.join(ROOT, "og", `${slug}.png`);

    await run(edge, [
      "--headless=new",
      "--no-sandbox",
      "--disable-gpu",
      "--hide-scrollbars",
      "--force-device-scale-factor=1",
      `--screenshot=${out}`,
      "--window-size=1200,630",
      "--virtual-time-budget=4000",
      `file:///${htmlPath.replace(/\\/g, "/")}`,
    ]).catch((error) => {
      // Edge writes its banner to stderr and still succeeds; only a missing
      // output file is a real failure.
      if (!existsSync(out)) throw error;
    });

    const { size } = await readFile(out).then((b) => ({ size: b.length }));
    console.log(`og/${slug}.png  ${String(size).padStart(7)} bytes`);
  }

  await rm(TMP, { recursive: true, force: true });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
