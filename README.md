# GaugeSkills marketing site

A static site — no React, no Next.js, **no runtime dependencies**. The HTML is
generated at build time and the deployed folder is plain files, so it can be
opened straight off a disk or dropped on any static host.

GaugeSkills is positioned as one AI-powered Skills & Learning Intelligence
platform with three solution lines — Schools, Higher Education and Enterprise —
sharing a common platform, AI and analytics layer.

```
index.html                 homepage
platform.html  ai.html  skills.html          the common platform
schools.html   higher-education.html  enterprise.html
students.html  faculty.html  leadership.html  parents.html
ai-tutor.html  ai-for-faculty.html  student-performance-analytics.html
at-risk-students.html  employee-skill-assessment.html
skills-gap-analysis.html  upskilling.html  reskilling.html
security.html  pricing.html  demo.html  about.html
privacy.html   terms.html    404.html
blog.html
blog/                      category hubs and articles
css/tailwind.css           stylesheet source — edit this
css/fonts.css              @font-face rules — generated, do not edit
css/styles.css             compiled output — generated, do not edit
js/main.js                 all interactive behaviour
fonts/                     self-hosted Inter and Poppins
og/                        1200x630 share images
brand/                     logo assets
tools/build/               the generator — never shipped to the browser
manifest.webmanifest  sitemap.xml  robots.txt  CNAME
```

## Building

```bash
npm install             # build-time only: Tailwind CLI
npm run build           # regenerate the pages, then the CSS
npm run build:pages     # HTML only
npm run build:css       # CSS only
npm run watch:css       # rebuild CSS on change
npm run audit           # check the SEO of the built output
npm run check           # build then audit
```

Share images need a browser and their output rarely changes, so they are not
part of `npm run build`:

```bash
node tools/build/og.mjs            # re-render every og/ image (needs Edge)
node tools/build/og.mjs schools    # or just one
```

**The HTML files are generated.** Editing `schools.html` by hand will work until
the next build overwrites it. Edit the source instead:

| File | What lives there |
| --- | --- |
| `tools/build/site.mjs` | Brand constants, navigation, footer, the three solution lines, logo SVG |
| `tools/build/layout.mjs` | `<head>`, header, footer, and the relative-link resolver |
| `tools/build/sections.mjs` | The reusable section components every page is built from |
| `tools/build/seo.mjs` | Structured-data builders |
| `tools/build/pages.mjs` | Registry for pages whose body is reused verbatim |
| `tools/build/content/` | One module per page, holding that page's copy |
| `tools/build/content/legacy/` | Page bodies extracted from the original hand-authored HTML |

`content/legacy/` exists so that pages which did not need rewriting keep their
exact copy while still picking up the shared header, footer and metadata. To
convert one of them into a composed page, write a module in `content/` that
builds the body from `sections.mjs` and drop its entry from `legacyPages`.

The stylesheet is Tailwind v4 compiled ahead of time. Utility classes live in
the markup, which means **the CSS has to be recompiled after any HTML change**
or newly used utilities will be missing. `npm run build` does both in the right
order — pages first, then CSS, because the CSS is compiled from the pages.

## Links and URLs

Internal links are declared site-absolute in the source (`/platform`) and
rendered as relative hrefs (`platform.html`, or `../platform.html` from inside
`blog/`), so the built folder still works from the file system. Canonical URLs,
the sitemap and `og:url` all use extensionless paths.

**This only agrees on a host that serves clean URLs.** GitHub Pages, Netlify,
Vercel and Cloudflare Pages all do. A plain nginx or Apache setup will not:
`/platform` would 404 while every canonical tag points at it. Either enable
extensionless URLs on the server, or change `canonical` in the page registry to
include `.html`.

The site is deployed to GitHub Pages behind the domain in `CNAME`. GitHub Pages
serves static files only and cannot issue a 301, which is why no existing URL
was retired in the redesign — pages that changed role were rewritten in place.

## Fonts

Inter and Poppins are self-hosted in `fonts/` rather than fetched from Google,
so a first visit makes no third-party request. Only the Latin subsets are kept,
and Inter is deduplicated into a single `400 700` variable face. The two faces
needed for the first paint are preloaded in `<head>`.

## JavaScript

`js/main.js` is the only script: the header shadow, the desktop dropdown menus,
the mobile menu, scroll-reveal transitions, the animated progress bars, the
audience tabs, the AI tutor typing sequence and the demo form.

Everything degrades. Markup is authored in its finished state and the inline
script in `<head>` sets `class="js"` on `<html>`, which is what switches on the
hidden starting states. With JavaScript off the page renders complete and
static, the FAQ still works through native `<details>`, and so does the mobile
navigation.

## The demo form

`demo.html` validates on the client, but a static site has no endpoint to post
to. While `FORM_ENDPOINT` at the top of `js/main.js` is empty, a valid
submission opens the visitor's mail client with the answers pre-filled and says
so. Set that constant to a form endpoint (Formspree, Basin, a Lambda, your CRM)
and it will POST JSON instead.

## SEO

Every page carries its own `<title>`, meta description, canonical URL, robots
directive, Open Graph and Twitter card tags, and a JSON-LD graph.

Structured data is one connected `@graph` per page rather than isolated blobs.
`Organization` and `WebSite` are declared with stable `@id`s and referenced by
every page's `WebPage` node, so search engines treat the whole site as one
entity. Inner pages add a `BreadcrumbList`, the homepage and `/platform` add
`SoftwareApplication`, pages with an FAQ add `FAQPage`, and blog posts add
`Article`.

Run `npm run audit` after any change. It fails on duplicate titles or
descriptions, missing or overlong metadata, more than one `<h1>`, heading-level
jumps, invalid JSON-LD, a missing `og:image`, broken internal links, missing
assets, images without `alt`, and a sitemap that has drifted out of step with
the indexable pages.

If the domain ever changes, `site.url` in `tools/build/site.mjs` is the single
place every absolute URL is derived from — plus the `Host` line in `robots.txt`
and the `CNAME` file.

## Content rules

These are enforced by review, not by the linter, and they matter:

- No invented customers, logos, testimonials, case studies, statistics,
  certifications, awards or performance numbers. There are none yet.
- Every dashboard shown on the site is markup, not a screenshot, and every one
  of them is labelled "Illustrative dashboard. Not customer data."
- Benefit first, mechanism second. "See which students need help before they
  fall behind", then "Learning-gap identification" underneath it.
- AI assists people. Every AI output is a draft a human reviews and approves,
  and the site says so rather than implying autonomy.

## Still to do

- `Case Studies` and `Reports` are deliberately absent from the Resources menu
  until there is real content behind them.
- Nothing here can set HTTP headers. Compression, cache lifetimes for `fonts/`
  and `og/`, and HTTPS redirects are the host's job.
