/**
 * Page registry.
 *
 * Each entry describes one emitted HTML file. `legacy` pulls the page body
 * from `content/legacy/`, which holds the <main> content extracted verbatim
 * from the hand-authored pages — their copy is preserved exactly while the
 * surrounding chrome comes from the shared layout.
 */

import { faqPage, softwareApplication } from "./seo.mjs";

const HE = { name: "Higher Education", path: "/higher-education" };

/** Questions already answered on the site. Reused as FAQPage schema. */
export const homeFaq = [
  {
    q: "Is GaugeSkills one product or three?",
    a: "One platform. Schools, higher education and enterprise share the same assessment engine, the same AI layer, the same analytics and the same administration. What differs is the vocabulary, the dashboards and the workflows each audience sees.",
  },
  {
    q: "Does the AI replace teachers, faculty or managers?",
    a: "No. Every AI output is a draft that a person reviews, edits and approves before it reaches a learner. The tutor answers questions after hours; it does not set the curriculum. The assistant drafts a quiz; the teacher decides whether it is any good.",
  },
  {
    q: "Do we have to replace our existing LMS or HRMS?",
    a: "Not necessarily. GaugeSkills is a complete platform on its own, and it also connects over LTI, SSO and APIs, so institutions committed to an existing system can add the assessment, AI and analytics layers on top of it.",
  },
  {
    q: "How is a skill actually measured?",
    a: "Through assessment rather than self-report. A learner's level on a skill comes from what they demonstrate on assessments mapped to that skill, and it is re-measured as they progress, so the number moves with evidence rather than opinion.",
  },
  {
    q: "Is our data safe?",
    a: "Each organization is an isolated tenant, access is role-based, and staff accounts can require two-factor login. For specific questions about data residency, retention and audits we will put our engineering team in front of yours rather than answer loosely on a website.",
  },
  {
    q: "What does it cost?",
    a: "Education pricing starts with a pilot scoped to one department, then licensing per learner per year once real usage is visible. Enterprise engagements are scoped against role count and rollout, so those start with a conversation.",
  },
];

/* ------------------------------------------------------------ legacy set */

/**
 * Pages whose bodies are reused verbatim. Titles and descriptions are carried
 * over unchanged except where the repositioning requires an edit.
 */
export const legacyPages = [
  {
    out: "students.html",
    canonical: "/students",
    legacy: "students",
    title: "AI tutor and quizzes for students · GaugeSkills",
    description:
      "An AI tutor with voice, generated quizzes, mastery tracking, homework and a dashboard that shows progress and weak chapters.",
    ogImage: "og/students.png",
    breadcrumbs: [HE, { name: "Students", path: "/students" }],
  },
  {
    out: "faculty.html",
    canonical: "/faculty",
    legacy: "faculty",
    title: "AI content studio for faculty · GaugeSkills",
    description:
      "AI co-pilot and content studio for generating courses, lessons, quizzes and visuals, plus attendance, exams and curriculum pacing.",
    ogImage: "og/faculty.png",
    breadcrumbs: [HE, { name: "Faculty", path: "/faculty" }],
  },
  {
    out: "leadership.html",
    canonical: "/leadership",
    legacy: "leadership",
    title: "Syllabus coverage for leadership · GaugeSkills",
    description:
      "Syllabus coverage against plan, teaching snapshots, faculty evaluation and predictive analytics for principals, deans and HODs.",
    ogImage: "og/leadership.png",
    breadcrumbs: [HE, { name: "Leadership", path: "/leadership" }],
  },
  {
    out: "parents.html",
    canonical: "/parents",
    legacy: "parents",
    title: "Parent portal for schools and colleges · GaugeSkills",
    description:
      "A parent portal scoped to linked children only — attendance, academic progress, exam performance and an advisor view.",
    ogImage: "og/parents.png",
    breadcrumbs: [HE, { name: "Parents", path: "/parents" }],
  },
  {
    out: "security.html",
    canonical: "/security",
    legacy: "security",
    title: "Security, privacy and IT · GaugeSkills",
    description:
      "Multi-tenancy, role-based access, two-factor login, ERP and HRMS sync, LTI and batch provisioning — the technical detail IT teams ask for first.",
    ogImage: "og/security.png",
    breadcrumbs: [{ name: "Security", path: "/security" }],
  },
  {
    out: "pricing.html",
    canonical: "/pricing",
    legacy: "pricing",
    title: "Pricing · GaugeSkills",
    description:
      "A pilot scoped per department, then licensing per learner per year once real usage is visible. Request a quote sized against your numbers.",
    ogImage: "og/pricing.png",
    breadcrumbs: [{ name: "Pricing", path: "/pricing" }],
  },
  {
    out: "demo.html",
    canonical: "/demo",
    legacy: "demo",
    title: "Book a demo · GaugeSkills",
    description:
      "Request a demo, a pilot or a technical session for your school, college or organization. We reply within two working days.",
    ogImage: "og/demo.png",
    breadcrumbs: [{ name: "Book a demo", path: "/demo" }],
  },
  {
    out: "about.html",
    canonical: "/about",
    legacy: "about",
    title: "About · GaugeSkills",
    description:
      "Why GaugeSkills exists: institutions do not have a content problem, they have a help-after-class problem and a measurement problem.",
    ogImage: "og/about.png",
    breadcrumbs: [{ name: "About", path: "/about" }],
  },
  {
    out: "privacy.html",
    canonical: "/privacy",
    legacy: "privacy",
    title: "Privacy policy · GaugeSkills",
    description:
      "How GaugeSkills collects, stores and handles personal data belonging to students, learners, faculty, employees and parents, and the rights you have over it.",
    ogImage: "og/privacy.png",
    breadcrumbs: [{ name: "Privacy", path: "/privacy" }],
  },
  {
    out: "terms.html",
    canonical: "/terms",
    legacy: "terms",
    title: "Terms of use · GaugeSkills",
    description:
      "The terms that apply to your use of the GaugeSkills website, and how they sit alongside the service agreement signed with your organization.",
    ogImage: "og/terms.png",
    breadcrumbs: [{ name: "Terms", path: "/terms" }],
  },
  {
    out: "404.html",
    canonical: "/404",
    legacy: "404",
    title: "Page not found · GaugeSkills",
    description: "That page does not exist.",
    ogImage: "og/home.png",
    noindex: true,
  },
];

export { softwareApplication, faqPage };
