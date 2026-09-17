/**
 * Static site build.
 *
 * Renders every registered page to HTML at the repository root and regenerates
 * sitemap.xml. Run with `npm run build` (which also recompiles Tailwind).
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { document_ } from "./layout.mjs";
import { legacyPages } from "./pages.mjs";
import { newPages } from "./content/index.mjs";
import { graph } from "./seo.mjs";
import { site } from "./site.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../..");
const LEGACY = path.join(HERE, "content/legacy");

/** Sitemap weighting. Commercial pages rank above policy pages. */
const PRIORITY = {
  "/": "1.0",
  "/platform": "0.9",
  "/schools": "0.9",
  "/higher-education": "0.9",
  "/enterprise": "0.9",
  "/ai": "0.9",
  "/skills": "0.9",
  "/demo": "0.8",
  "/pricing": "0.8",
};

const priorityFor = (p) =>
  PRIORITY[p] ?? (p.startsWith("/blog/") ? "0.6" : "0.7");

async function bodyFor(page) {
  if (page.legacy) {
    const raw = await readFile(path.join(LEGACY, `${page.legacy}.html`), "utf8");
    // Indent to sit inside <main>, matching the hand-authored pages.
    return raw
      .replace(/\s+$/, "")
      .split("\n")
      .map((line) => (line.trim() ? "      " + line : line))
      .join("\n");
  }
  return page.body;
}

async function main() {
  const pages = [...newPages, ...legacyPages];

  const seen = new Set();
  for (const page of pages) {
    if (seen.has(page.out)) throw new Error(`duplicate output path: ${page.out}`);
    seen.add(page.out);
  }

  for (const page of pages) {
    const body = await bodyFor(page);

    const schema =
      page.schema ??
      graph({
        path: page.canonical,
        name: page.title,
        description: page.description,
        breadcrumbs: page.breadcrumbs ?? [],
        extra: page.schemaExtra ?? [],
      });

    const html = document_({ ...page, body, schema });

    const target = path.join(ROOT, page.out);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, html, "utf8");
  }

  await writeSitemap(pages);

  console.log(`built ${pages.length} pages`);
}

async function writeSitemap(pages) {
  const today = new Date().toISOString().slice(0, 10);

  const entries = pages
    .filter((p) => !p.noindex)
    .sort((a, b) => Number(priorityFor(b.canonical)) - Number(priorityFor(a.canonical)) || a.canonical.localeCompare(b.canonical))
    .map((p) => {
      const loc = p.canonical === "/" ? `${site.url}/` : `${site.url}${p.canonical}`;
      return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priorityFor(p.canonical)}</priority>
  </url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`;

  await writeFile(path.join(ROOT, "sitemap.xml"), xml, "utf8");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
