# Static build

A plain HTML/CSS/JS copy of the marketing site — no React, no Next.js, no
runtime dependencies. Open `index.html` in a browser, or drop the folder on any
static host.

```
static/
  index.html               homepage
  platform.html            full capability list
  students.html  faculty.html  parents.html  leadership.html  security.html
  pricing.html   demo.html
  about.html     blog.html
  privacy.html   terms.html
  404.html
  css/tailwind.css         stylesheet source — edit this
  css/fonts.css            @font-face rules — generated, do not edit
  css/styles.css           compiled output — generated, do not edit
  js/main.js               all interactive behaviour
  fonts/                   self-hosted Inter and Poppins
  og/                      1200x630 social share images, one per page
  brand/                   logo assets
  manifest.webmanifest  sitemap.xml  robots.txt
```

Pages link to each other by filename, so the whole site works from the file
system without a server. On a real host, map `404.html` to your not-found
handler (Netlify and Vercel pick it up automatically; nginx needs
`error_page 404 /404.html`).

## Rebuilding

```bash
npm run static          # regenerate the pages, then the CSS
npm run static:pages    # HTML only
npm run static:css      # CSS only
npm run static:watch    # rebuild CSS on change
npm run static:audit    # check the SEO of the built output
```

Two steps are deliberately not part of `npm run static`, because they hit the
network or need a browser and their output rarely changes:

```bash
npm run static:fonts    # re-download Inter and Poppins into fonts/
npm run static:og       # re-render the og/ share images (needs Edge installed)
```

**The HTML files are generated** by `tools/static/build.mjs`, so that the
header, footer and shared section markup are defined once rather than fifteen
times. Copy lives in `tools/static/content.mjs` and `tools/static/pages.mjs`.

If you would rather hand-edit the HTML directly, that is fine — the output has
no build-time dependencies. Just delete `tools/static/` first so nothing
overwrites your changes later.

The stylesheet is Tailwind v4 compiled ahead of time. Utility classes stay in
the markup, which means **the CSS has to be recompiled after any HTML change**
or newly used utilities will be missing. `css/tailwind.css` carries the same
`@theme` tokens as the Next.js app, so the two stay visually identical.

## Fonts

Inter and Poppins are self-hosted in `fonts/` rather than fetched from Google,
so a first visit makes no third-party request and the render-blocking stylesheet
on `fonts.googleapis.com` is gone. `tools/static/fonts.mjs` downloads them,
keeping only the Latin subsets and deduplicating: Google advertises Inter once
per weight but serves the same variable file each time, so four downloads
collapse into one `@font-face` with a `400 700` range. That takes the font
payload from 547 KB to 156 KB.

The two faces needed for the first paint are preloaded in `<head>`. Rendering is
byte-identical to the Google-hosted versions — same element geometry and page
height on all fourteen pages.

## JavaScript

`js/main.js` replaces what Motion and the React client components did — the
header shadow, the mobile menu, scroll-reveal transitions, the animated
progress bars, the audience tabs, the AI tutor typing sequence and the demo
form.

Everything degrades: the markup is authored in its finished state and the
inline script in `<head>` sets `class="js"` on `<html>`, which is what switches
on the hidden starting states. With JavaScript off the page renders complete and
static, and the FAQ still works through native `<details>`.

## The demo form

`demo.html` validates on the client exactly as the React version did, but a
static site has no `/api/demo` to post to. While `FORM_ENDPOINT` at the top of
`js/main.js` is empty, a valid submission opens the visitor's mail client with
the answers pre-filled and says so. Set that constant to a form endpoint
(Formspree, Basin, a Lambda, your CRM) and it will POST JSON instead.

## SEO

Every page carries its own `<title>`, meta description, canonical URL, robots
directive, Open Graph and Twitter card tags, and a JSON-LD graph. Run
`npm run static:audit` after any change; it fails the build on duplicate titles
or descriptions, missing or overlong metadata, more than one `<h1>`, invalid
JSON-LD, a missing `og:image` file, broken internal links, or a sitemap that has
drifted out of step with the indexable pages.

Structured data is one connected `@graph` per page rather than isolated blobs.
`Organization` and `WebSite` are declared with stable `@id`s and referenced by
every page's `WebPage` node, so search engines treat all fourteen pages as one
entity. Inner pages add a `BreadcrumbList`; the homepage adds
`SoftwareApplication` and `FAQPage`.

Share images in `og/` are real 1200x630 PNGs — one per page, captioned with that
page's headline — because social crawlers do not render SVG.

`404.html` is the only page marked `noindex`, and it is the only one kept out of
`sitemap.xml`.

Two things to change before going live if the domain differs: `site.url` in
`tools/static/content.mjs`, which every absolute URL is derived from, and the
`Host` line in `robots.txt`.

**Check this before launch.** Links between pages use filenames (`platform.html`)
so the folder works straight off a disk, but canonical URLs, the sitemap and
`og:url` all declare extensionless paths (`/platform`). Hosts that serve clean
URLs — Netlify, Vercel, Cloudflare Pages, GitHub Pages — redirect one to the
other and the two agree. A plain nginx or Apache setup will not: `/platform`
returns 404 while every canonical tag points at it, which is worse than having
no canonical at all. Either enable extensionless URLs on the server, or change
`canonical`/`sitemapRoutes` in `tools/static/` to include `.html`.

## Differences from the Next.js version

All deliberate:

- The 404 page has its own `<title>`; in the app it inherits the homepage one.
- Page titles and share metadata are per-page. The app emits the homepage
  `og:title` and `og:description` on every route.
- Six feature-page titles were rewritten to carry a keyword rather than a bare
  label — "Platform overview" became "LMS platform overview", "For students"
  became "AI tutor and quizzes for students", and so on. Revert them in
  `tools/static/pages.mjs` if you would rather keep the originals.
- Inactive audience tabs stay in the DOM and are hidden, rather than being
  unmounted, and the tabs gained arrow-key navigation.
- `role="tablist"` sits on the button row instead of a wrapper that also
  contained the panel.
- The about and blog pages point at `tools/static/pages.mjs` rather than the
  React source files, and the blog no longer mentions MDX.

## Still to do

- `blog.html` has no posts. Until it does, it is a thin page; consider dropping
  it from `sitemap.xml` rather than asking Google to index an empty listing.
- Nothing here can set HTTP headers. Compression, cache lifetimes for
  `fonts/` and `og/`, and HTTPS redirects are your host's job, and they matter
  as much to page speed as anything in this folder.
