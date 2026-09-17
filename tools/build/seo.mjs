/**
 * Structured data.
 *
 * One connected @graph per page rather than isolated blobs: Organization and
 * WebSite carry stable @ids that every page's WebPage node references, so
 * search engines treat the whole site as one entity.
 */

import { site } from "./site.mjs";

const ORG_ID = `${site.url}/#organization`;
const SITE_ID = `${site.url}/#website`;

const absolute = (path) =>
  path === "/" ? `${site.url}/` : `${site.url}${path}`;

function organization() {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: site.name,
    url: `${site.url}/`,
    email: site.email,
    description: site.description,
    logo: {
      "@type": "ImageObject",
      url: `${site.url}/brand/gaugeskills-icon.svg`,
      caption: site.name,
    },
    areaServed: { "@type": "Country", name: "India" },
  };
}

function website() {
  return {
    "@type": "WebSite",
    "@id": SITE_ID,
    url: `${site.url}/`,
    name: site.name,
    description: site.description,
    publisher: { "@id": ORG_ID },
    inLanguage: site.locale,
  };
}

/** SoftwareApplication. Declared on the homepage and /platform only. */
export function softwareApplication() {
  return {
    "@type": "SoftwareApplication",
    "@id": `${site.url}/#software`,
    name: site.name,
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Skills & Learning Intelligence Platform",
    operatingSystem: "Web, Progressive Web App",
    description: site.description,
    url: `${site.url}/`,
    publisher: { "@id": ORG_ID },
    featureList: [
      "Skills and competency assessment",
      "Skill-gap analysis",
      "Personalized learning paths",
      "AI tutor and AI assistant",
      "AI content and assessment generation",
      "Learning and workforce analytics",
    ],
  };
}

/** FAQPage node from `[{ q, a }]`. */
export function faqPage(items) {
  return {
    "@type": "FAQPage",
    mainEntity: items.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

/** Article node for a blog post. */
export function article({ path, headline, description, published, modified }) {
  return {
    "@type": "Article",
    "@id": `${absolute(path)}#article`,
    headline,
    description,
    datePublished: published,
    dateModified: modified ?? published,
    inLanguage: site.locale,
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    isPartOf: { "@id": SITE_ID },
    mainEntityOfPage: { "@id": `${absolute(path)}#webpage` },
  };
}

/**
 * Serialize the full graph for one page.
 *
 * @param {object} opts
 * @param {string} opts.path        Site-absolute path.
 * @param {string} opts.name        Page name (usually the SEO title).
 * @param {string} opts.description Page description.
 * @param {Array<{name: string, path: string}>} [opts.breadcrumbs]
 *        Trail excluding Home, which is prepended automatically.
 * @param {object[]} [opts.extra]   Additional graph nodes.
 */
export function graph({ path, name, description, breadcrumbs = [], extra = [] }) {
  const url = absolute(path);

  const webpage = {
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name,
    description,
    isPartOf: { "@id": SITE_ID },
    about: { "@id": ORG_ID },
    inLanguage: site.locale,
  };

  const nodes = [organization(), website(), webpage];

  if (breadcrumbs.length) {
    const trail = [{ name: "Home", path: "/" }, ...breadcrumbs];
    webpage.breadcrumb = { "@id": `${url}#breadcrumb` };
    nodes.push({
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: trail.map((crumb, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: crumb.name,
        item: absolute(crumb.path),
      })),
    });
  }

  nodes.push(...extra);

  const json = JSON.stringify(
    { "@context": "https://schema.org", "@graph": nodes },
    null,
    2,
  );

  // Indent to sit neatly inside the <script> block in the page shell.
  return json
    .split("\n")
    .map((line) => "      " + line)
    .join("\n");
}
