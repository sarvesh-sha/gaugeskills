/**
 * Site-wide constants, navigation data and brand assets.
 *
 * Everything that appears on more than one page is declared here exactly once.
 * Nothing in `tools/` ships to the browser — the build emits plain HTML.
 */

export const site = {
  name: "GaugeSkills",
  url: "https://gaugeskills.com",
  email: "hello@gaugeskills.com",
  locale: "en-IN",
  lang: "en-IN",

  /** Primary message. Used on the homepage hero and as the brand promise. */
  promise: "Measure Skills. Personalize Learning. Build Better Futures.",

  /** One-sentence description. Reused in schema, OG tags and the footer. */
  description:
    "GaugeSkills is an AI-powered Skills & Learning Intelligence platform that helps schools, colleges and enterprises assess skills, identify gaps, personalize learning and measure growth.",

  /** Short form for places with a tighter character budget. */
  shortDescription:
    "An AI-powered Skills & Learning Intelligence platform for schools, colleges and enterprises.",

  category: "AI-powered Skills & Learning Intelligence Platform",

  /** GA4 measurement ID for the public marketing site. Empty string disables the tag. */
  analyticsId: "G-FGHC5J92BJ",
};

/** The product philosophy, rendered as a flow on the homepage and /platform. */
export const lifecycle = [
  { step: "Assess", note: "Measure what someone knows and can do today." },
  { step: "Identify gaps", note: "Compare that against what the role or course requires." },
  { step: "Personalize", note: "Build a path that targets the gaps that matter." },
  { step: "Learn", note: "Teach, practise and remediate against that path." },
  { step: "Improve", note: "Close the gap with help at the point of difficulty." },
  { step: "Measure", note: "Re-assess, and show the change rather than assert it." },
];

/** The three solution lines. Order is load-bearing across the whole site. */
export const solutions = [
  {
    id: "schools",
    label: "Schools",
    path: "/schools",
    promise: "Build stronger foundations.",
    blurb:
      "AI-powered learning, assessments and insights for students and teachers.",
    cta: "Book a School Demo",
    audiences: ["Students", "Teachers", "Parents", "School leadership"],
  },
  {
    id: "higher-education",
    label: "Higher Education",
    path: "/higher-education",
    promise: "Turn learning into employability.",
    blurb:
      "AI learning, academic analytics, skills development and career readiness for colleges.",
    cta: "Request a College Demo",
    audiences: ["Students", "Faculty", "HODs", "Management", "Placement teams"],
  },
  {
    id: "enterprise",
    label: "Enterprise",
    path: "/enterprise",
    promise: "Build a workforce ready for what's next.",
    blurb:
      "Assess skills, identify gaps and create personalized upskilling and reskilling journeys.",
    cta: "Talk to Our Enterprise Team",
    audiences: ["Employees", "Managers", "HR", "L&D", "Leadership"],
  },
];

export const solutionById = Object.fromEntries(solutions.map((s) => [s.id, s]));

/** Blog categories. Each is a real hub with articles beneath it. */
export const blogCategories = [
  { id: "ai-in-education", label: "AI in Education", blurb: "How AI is actually being used in classrooms and lecture halls." },
  { id: "enterprise-learning", label: "Enterprise Learning", blurb: "Building capability inside organizations." },
  { id: "skills", label: "Skills", blurb: "Measuring, describing and developing skills." },
  { id: "student-performance", label: "Student Performance", blurb: "Seeing where learners stand, early enough to act." },
];

/* ------------------------------------------------------------- navigation */

export const primaryNav = [
  { label: "Platform", path: "/platform" },
  {
    label: "Solutions",
    children: solutions.map((s) => ({
      label: s.label,
      path: s.path,
      note: s.promise,
    })),
  },
  { label: "AI", path: "/ai" },
  { label: "Skills", path: "/skills" },
  {
    label: "Resources",
    children: [
      { label: "Blog", path: "/blog", note: "Writing on learning and skills." },
      ...blogCategories.map((c) => ({
        label: c.label,
        path: `/blog/${c.id}`,
        note: c.blurb,
      })),
    ],
  },
  { label: "About", path: "/about" },
];

export const footerNav = [
  {
    heading: "Platform",
    links: [
      { label: "Platform overview", path: "/platform" },
      { label: "AI", path: "/ai" },
      { label: "Skills", path: "/skills" },
      { label: "Security", path: "/security" },
      { label: "Pricing", path: "/pricing" },
    ],
  },
  {
    heading: "Solutions",
    links: [
      { label: "Schools", path: "/schools" },
      { label: "Higher Education", path: "/higher-education" },
      { label: "Enterprise", path: "/enterprise" },
    ],
  },
  {
    heading: "By role",
    links: [
      { label: "For students", path: "/students" },
      { label: "For faculty", path: "/faculty" },
      { label: "For leadership", path: "/leadership" },
      { label: "For parents", path: "/parents" },
    ],
  },
  {
    heading: "Topics",
    links: [
      { label: "AI tutor", path: "/ai-tutor" },
      { label: "Learning paths", path: "/learning-paths" },
      { label: "Skills gap analysis", path: "/skills-gap-analysis" },
      { label: "Competency management", path: "/competency-management" },
      { label: "Workforce analytics", path: "/workforce-analytics" },
      { label: "Blog", path: "/blog" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", path: "/about" },
      { label: "Book a demo", path: "/demo" },
      { label: "Privacy", path: "/privacy" },
      { label: "Terms", path: "/terms" },
    ],
  },
];

/* ----------------------------------------------------------------- brand */

/**
 * The wordmark. `tone` picks the palette: `light` for white backgrounds,
 * `dark` for the ink footer. The viewBox is 316 wide because "GaugeSkills"
 * measures 210.3px at this size and would clip against the older 296 bound.
 */
export function logo({ tone = "light", className = "h-9 w-auto" } = {}) {
  const dark = tone === "dark";
  const arc = dark ? 'stroke="#FFFFFF" stroke-opacity="0.28"' : 'stroke="#0B1220"';
  const needle = dark ? "#FFFFFF" : "#0B1220";
  const first = dark ? "#FFFFFF" : "#0B1220";
  const second = dark ? "#22D3EE" : "#0E7490";

  return `<svg viewBox="0 0 316 96" class="${className}" role="img" aria-label="GaugeSkills">
  <g transform="translate(-22.25,-11.375) scale(1.25)">
    <path d="M25.48 67 A26 26 0 0 1 31.29 34.08" fill="none" ${arc} stroke-width="9" stroke-linecap="round" />
    <path d="M33.09 32.70 A26 26 0 0 1 66.38 35.62" fill="none" stroke="#0E7490" stroke-width="9" stroke-linecap="round" />
    <path d="M67.92 37.29 A26 26 0 0 1 70.52 67" fill="none" stroke="#22D3EE" stroke-width="9" stroke-linecap="round" />
    <path d="M48 54 L60.62 35.98" stroke="${needle}" stroke-width="5.5" stroke-linecap="round" />
    <circle cx="48" cy="54" r="4.8" fill="${needle}" />
  </g>
  <!-- prettier-ignore -->
  <text x="88" y="62" font-family="var(--font-display)" font-size="36" font-weight="700" letter-spacing="-0.8"><tspan fill="${first}">Gauge</tspan><tspan fill="${second}">Skills</tspan></text>
</svg>`;
}

/* ---------------------------------------------------------------- helpers */

/** Escape a string for use in HTML text or a double-quoted attribute. */
export function esc(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Join class names, dropping falsy entries. */
export function cx(...parts) {
  return parts.filter(Boolean).join(" ");
}
