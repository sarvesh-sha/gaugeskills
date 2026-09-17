/**
 * Reusable page sections.
 *
 * These emit the same markup vocabulary the hand-built pages already use —
 * `container-page`, `rounded-card`, `data-reveal`, the ink/paper/white section
 * rhythm — so generated pages are indistinguishable from the originals.
 */

import { esc, lifecycle, solutions } from "./site.mjs";

/* ---------------------------------------------------------------- atoms */

const BTN = "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold transition-all duration-200 ease-out";

export const button = {
  onDark: (href, label) =>
    `<a href="${href}" class="${BTN} bg-cyan text-ink hover:bg-white">${esc(label)}</a>`,
  onDarkGhost: (href, label) =>
    `<a href="${href}" class="${BTN} border border-white/25 text-white hover:border-cyan hover:text-cyan">${esc(label)}</a>`,
  onLight: (href, label) =>
    `<a href="${href}" class="${BTN} bg-teal text-white shadow-soft hover:bg-teal-deep">${esc(label)}</a>`,
  onLightGhost: (href, label) =>
    `<a href="${href}" class="${BTN} border border-hairline text-ink hover:border-teal hover:text-teal">${esc(label)}</a>`,
};

/** Inline arrow used on card links. */
const arrow = `<svg viewBox="0 0 16 16" aria-hidden="true" class="h-4 w-4"><path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

/** Stagger helper: every second card gets a small delay. */
const delay = (i) => (i % 2 ? ' style="--reveal-delay: 60ms"' : "");

/* -------------------------------------------------------------- headings */

export function sectionHead({ eyebrow, title, lede, tone = "light", align = "left" }) {
  const eyebrowColor = tone === "dark" ? "text-cyan" : "text-teal";
  const titleColor = tone === "dark" ? "text-white" : "text-ink";
  const ledeColor = tone === "dark" ? "text-mist" : "text-slate-body";
  const box = align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl";

  return `<div data-reveal class="${box}">
      ${eyebrow ? `<p class="text-xs font-semibold uppercase tracking-[0.16em] ${eyebrowColor}">${esc(eyebrow)}</p>` : ""}
      <h2 class="mt-3 text-3xl ${titleColor} md:text-[2.5rem]">${title}</h2>
      ${lede ? `<p class="mt-4 text-[17px] leading-relaxed ${ledeColor}">${lede}</p>` : ""}
    </div>`;
}

const TONES = {
  paper: "bg-paper text-ink",
  white: "bg-white text-ink",
  ink: "bg-ink",
  teal: "bg-teal-deep",
};

export function section({ tone = "paper", id, children }) {
  return `<section${id ? ` id="${id}"` : ""} class="${TONES[tone]} py-20 md:py-28">
  <div class="container-page">
${children}
  </div>
</section>`;
}

/* ------------------------------------------------------------------ hero */

export function hero({ eyebrow, h1, lede, primary, secondary, aside }) {
  return `<section class="relative overflow-hidden bg-ink">
  <div
    aria-hidden="true"
    class="absolute inset-0 bg-[radial-gradient(110%_100%_at_10%_0%,#123449_0%,#0B1220_60%)]"
  ></div>
  <div aria-hidden="true" class="absolute inset-y-0 left-0 w-1.5 bg-cyan"></div>
  <div class="container-page relative py-20 md:py-24">
    <div class="grid items-center gap-14 ${aside ? "lg:grid-cols-[1.05fr_0.95fr]" : ""}">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.16em] text-cyan">${esc(eyebrow)}</p>
        <h1 class="mt-5 max-w-4xl text-4xl leading-[1.08] text-white md:text-[3.25rem]">${h1}</h1>
        <p class="mt-6 max-w-2xl text-[17px] leading-relaxed text-mist">${lede}</p>
        <div class="mt-9 flex flex-wrap gap-3">
          ${primary ? button.onDark(primary.href, primary.label) : ""}
          ${secondary ? button.onDarkGhost(secondary.href, secondary.label) : ""}
        </div>
      </div>
      ${aside ?? ""}
    </div>
  </div>
</section>`;
}

/* -------------------------------------------------------- breadcrumbs */

export function breadcrumbs(trail, rel) {
  const items = trail
    .map((crumb, i) => {
      const last = i === trail.length - 1;
      const inner = last
        ? `<span class="text-slate-body" aria-current="page">${esc(crumb.name)}</span>`
        : `<a href="${rel(crumb.path)}" class="text-teal underline-offset-4 hover:underline">${esc(crumb.name)}</a>`;
      return `<li class="flex items-center gap-2">${i > 0 ? '<span aria-hidden="true" class="text-hairline">/</span>' : ""}${inner}</li>`;
    })
    .join("\n        ");

  return `<nav aria-label="Breadcrumb" class="border-b border-hairline bg-white">
  <div class="container-page py-3.5">
    <ol class="flex flex-wrap items-center gap-2 text-[13px]">
        ${items}
    </ol>
  </div>
</nav>`;
}

/* --------------------------------------------------------- solution cards */

/** The homepage's three-way routing decision. Deliberately the loudest block. */
export function solutionCards(rel) {
  const cards = solutions
    .map(
      (s, i) => `      <li data-reveal${delay(i)} class="group relative flex flex-col rounded-card border border-hairline bg-white p-7 shadow-soft transition-all duration-200 hover:-translate-y-1 hover:shadow-lift">
        <span aria-hidden="true" class="h-1 w-12 rounded bg-cyan"></span>
        <h3 class="mt-5 text-2xl text-ink">${esc(s.label)}</h3>
        <p class="mt-2 text-[17px] font-semibold text-teal">${esc(s.promise)}</p>
        <p class="mt-3 grow text-[15px] leading-relaxed text-slate-body">${esc(s.blurb)}</p>
        <ul class="mt-5 flex flex-wrap gap-2">
${s.audiences
  .map(
    (a) =>
      `          <li class="rounded-full bg-paper px-3 py-1 text-[13px] text-slate-body">${esc(a)}</li>`,
  )
  .join("\n")}
        </ul>
        <a href="${rel(s.path)}" class="mt-6 inline-flex items-center gap-1.5 text-[15px] font-semibold text-teal">
          <span class="absolute inset-0" aria-hidden="true"></span>
          Explore ${esc(s.label)}${arrow}
        </a>
      </li>`,
    )
    .join("\n");

  return `<ul class="mt-12 grid gap-6 lg:grid-cols-3">
${cards}
    </ul>`;
}

/* ------------------------------------------------------------- lifecycle */

/**
 * ASSESS → IDENTIFY GAPS → PERSONALIZE → LEARN → IMPROVE → MEASURE.
 * Horizontal rail on desktop, stacked list on mobile. No library.
 */
export function lifecycleFlow({ tone = "dark" } = {}) {
  const line = tone === "dark" ? "bg-white/15" : "bg-hairline";
  const dot = tone === "dark" ? "bg-cyan" : "bg-teal";
  const stepText = tone === "dark" ? "text-white" : "text-ink";
  const noteText = tone === "dark" ? "text-mist" : "text-slate-body";

  const steps = lifecycle
    .map(
      (s, i) => `      <li data-reveal style="--reveal-delay: ${i * 60}ms" class="relative flex gap-4 md:block">
        <div class="relative flex flex-col items-center md:block">
          <span aria-hidden="true" class="relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full ${dot} text-[13px] font-bold text-ink">${i + 1}</span>
          <span aria-hidden="true" class="mt-1 w-px grow ${line} md:hidden"></span>
        </div>
        <div class="pb-8 md:pb-0 md:pt-5">
          <h3 class="text-[17px] font-semibold ${stepText}">${esc(s.step)}</h3>
          <p class="mt-1.5 text-[14px] leading-relaxed ${noteText}">${esc(s.note)}</p>
        </div>
      </li>`,
    )
    .join("\n");

  return `<div class="relative mt-12">
      <span aria-hidden="true" class="absolute left-0 right-0 top-4.5 hidden h-px ${line} md:block"></span>
      <ol class="grid gap-0 md:grid-cols-6 md:gap-5">
${steps}
      </ol>
    </div>`;
}

/* ------------------------------------------------------------ card grids */

/** Grid of titled cards. `items` is `[{ title, body, tag? }]`. */
export function cardGrid(items, { columns = 3, tone = "light" } = {}) {
  const surface = tone === "dark" ? "bg-white/5 border border-white/10" : "bg-white shadow-soft";
  const titleColor = tone === "dark" ? "text-white" : "text-ink";
  const bodyColor = tone === "dark" ? "text-mist" : "text-slate-body";
  const cols = { 2: "sm:grid-cols-2", 3: "sm:grid-cols-2 lg:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4" }[columns];

  return `<ul class="mt-12 grid gap-5 ${cols}">
${items
  .map(
    (item, i) => `      <li data-reveal${delay(i)} class="rounded-card p-6 ${surface}">
        ${item.tag ? `<p class="text-xs font-semibold uppercase tracking-[0.16em] ${tone === "dark" ? "text-cyan" : "text-teal"}">${esc(item.tag)}</p>` : ""}
        <h3 class="${item.tag ? "mt-3 " : ""}text-[17px] font-semibold ${titleColor}">${esc(item.title)}</h3>
        <p class="mt-2 text-[15px] leading-relaxed ${bodyColor}">${esc(item.body)}</p>
      </li>`,
  )
  .join("\n")}
    </ul>`;
}

/**
 * Benefit-led grid: the outcome is the heading, the mechanism sits beneath it
 * in smaller type. This is the shape section 18 of the brief asks for.
 */
export function benefitGrid(items, { columns = 3 } = {}) {
  const cols = { 2: "sm:grid-cols-2", 3: "sm:grid-cols-2 lg:grid-cols-3" }[columns];

  return `<ul class="mt-12 grid gap-5 ${cols}">
${items
  .map(
    (item, i) => `      <li data-reveal${delay(i)} class="rounded-card border border-hairline bg-white p-6">
        <h3 class="text-[19px] font-semibold leading-snug text-ink">${esc(item.benefit)}</h3>
        <p class="mt-3 text-[15px] leading-relaxed text-slate-body">${esc(item.body)}</p>
        <p class="mt-4 border-t border-hairline pt-3 text-[13px] font-medium uppercase tracking-[0.1em] text-teal">${esc(item.feature)}</p>
      </li>`,
  )
  .join("\n")}
    </ul>`;
}

/** Audience/role strip. `roles` is `[{ role, line }]`. */
export function roleGrid(roles) {
  return `<ul class="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-${Math.min(roles.length, 5)}">
${roles
  .map(
    (r, i) => `      <li data-reveal style="--reveal-delay: ${i * 50}ms" class="rounded-card border border-hairline bg-white p-5">
        <h3 class="text-[15px] font-semibold text-ink">${esc(r.role)}</h3>
        <p class="mt-2 text-[14px] leading-relaxed text-slate-body">${esc(r.line)}</p>
      </li>`,
  )
  .join("\n")}
    </ul>`;
}

/* -------------------------------------------------------- dashboard mock */

/**
 * A dashboard built from markup rather than a screenshot, so it stays sharp,
 * weighs nothing and reads correctly to a screen reader.
 *
 * @param {object} opts
 * @param {string} opts.title Panel caption.
 * @param {Array<{label: string, value: string, pct: number}>} opts.bars
 * @param {Array<{label: string, value: string}>} opts.stats
 */
export function dashboardMock({ title, bars, stats, note }) {
  return `<div data-reveal class="overflow-hidden rounded-card border border-hairline bg-white shadow-lift">
        <div class="flex items-center gap-2 border-b border-hairline bg-paper px-5 py-3">
          <span aria-hidden="true" class="h-2.5 w-2.5 rounded-full bg-coral"></span>
          <span aria-hidden="true" class="h-2.5 w-2.5 rounded-full bg-amber"></span>
          <span aria-hidden="true" class="h-2.5 w-2.5 rounded-full bg-cyan"></span>
          <p class="ml-2 text-[13px] font-medium text-slate-body">${esc(title)}</p>
        </div>
        <div class="p-6">
          <dl class="grid grid-cols-3 gap-4">
${stats
  .map(
    (s) => `            <div>
              <dt class="text-[12px] uppercase tracking-[0.1em] text-slate-body">${esc(s.label)}</dt>
              <dd class="mt-1 font-display text-2xl font-bold text-ink">${esc(s.value)}</dd>
            </div>`,
  )
  .join("\n")}
          </dl>
          <ul class="mt-7 space-y-4">
${bars
  .map(
    (b, i) => `            <li>
              <div class="flex items-baseline justify-between text-[14px]">
                <span class="font-medium text-ink">${esc(b.label)}</span>
                <span class="text-slate-body">${esc(b.value)}</span>
              </div>
              <div class="mt-2 h-2 overflow-hidden rounded-full bg-paper">
                <div data-bar style="--bar-width: ${b.pct}%; --bar-delay: ${i * 90}ms" class="h-full rounded-full bg-teal"></div>
              </div>
            </li>`,
  )
  .join("\n")}
          </ul>
          ${note ? `<p class="mt-6 border-t border-hairline pt-4 text-[13px] text-slate-body">${esc(note)}</p>` : ""}
        </div>
      </div>`;
}

/* ----------------------------------------------------------- integrations */

export function integrationGrid(categories) {
  return `<ul class="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
${categories
  .map(
    (c, i) => `      <li data-reveal${delay(i)} class="rounded-card border border-hairline bg-white p-6">
        <h3 class="text-[16px] font-semibold text-ink">${esc(c.title)}</h3>
        <p class="mt-2 text-[15px] leading-relaxed text-slate-body">${esc(c.body)}</p>
      </li>`,
  )
  .join("\n")}
    </ul>`;
}

/* -------------------------------------------------------------------- FAQ */

/** Native <details> so the FAQ still works with JavaScript disabled. */
export function faq(items) {
  return `<div class="mt-12 divide-y divide-hairline border-y border-hairline">
${items
  .map(
    (item) => `      <details class="group py-5">
        <summary class="flex cursor-pointer list-none items-center justify-between gap-6 text-[17px] font-semibold text-ink">
          ${esc(item.q)}
          <svg viewBox="0 0 16 16" aria-hidden="true" class="h-4 w-4 shrink-0 text-teal transition-transform duration-200 group-open:rotate-45"><path d="M8 3v10M3 8h10" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>
        </summary>
        <p class="mt-3 max-w-3xl text-[15px] leading-relaxed text-slate-body">${esc(item.a)}</p>
      </details>`,
  )
  .join("\n")}
    </div>`;
}

/* -------------------------------------------------------------- CTA band */

export function ctaBand({ title, lede, primary, secondary }) {
  return `<section class="relative overflow-hidden bg-teal-deep py-20 md:py-28">
  <div aria-hidden="true" class="absolute inset-0 bg-[radial-gradient(90%_100%_at_85%_10%,#0E7490_0%,#084C61_65%)]"></div>
  <div class="container-page relative">
    <div data-rise class="max-w-3xl">
      <h2 class="text-3xl text-white md:text-[2.5rem]">${esc(title)}</h2>
      <p class="mt-4 text-[17px] leading-relaxed text-mist">${esc(lede)}</p>
      <div class="mt-9 flex flex-wrap gap-3">
        ${button.onDark(primary.href, primary.label)}
        ${secondary ? button.onDarkGhost(secondary.href, secondary.label) : ""}
      </div>
    </div>
  </div>
</section>`;
}

/* ------------------------------------------------------- related linking */

/** Intentional internal linking block. `links` is `[{ label, path, note }]`. */
export function relatedLinks(links, rel, { heading = "Keep reading" } = {}) {
  return `<section class="bg-white py-16">
  <div class="container-page">
    <h2 class="text-xs font-semibold uppercase tracking-[0.16em] text-teal">${esc(heading)}</h2>
    <ul class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
${links
  .map(
    (l) => `      <li class="group relative rounded-card border border-hairline p-5 transition-colors hover:border-teal">
        <h3 class="text-[16px] font-semibold text-ink">
          <a href="${rel(l.path)}"><span class="absolute inset-0" aria-hidden="true"></span>${esc(l.label)}</a>
        </h3>
        <p class="mt-1.5 text-[14px] leading-relaxed text-slate-body">${esc(l.note)}</p>
      </li>`,
  )
  .join("\n")}
    </ul>
  </div>
</section>`;
}
