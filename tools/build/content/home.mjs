/**
 * Homepage.
 *
 * Eleven sections, in the order a visitor needs them: what this is, which of
 * the three lines they belong to, how the platform works, then the detail.
 */

import { linker } from "../layout.mjs";
import { faqPage, softwareApplication } from "../seo.mjs";
import {
  benefitGrid,
  cardGrid,
  ctaBand,
  dashboardMock,
  faq,
  hero,
  integrationGrid,
  lifecycleFlow,
  section,
  sectionHead,
  solutionCards,
} from "../sections.mjs";
import { homeFaq } from "../pages.mjs";
import { site, solutionById } from "../site.mjs";

const rel = linker("index.html");

/* ------------------------------------------------------------ hero visual */

/**
 * A compact skills panel rather than stock photography: it shows the actual
 * shape of the product — a measured level, a gap, and the path that follows.
 */
const heroAside = `<div data-rise class="relative">
        <div class="rounded-card border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <div class="flex items-baseline justify-between">
            <p class="text-xs font-semibold uppercase tracking-[0.16em] text-cyan">Skill profile</p>
            <p class="text-[13px] text-mist">Re-assessed weekly</p>
          </div>

          <ul class="mt-6 space-y-4">
            <li>
              <div class="flex items-baseline justify-between text-[14px]">
                <span class="font-medium text-white">Data interpretation</span>
                <span class="text-cyan">Level 3 of 5</span>
              </div>
              <div class="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                <div data-bar style="--bar-width: 60%" class="h-full rounded-full bg-cyan"></div>
              </div>
            </li>
            <li>
              <div class="flex items-baseline justify-between text-[14px]">
                <span class="font-medium text-white">Written communication</span>
                <span class="text-cyan">Level 4 of 5</span>
              </div>
              <div class="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                <div data-bar style="--bar-width: 80%; --bar-delay: 90ms" class="h-full rounded-full bg-cyan"></div>
              </div>
            </li>
            <li>
              <div class="flex items-baseline justify-between text-[14px]">
                <span class="font-medium text-white">Applied statistics</span>
                <span class="text-amber">Level 1 of 5</span>
              </div>
              <div class="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                <div data-bar style="--bar-width: 20%; --bar-delay: 180ms" class="h-full rounded-full bg-amber"></div>
              </div>
            </li>
          </ul>

          <div class="mt-6 rounded-xl border border-cyan/25 bg-cyan/10 p-4">
            <p class="text-[13px] font-semibold uppercase tracking-[0.12em] text-cyan">Gap identified</p>
            <p class="mt-1.5 text-[14px] leading-relaxed text-white">
              Applied statistics is two levels below what this role requires. A learning path has been assigned.
            </p>
          </div>

          <p class="mt-4 text-[12px] text-mist">Illustrative interface. Not customer data.</p>
        </div>
      </div>`;

/* ------------------------------------------------- per-solution previews */

/** Preview block for one solution line, tuned to that audience's language. */
function solutionPreview({ id, tone, roles, highlights, panel }) {
  const s = solutionById[id];
  const dark = tone === "ink";
  const roleText = dark ? "text-mist" : "text-slate-body";
  const roleBorder = dark ? "border-white/15" : "border-hairline";

  const roleChips = roles
    .map(
      (r) =>
        `<li class="rounded-full border ${roleBorder} px-3.5 py-1.5 text-[14px] ${roleText}">${r}</li>`,
    )
    .join("\n            ");

  const bullets = highlights
    .map(
      (h) => `<li class="flex gap-3">
              <span aria-hidden="true" class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${dark ? "bg-cyan" : "bg-teal"}"></span>
              <span class="text-[15px] leading-relaxed ${dark ? "text-mist" : "text-slate-body"}"><strong class="font-semibold ${dark ? "text-white" : "text-ink"}">${h.lead}</strong> ${h.rest}</span>
            </li>`,
    )
    .join("\n            ");

  return section({
    tone,
    children: `    <div class="grid items-start gap-12 lg:grid-cols-[1fr_1fr]">
      <div>
        ${sectionHead({
          eyebrow: `For ${s.label}`,
          title: s.promise,
          tone: dark ? "dark" : "light",
        })}
        <ul class="mt-7 flex flex-wrap gap-2">
            ${roleChips}
        </ul>
        <ul class="mt-8 space-y-4">
            ${bullets}
        </ul>
        <div class="mt-9">
          <a href="${rel(s.path)}" class="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold transition-all duration-200 ease-out ${dark ? "bg-cyan text-ink hover:bg-white" : "bg-teal text-white shadow-soft hover:bg-teal-deep"}">Explore ${s.label}</a>
        </div>
      </div>
      ${panel}
    </div>`,
  });
}

/* -------------------------------------------------------------- sections */

const s1 = hero({
  eyebrow: site.category,
  // The breaks are desktop-only: forcing them at phone widths pushes the
  // longest line past the viewport instead of letting it wrap.
  h1: 'Measure Skills. <br class="hidden md:inline" />Personalize Learning. <br class="hidden md:inline" />Build Better Futures.',
  lede: "GaugeSkills is an AI-powered Skills &amp; Learning Intelligence platform for schools, colleges and enterprises. Assess what people can do, find the gaps that matter, teach against them, and measure the change.",
  primary: { href: rel("/platform"), label: "Explore the Platform" },
  secondary: { href: rel("/demo"), label: "Book a Demo" },
  aside: heroAside,
});

const s2 = section({
  tone: "white",
  children: `    ${sectionHead({
    eyebrow: "Who is GaugeSkills for?",
    title: "One Platform. Three Experiences.",
    lede: "Built around the needs of learners, educators and organizations. The technology underneath is the same; what changes is the vocabulary, the dashboards and the workflows each audience gets.",
  })}
    ${solutionCards(rel)}`,
});

const s3 = section({
  tone: "ink",
  children: `    ${sectionHead({
    eyebrow: "The GaugeSkills platform",
    title: "One Intelligence Layer. Every Stage of Development.",
    lede: "Most systems stop at delivering content. GaugeSkills closes the loop: it measures, finds the gap, teaches against it, then measures again so improvement is evidence rather than assertion.",
    tone: "dark",
  })}
    ${lifecycleFlow({ tone: "dark" })}
    ${cardGrid(
      [
        { title: "Skills assessment", body: "Measure knowledge, competency and skill level against a defined standard rather than a self-reported one." },
        { title: "Personalized learning", body: "Paths are assembled from the gaps a learner actually has, not from a catalogue everyone works through together." },
        { title: "AI learning", body: "Lessons, practice sets and explanations generated as drafts, reviewed and approved by the educator or L&D owner." },
        { title: "AI assistant", body: "A tutor for learners and a co-pilot for teachers, faculty and managers, available at the point of difficulty." },
        { title: "Analytics", body: "Progress, performance and readiness for an individual, a class, a department or a workforce." },
        { title: "Recommendations", body: "What to study next, who needs support now, and which skills the organization should build first." },
      ],
      { columns: 3, tone: "dark" },
    )}`,
});

const s4 = section({
  tone: "paper",
  children: `    ${sectionHead({
    eyebrow: "AI",
    title: "AI That Works With People, Not Around Them",
    lede: "Every AI output on GaugeSkills is a draft that a person reviews before it reaches a learner. The teacher keeps authorship. The manager keeps judgement. The AI removes the hours, not the expertise.",
  })}
    ${benefitGrid(
      [
        {
          benefit: "Answer a learner's question at 11pm, in their own language.",
          body: "An AI tutor that works from the material the institution actually teaches, holds a conversation, and saves the session so it becomes revision material.",
          feature: "AI tutor",
        },
        {
          benefit: "Help teachers and faculty create quality learning content faster.",
          body: "Generate a lesson, a practice set or a visual from the syllabus in minutes. The educator edits and approves it before anyone sees it.",
          feature: "AI content generation",
        },
        {
          benefit: "Write an assessment that actually tests the right skill.",
          body: "Questions generated against a chapter or a competency, mapped to the skill they measure, so results mean something afterwards.",
          feature: "AI assessment",
        },
        {
          benefit: "Tell a learner what to do next, not just how they scored.",
          body: "Recommendations that turn a result into an action: the chapter to revisit, the practice to run, the module to take.",
          feature: "AI recommendations",
        },
        {
          benefit: "Give an administrator the answer without building a report.",
          body: "Ask a question of the data in plain language and get the cohort, the trend or the list of people who need attention.",
          feature: "AI analytics",
        },
        {
          benefit: "Support the educator instead of grading them.",
          body: "The assistant drafts, summarises and prepares. What to teach, how to teach it and who needs help stays a human decision.",
          feature: "AI assistant",
        },
      ],
      { columns: 3 },
    )}
    <p data-reveal class="mt-10 max-w-3xl text-[15px] leading-relaxed text-slate-body">
      We are deliberate about what we do not claim. GaugeSkills does not mark high-stakes examinations on its own,
      does not make promotion or hiring decisions, and does not present AI output as fact without a person signing it off.
      <a href="${rel("/ai")}" class="font-semibold text-teal underline-offset-4 hover:underline">Read how the AI layer works</a>.
    </p>`,
});

const s5 = solutionPreview({
  id: "schools",
  tone: "white",
  roles: ["Students", "Teachers", "Parents", "School leadership"],
  highlights: [
    { lead: "See which students need help before they fall behind.", rest: "Assessments map to the concepts behind them, so a weak result points at a specific gap rather than a grade." },
    { lead: "Give every student patient help after school.", rest: "An AI tutor that explains a topic again, as many times as it takes, without a teacher staying late." },
    { lead: "Give a teacher their Sunday back.", rest: "Quizzes, worksheets and lesson material drafted from the syllabus in minutes, then edited and approved by the teacher." },
    { lead: "Tell parents something useful.", rest: "A view scoped to their own child: progress, attendance and where support would help." },
  ],
  panel: dashboardMock({
    title: "Class overview — Grade 9 Science",
    stats: [
      { label: "Students", value: "38" },
      { label: "Need support", value: "6" },
      { label: "Avg. mastery", value: "72%" },
    ],
    bars: [
      { label: "Forces and motion", value: "Strong", pct: 84 },
      { label: "Chemical reactions", value: "On track", pct: 68 },
      { label: "Electricity", value: "Needs attention", pct: 34 },
    ],
    note: "Illustrative dashboard. Not customer data.",
  }),
});

const s6 = solutionPreview({
  id: "higher-education",
  tone: "paper",
  roles: ["Students", "Faculty", "HODs", "Management", "Placement teams"],
  highlights: [
    { lead: "Know who is slipping in week 3, not week 15.", rest: "Attendance, assessment and engagement together flag at-risk students while there is still a semester left to act." },
    { lead: "Answer whether the syllabus was actually covered.", rest: "Planned topics against delivered topics, per course, per faculty member, without anyone filing a report." },
    { lead: "Turn a degree into demonstrable skills.", rest: "Assessments mapped to the competencies employers screen for, so placement conversations start from evidence." },
    { lead: "Let faculty teach instead of prepare.", rest: "An AI co-pilot for course material, question banks and pacing, with the faculty member approving everything." },
  ],
  panel: dashboardMock({
    title: "Department analytics — B.Tech CSE, Semester 4",
    stats: [
      { label: "Students", value: "214" },
      { label: "At risk", value: "17" },
      { label: "Syllabus", value: "78%" },
    ],
    bars: [
      { label: "Employability readiness", value: "Improving", pct: 71 },
      { label: "Syllabus coverage vs plan", value: "78% of 86%", pct: 78 },
      { label: "Assessment participation", value: "Steady", pct: 92 },
    ],
    note: "Illustrative dashboard. Not customer data.",
  }),
});

const s7 = solutionPreview({
  id: "enterprise",
  tone: "ink",
  roles: ["Employees", "Managers", "HR", "L&D", "Leadership"],
  highlights: [
    { lead: "Know which skills your workforce has — and which it needs next.", rest: "A skills inventory built from assessment rather than from what people put on a form." },
    { lead: "See the distance between a person and a role.", rest: "Role readiness measured against the competencies that role requires, so internal mobility stops being guesswork." },
    { lead: "Spend the training budget where the gap is.", rest: "Upskilling and reskilling paths generated from measured gaps instead of a catalogue everyone is enrolled in." },
    { lead: "Show what the learning actually changed.", rest: "Re-assessment after the path, so the report to leadership is a movement in capability, not a completion rate." },
  ],
  panel: dashboardMock({
    title: "Workforce skills — Engineering, 1,240 people",
    stats: [
      { label: "Skills tracked", value: "86" },
      { label: "Critical gaps", value: "9" },
      { label: "Role ready", value: "64%" },
    ],
    bars: [
      { label: "Cloud architecture", value: "Gap: 2 levels", pct: 38 },
      { label: "Data engineering", value: "Gap: 1 level", pct: 62 },
      { label: "Secure development", value: "Meets requirement", pct: 88 },
    ],
    note: "Illustrative dashboard. Not customer data.",
  }),
});

const s8 = section({
  tone: "white",
  children: `    ${sectionHead({
    eyebrow: "Analytics",
    title: "From Learning Data to Actionable Intelligence",
    lede: "The same analytics engine, pointed at two different questions. Education asks who needs help and whether teaching is landing. Enterprise asks what the organization can do and what it cannot do yet.",
  })}
    <div class="mt-12 grid gap-8 lg:grid-cols-2">
      <div>
        <h3 class="text-xs font-semibold uppercase tracking-[0.16em] text-teal">For education</h3>
        <ul class="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-[15px] text-slate-body">
          <li>Student performance</li>
          <li>Learning gaps</li>
          <li>Attendance</li>
          <li>Assessment performance</li>
          <li>At-risk students</li>
          <li>Syllabus progress</li>
        </ul>
      </div>
      <div>
        <h3 class="text-xs font-semibold uppercase tracking-[0.16em] text-teal">For enterprise</h3>
        <ul class="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-[15px] text-slate-body">
          <li>Skills inventory</li>
          <li>Skill gaps</li>
          <li>Role readiness</li>
          <li>Learning progress</li>
          <li>Certification</li>
          <li>Workforce readiness</li>
        </ul>
      </div>
    </div>`,
});

const s9 = section({
  tone: "paper",
  children: `    ${sectionHead({
    eyebrow: "Integrations",
    title: "Works With the Systems You Already Use",
    lede: "GaugeSkills is a complete platform on its own, but very few organizations are starting from nothing. It connects to what is already in place rather than asking you to replace it.",
  })}
    ${integrationGrid([
      { title: "ERP", body: "Sync students, programmes, enrolment and attendance from the academic ERP a college already runs on." },
      { title: "HRMS", body: "Pull people, roles, reporting lines and departments so the skills view matches the org chart." },
      { title: "LMS", body: "Connect over LTI, so institutions committed to an existing LMS can add assessment, AI and analytics on top." },
      { title: "SSO and identity", body: "Sign-in through your existing identity provider, with provisioning and de-provisioning handled centrally." },
      { title: "APIs", body: "Read and write the underlying records where a workflow needs to live somewhere else." },
      { title: "Batch provisioning", body: "Bulk creation and updates for institutions that would rather move data on a schedule than in real time." },
    ])}
    <p data-reveal class="mt-8 text-[15px] text-slate-body">
      We list categories rather than logos. Which specific systems are supported depends on what you run, and that is a
      question for a technical session rather than a marketing page.
    </p>`,
});

const s10 = section({
  tone: "ink",
  children: `    <div class="grid gap-12 lg:grid-cols-[1fr_1fr]">
      <div>
        ${sectionHead({
          eyebrow: "Trust and security",
          title: "Built for Institutions That Have to Answer for the Data",
          lede: "Schools hold data about children. Colleges hold academic records. Enterprises hold assessment results tied to someone's career. The controls are the same, and they are not optional.",
          tone: "dark",
        })}
        <div class="mt-8">
          <a href="${rel("/security")}" class="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-6 py-3 text-[15px] font-semibold text-white transition-all duration-200 ease-out hover:border-cyan hover:text-cyan">Read the security detail</a>
        </div>
      </div>
      <ul class="space-y-4">
        <li data-reveal class="rounded-card border border-white/10 bg-white/5 p-5">
          <h3 class="text-[16px] font-semibold text-white">Isolated tenancy</h3>
          <p class="mt-1.5 text-[15px] leading-relaxed text-mist">Each organization's data sits in its own tenant. Nothing is pooled across customers.</p>
        </li>
        <li data-reveal style="--reveal-delay: 60ms" class="rounded-card border border-white/10 bg-white/5 p-5">
          <h3 class="text-[16px] font-semibold text-white">Role-based access</h3>
          <p class="mt-1.5 text-[15px] leading-relaxed text-mist">A parent sees their own child. A manager sees their own team. Permissions are scoped by role, not by trust.</p>
        </li>
        <li data-reveal class="rounded-card border border-white/10 bg-white/5 p-5">
          <h3 class="text-[16px] font-semibold text-white">Two-factor for staff</h3>
          <p class="mt-1.5 text-[15px] leading-relaxed text-mist">Accounts that can see other people's records can be required to use a second factor.</p>
        </li>
        <li data-reveal style="--reveal-delay: 60ms" class="rounded-card border border-white/10 bg-white/5 p-5">
          <h3 class="text-[16px] font-semibold text-white">Integration security</h3>
          <p class="mt-1.5 text-[15px] leading-relaxed text-mist">ERP, HRMS and SSO connections are scoped to the records they need, and the scope is agreed before anything is switched on.</p>
        </li>
      </ul>
    </div>`,
});

const s11 = section({
  tone: "paper",
  id: "faq",
  children: `    ${sectionHead({
    eyebrow: "Questions",
    title: "The questions that always come up",
  })}
    ${faq(homeFaq)}`,
});

const s12 = ctaBand({
  title: "Ready to Build Better Learning and Skills?",
  lede: "See how GaugeSkills can work for your school, college or organization. Tell us which one you are and we will show you the version of the platform that applies to you.",
  primary: { href: rel("/demo"), label: "Book a Demo" },
  secondary: { href: rel("/platform"), label: "Explore the Platform" },
});

/* -------------------------------------------------------------- the page */

export const home = {
  out: "index.html",
  canonical: "/",
  active: "/",
  title: "GaugeSkills — AI-powered Skills & Learning Intelligence Platform",
  description:
    "GaugeSkills helps schools, colleges and enterprises assess skills, identify gaps, personalize learning and measure growth — on one AI-powered platform.",
  ogImage: "og/home.png",
  schemaExtra: [softwareApplication(), faqPage(homeFaq)],
  body: [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12].join("\n"),
};
