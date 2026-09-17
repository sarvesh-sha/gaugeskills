/**
 * The page shell: <head>, header, footer.
 *
 * Internal links are declared site-absolute ("/platform") and rendered as
 * relative hrefs ("platform.html", "../platform.html") so the built folder
 * still opens straight off a disk, which is how the project has always worked.
 */

import { esc, footerNav, logo, primaryNav, site } from "./site.mjs";

/**
 * Build a link resolver for a page emitted at `out` (e.g. "blog/ai-tutor.html").
 *
 * @param {string} out Output path relative to the site root.
 * @returns {(target: string) => string} Site-absolute path to relative href.
 */
export function linker(out) {
  const depth = out.split("/").length - 1;
  const up = "../".repeat(depth);

  return (target) => {
    if (!target || /^(https?:|mailto:|tel:|#)/.test(target)) return target;
    if (target === "/") return `${up}index.html`;
    const clean = target.replace(/^\//, "");
    // Asset references already carry an extension; page paths do not.
    return /\.[a-z0-9]+$/i.test(clean) ? up + clean : `${up}${clean}.html`;
  };
}

const chevron = `<svg viewBox="0 0 12 12" aria-hidden="true" class="h-3 w-3 transition-transform duration-200" data-dropdown-chevron><path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

/* ---------------------------------------------------------------- header */

function desktopNav(rel, active) {
  const items = primaryNav.map((item) => {
    if (!item.children) {
      const current = active === item.path;
      return `<li>
              <a
                href="${rel(item.path)}"
                class="rounded-full px-3.5 py-2 text-[15px] font-medium transition-colors ${current ? "text-ink" : "text-slate-body hover:text-ink"}"
                ${current ? 'aria-current="page"' : ""}
                >${esc(item.label)}</a
              >
            </li>`;
    }

    const open = item.children.some((c) => c.path === active);
    const id = `nav-${item.label.toLowerCase()}`;

    const links = item.children
      .map(
        (child) => `<li>
                    <a
                      href="${rel(child.path)}"
                      class="block rounded-xl px-3 py-2.5 transition-colors hover:bg-paper"
                      ${child.path === active ? 'aria-current="page"' : ""}
                    >
                      <span class="block text-[15px] font-semibold text-ink">${esc(child.label)}</span>
                      <span class="mt-0.5 block text-[13px] text-slate-body">${esc(child.note)}</span>
                    </a>
                  </li>`,
      )
      .join("\n");

    return `<li class="relative" data-dropdown>
              <button
                type="button"
                data-dropdown-toggle
                aria-expanded="false"
                aria-controls="${id}"
                class="flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[15px] font-medium transition-colors ${open ? "text-ink" : "text-slate-body hover:text-ink"}"
              >
                ${esc(item.label)}${chevron}
              </button>
              <div
                id="${id}"
                data-dropdown-panel
                hidden
                class="absolute left-0 top-full z-50 w-72 pt-2"
              >
                <ul class="rounded-2xl border border-hairline bg-white p-2 shadow-lift">
${links}
                </ul>
              </div>
            </li>`;
  });

  return `<nav aria-label="Primary" class="hidden lg:block">
          <ul class="flex items-center gap-0.5">
${items.join("\n")}
          </ul>
        </nav>`;
}

function mobileNav(rel, active) {
  const items = primaryNav.map((item) => {
    if (!item.children) {
      return `<li>
              <a href="${rel(item.path)}" class="block border-b border-hairline py-3.5 text-base font-medium text-ink"${item.path === active ? ' aria-current="page"' : ""}
                >${esc(item.label)}</a
              >
            </li>`;
    }

    const links = item.children
      .map(
        (child) =>
          `<li><a href="${rel(child.path)}" class="block py-2.5 pl-4 text-[15px] text-slate-body"${child.path === active ? ' aria-current="page"' : ""}>${esc(child.label)}</a></li>`,
      )
      .join("\n                  ");

    // <details> gives an accessible disclosure on mobile with no JavaScript.
    return `<li class="border-b border-hairline">
              <details class="group">
                <summary
                  class="flex cursor-pointer list-none items-center justify-between py-3.5 text-base font-medium text-ink"
                >
                  ${esc(item.label)}
                  <svg viewBox="0 0 12 12" aria-hidden="true" class="h-3 w-3 transition-transform duration-200 group-open:rotate-180"><path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </summary>
                <ul class="pb-2">
                  ${links}
                </ul>
              </details>
            </li>`;
  });

  return `<div id="mobile-nav" hidden class="border-t border-hairline bg-white lg:hidden">
        <nav aria-label="Mobile" class="container-page py-4">
          <ul class="flex flex-col">
${items.join("\n")}
          </ul>
          <a href="${rel("/demo")}" class="mt-5 flex justify-center rounded-full bg-teal px-5 py-3 font-semibold text-white"
            >Book a demo</a
          >
        </nav>
      </div>`;
}

export function header(rel, active) {
  return `<header
      id="site-header"
      class="sticky top-0 z-50 border-b border-transparent bg-white transition-shadow duration-300"
    >
      <div class="container-page flex h-18 items-center justify-between gap-4 py-3">
        <a href="${rel("/")}" aria-label="GaugeSkills home" class="shrink-0">
          ${logo({ tone: "light", className: "h-9 w-auto" })}
        </a>

        ${desktopNav(rel, active)}

        <div class="flex items-center gap-3">
          <a
            href="${rel("/demo")}"
            class="hidden rounded-full bg-teal px-5 py-2.5 text-[15px] font-semibold text-white shadow-soft transition-colors hover:bg-teal-deep sm:inline-flex"
            >Book a demo</a
          >
          <button
            type="button"
            id="nav-toggle"
            aria-expanded="false"
            aria-controls="mobile-nav"
            aria-label="Open menu"
            class="grid h-11 w-11 place-items-center rounded-full border border-hairline bg-white lg:hidden"
          >
            <span class="relative block h-3.5 w-5">
              <span data-nav-bar="top" class="absolute left-0 top-0 h-0.5 w-5 rounded bg-ink transition-all duration-300"></span>
              <span data-nav-bar="middle" class="absolute left-0 top-1.5 h-0.5 w-5 rounded bg-ink opacity-100 transition-opacity duration-200"></span>
              <span data-nav-bar="bottom" class="absolute left-0 top-3 h-0.5 w-5 rounded bg-ink transition-all duration-300"></span>
            </span>
          </button>
        </div>
      </div>

      ${mobileNav(rel, active)}
    </header>`;
}

/* ---------------------------------------------------------------- footer */

export function footer(rel) {
  const columns = footerNav
    .map(
      (col) => `            <div>
              <h2 class="text-xs font-semibold uppercase tracking-[0.16em] text-cyan">${esc(col.heading)}</h2>
              <ul class="mt-4 space-y-2.5">
${col.links
  .map(
    (l) =>
      `                <li><a href="${rel(l.path)}" class="text-[15px] text-mist transition-colors hover:text-white">${esc(l.label)}</a></li>`,
  )
  .join("\n")}
              </ul>
            </div>`,
    )
    .join("\n");

  return `<footer class="bg-ink text-white">
      <div class="container-page py-16 md:py-20">
        <div class="grid gap-12 lg:grid-cols-[1.1fr_2.9fr]">
          <div>
            ${logo({ tone: "dark", className: "h-10 w-auto" })}
            <p class="mt-5 max-w-xs text-[15px] text-mist">
              ${esc(site.description)}
            </p>
            <p class="mt-5 text-[15px] text-mist">
              <a href="mailto:${site.email}" class="underline-offset-4 hover:text-cyan hover:underline">${site.email}</a>
            </p>
          </div>

          <div class="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
${columns}
          </div>
        </div>

        <div class="mt-14 flex flex-col gap-3 border-t border-white/10 pt-8 text-[14px] text-mist sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; <span data-current-year>2026</span> ${esc(site.name)}. All rights reserved.</p>
          <p>${esc(site.category)}</p>
        </div>
      </div>
    </footer>`;
}

/* ------------------------------------------------------------------ page */

/**
 * Render a complete HTML document.
 *
 * @param {object} page
 * @param {string} page.out      Output path, e.g. "schools.html".
 * @param {string} page.title    <title> and og:title.
 * @param {string} page.description Meta description.
 * @param {string} page.canonical   Site-absolute path, e.g. "/schools".
 * @param {string} page.ogImage  Site-relative image path.
 * @param {string} page.body     Inner HTML of <main>.
 * @param {string} [page.schema] Serialized JSON-LD.
 * @param {boolean} [page.noindex]
 * @param {string} [page.active] Nav path to mark current.
 */
export function document_(page) {
  const rel = linker(page.out);
  const url = `${site.url}${page.canonical === "/" ? "/" : page.canonical}`;
  const ogUrl = `${site.url}/${page.ogImage.replace(/^\//, "")}`;

  const robots = page.noindex
    ? "noindex, follow"
    : "index, follow, max-image-preview:large, max-snippet:-1";

  return `<!doctype html>
<html lang="${site.lang}" class="no-js">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <title>${esc(page.title)}</title>
    <meta name="description" content="${esc(page.description)}" />
    <meta name="application-name" content="${site.name}" />
    <meta name="theme-color" content="#0B1220" />
    <meta name="robots" content="${robots}" />
    ${page.noindex ? "" : `<link rel="canonical" href="${url}" />`}

    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${site.name}" />
    <meta property="og:locale" content="en_IN" />
    <meta property="og:url" content="${url}" />
    <meta property="og:title" content="${esc(page.title)}" />
    <meta property="og:description" content="${esc(page.description)}" />
    <meta property="og:image" content="${ogUrl}" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${esc(page.title)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(page.title)}" />
    <meta name="twitter:description" content="${esc(page.description)}" />
    <meta name="twitter:image" content="${ogUrl}" />
    <meta name="twitter:image:alt" content="${esc(page.title)}" />

    <link rel="icon" href="${rel("/brand/gaugeskills-icon.svg")}" type="image/svg+xml" />
    <link rel="apple-touch-icon" href="${rel("/brand/gaugeskills-icon.svg")}" />
    <link rel="manifest" href="${rel("/manifest.webmanifest")}" />

    <link rel="preload" href="${rel("/fonts/inter-latin.woff2")}" as="font" type="font/woff2" crossorigin />
    <link rel="preload" href="${rel("/fonts/poppins-700-latin.woff2")}" as="font" type="font/woff2" crossorigin />
    <link rel="preload" href="${rel("/fonts/poppins-600-latin.woff2")}" as="font" type="font/woff2" crossorigin />
    <link rel="stylesheet" href="${rel("/css/styles.css")}" />

    <script>
      document.documentElement.className = "js";
    </script>

    <script type="application/ld+json">
${page.schema}
    </script>
  </head>

  <body class="min-h-screen antialiased">
    <a
      href="#main"
      class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-white"
      >Skip to content</a
    >

    ${header(rel, page.active ?? page.canonical)}

    <main id="main">
${page.body}
    </main>

    ${footer(rel)}

    <script src="${rel("/js/main.js")}" defer></script>
  </body>
</html>
`;
}
