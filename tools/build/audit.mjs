/**
 * Post-build audit.
 *
 * Fails the build on the mistakes that are easy to make across a few dozen
 * generated pages and expensive to notice later: duplicate titles, missing
 * canonicals, broken internal links, malformed structured data, sitemap drift.
 *
 * Run with `npm run audit` (or `npm run check` to build then audit).
 */

import { readFile, readdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../..");

const SKIP_DIRS = new Set(["node_modules", ".git", "tools", "fonts", "og", "brand", "css", "js", ".og-tmp"]);

const problems = [];
const warnings = [];

const fail = (file, message) => problems.push(`${file}: ${message}`);
const warn = (file, message) => warnings.push(`${file}: ${message}`);

/** Recursively collect emitted HTML files. */
async function htmlFiles(dir = ROOT, prefix = "") {
  const found = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name) || entry.name.startsWith(".")) continue;
      found.push(...(await htmlFiles(path.join(dir, entry.name), `${prefix}${entry.name}/`)));
    } else if (entry.name.endsWith(".html")) {
      found.push(prefix + entry.name);
    }
  }
  return found;
}

const all = (html, re) => [...html.matchAll(re)].map((m) => m[1]);
const one = (html, re) => html.match(re)?.[1] ?? null;

/** Length limits apply to what a person reads, not to the escaped source. */
const decode = (text) =>
  text
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&rsquo;/g, "\u2019")
    .replace(/&mdash;/g, "\u2014")
    .replace(/&nbsp;/g, " ");

async function main() {
  const files = (await htmlFiles()).sort();
  const titles = new Map();
  const descriptions = new Map();
  const canonicals = new Map();

  for (const file of files) {
    const html = await readFile(path.join(ROOT, file), "utf8");
    const noindex = /<meta name="robots" content="noindex/.test(html);

    /* ------------------------------------------------------------ titles */

    const title = one(html, /<title>([\s\S]*?)<\/title>/);
    if (!title) fail(file, "missing <title>");
    else {
      if (titles.has(title)) fail(file, `duplicate title, also on ${titles.get(title)}`);
      titles.set(title, file);
      const length = decode(title).length;
      if (length > 65) warn(file, `title is ${length} chars (over 65)`);
    }

    /* ------------------------------------------------------ descriptions */

    const description = one(html, /<meta name="description" content="([\s\S]*?)"\s*\/>/);
    if (!description) fail(file, "missing meta description");
    else {
      if (descriptions.has(description)) {
        fail(file, `duplicate meta description, also on ${descriptions.get(description)}`);
      }
      descriptions.set(description, file);
      const length = decode(description).length;
      if (!noindex && (length < 110 || length > 170)) {
        warn(file, `meta description is ${length} chars (want 110-170)`);
      }
    }

    /* --------------------------------------------------------- canonical */

    const canonical = one(html, /<link rel="canonical" href="([^"]+)"/);
    if (!noindex) {
      if (!canonical) fail(file, "missing canonical");
      else {
        if (canonicals.has(canonical)) fail(file, `duplicate canonical, also on ${canonicals.get(canonical)}`);
        canonicals.set(canonical, file);
      }
    }

    /* ---------------------------------------------------------- headings */

    const h1s = all(html, /<h1[^>]*>([\s\S]*?)<\/h1>/g);
    if (h1s.length === 0) fail(file, "no <h1>");
    if (h1s.length > 1) fail(file, `${h1s.length} <h1> elements, expected 1`);

    // Heading order: flag a jump of more than one level (h1 -> h3).
    const levels = all(html, /<(h[1-4])[^>]*>/g).map((t) => Number(t[1]));
    for (let i = 1; i < levels.length; i += 1) {
      if (levels[i] - levels[i - 1] > 1) {
        warn(file, `heading jumps h${levels[i - 1]} to h${levels[i]}`);
        break;
      }
    }

    /* ------------------------------------------------------ structured data */

    const blocks = all(html, /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g);
    if (!blocks.length) fail(file, "no JSON-LD");
    for (const block of blocks) {
      try {
        const data = JSON.parse(block);
        if (!data["@graph"]?.length) fail(file, "JSON-LD has no @graph nodes");
      } catch (error) {
        fail(file, `invalid JSON-LD: ${error.message}`);
      }
    }

    /* ------------------------------------------------------------- links */

    const dir = path.dirname(path.join(ROOT, file));
    for (const href of all(html, /href="([^"]+)"/g)) {
      if (/^(https?:|mailto:|tel:|#|data:)/.test(href)) continue;
      const target = path.resolve(dir, href.split("#")[0]);
      if (!existsSync(target)) fail(file, `broken link: ${href}`);
    }

    for (const src of all(html, /(?:src|content)="((?:\.\.\/)*(?:og|brand|js|css|fonts)\/[^"]+)"/g)) {
      if (!existsSync(path.resolve(dir, src))) fail(file, `missing asset: ${src}`);
    }

    /* --------------------------------------------------------------- a11y */

    for (const tag of all(html, /<img\b([^>]*)>/g)) {
      if (!/\balt=/.test(tag)) fail(file, "<img> without alt");
    }
    for (const tag of all(html, /<svg\b([^>]*)>/g)) {
      if (!/aria-hidden|role="img"|aria-label/.test(tag)) {
        warn(file, "<svg> without aria-hidden or role/label");
        break;
      }
    }

    /* --------------------------------------------------- share image size */

    const og = one(html, /<meta property="og:image" content="([^"]+)"/);
    if (!og) fail(file, "missing og:image");
  }

  /* ------------------------------------------------------------- sitemap */

  const sitemap = await readFile(path.join(ROOT, "sitemap.xml"), "utf8");
  const listed = new Set(all(sitemap, /<loc>([^<]+)<\/loc>/g));

  for (const [canonical, file] of canonicals) {
    if (!listed.has(canonical)) fail("sitemap.xml", `missing ${canonical} (from ${file})`);
  }
  for (const loc of listed) {
    if (!canonicals.has(loc)) fail("sitemap.xml", `lists ${loc}, which no page declares as canonical`);
  }

  /* -------------------------------------------------------------- report */

  console.log(`audited ${files.length} pages`);

  if (warnings.length) {
    console.log(`\n${warnings.length} warning(s):`);
    warnings.forEach((w) => console.log(`  - ${w}`));
  }

  if (problems.length) {
    console.log(`\n${problems.length} problem(s):`);
    problems.forEach((p) => console.log(`  ! ${p}`));
    process.exitCode = 1;
  } else {
    console.log("\nno problems found");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
