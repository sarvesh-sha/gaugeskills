/**
 * GaugeSkills for Schools.
 *
 * Vocabulary discipline: students, teachers, parents, principals, classes,
 * subjects, terms. Nothing on this page borrows enterprise or college
 * language — a school buyer should not have to translate.
 */

import { linker } from "../layout.mjs";
import { faqPage } from "../seo.mjs";
import {
  benefitGrid,
  ctaBand,
  dashboardMock,
  faq,
  hero,
  relatedLinks,
  roleGrid,
  section,
  sectionHead,
} from "../sections.mjs";

const rel = linker("schools.html");

const faqs = [
  {
    q: "Will teachers actually use it?",
    a: "The way in is the workload, not a mandate. A teacher who can produce a worksheet or a practice set in a few minutes instead of an evening has a reason to open it tomorrow. Everything the AI drafts is edited and approved by the teacher before a student sees it, so authorship stays where it belongs.",
  },
  {
    q: "Is this safe for children's data?",
    a: "Each school is an isolated tenant, access is role-based, and a parent account can only ever see its own linked children. Staff accounts that can see other people's records can be required to use two-factor login. For questions about retention and residency we will put our engineering team in front of yours.",
  },
  {
    q: "Does the AI tutor just give students the answers?",
    a: "It is built to explain rather than to hand over a solution, and it works from the material the school teaches rather than the open internet. Sessions are saved, so a teacher can see what a student struggled with and the student can use it as revision.",
  },
  {
    q: "Do we need to replace what we already use?",
    a: "No. GaugeSkills works as a complete platform, and it also connects over LTI and SSO, so a school committed to an existing system can add assessments, the tutor and the analytics on top of it.",
  },
  {
    q: "What about students without a good connection at home?",
    a: "The platform installs as a progressive web app and is built phone-first, so the interface is light. The AI features do need connectivity, and we would rather say that plainly than promise offline AI.",
  },
];

const heroAside = `<div data-rise>
        ${dashboardMock({
          title: "Class overview — Grade 7 Mathematics",
          stats: [
            { label: "Students", value: "42" },
            { label: "Need support", value: "8" },
            { label: "Avg. mastery", value: "69%" },
          ],
          bars: [
            { label: "Fractions", value: "Strong", pct: 86 },
            { label: "Ratio and proportion", value: "On track", pct: 64 },
            { label: "Algebraic expressions", value: "Needs attention", pct: 31 },
          ],
          note: "Illustrative dashboard. Not customer data.",
        })}
      </div>`;

const s1 = hero({
  eyebrow: "GaugeSkills for Schools",
  h1: "Build Stronger Foundations with AI-Powered Learning",
  lede: "Every class has students who quietly fall behind and a teacher with no hours left to find them. GaugeSkills measures what each student actually understands, gives them help when the school day is over, and gives teachers the time back.",
  primary: { href: rel("/demo"), label: "Book a School Demo" },
  secondary: { href: rel("/platform"), label: "See the platform" },
  aside: heroAside,
});

const s2 = section({
  tone: "white",
  children: `    ${sectionHead({
    eyebrow: "The problem",
    title: "A grade tells you something went wrong. It does not tell you what.",
    lede: "A student scores 46% in a test. The report card records 46%. Nobody can say whether the problem was fractions from two years ago, the wording of the questions, or three weeks of absence in October. So the next term starts on top of a gap nobody located.",
  })}
    <div class="mt-10 grid gap-5 sm:grid-cols-3">
      <div data-reveal class="rounded-card border border-hairline p-6">
        <p class="font-display text-[15px] font-semibold text-teal">What schools can see today</p>
        <p class="mt-2 text-[15px] leading-relaxed text-slate-body">Marks, attendance and a teacher's impression at the end of term.</p>
      </div>
      <div data-reveal style="--reveal-delay: 60ms" class="rounded-card border border-hairline p-6">
        <p class="font-display text-[15px] font-semibold text-teal">What they need to see</p>
        <p class="mt-2 text-[15px] leading-relaxed text-slate-body">Which concept broke, which students share that gap, and whether last month's support worked.</p>
      </div>
      <div data-reveal class="rounded-card border border-hairline p-6">
        <p class="font-display text-[15px] font-semibold text-teal">What changes</p>
        <p class="mt-2 text-[15px] leading-relaxed text-slate-body">Intervention moves from the end of the year to the week the gap appears.</p>
      </div>
    </div>`,
});

const s3 = section({
  tone: "paper",
  children: `    ${sectionHead({
    eyebrow: "Who it is for",
    title: "Four people, one system, four different views",
    lede: "A school runs on four relationships. Each one gets the view that matches what they are responsible for — and nothing beyond it.",
  })}
    ${roleGrid([
      { role: "Students", line: "A tutor that explains a topic again after school, and practice aimed at what they got wrong." },
      { role: "Teachers", line: "Quizzes and material drafted in minutes, plus a class view showing who needs help this week." },
      { role: "Parents", line: "Their own child's progress, attendance and where a little support at home would count." },
      { role: "School leadership", line: "Performance across classes, subjects and terms, without waiting for exam results." },
    ])}`,
});

const s4 = section({
  tone: "white",
  children: `    ${sectionHead({
    eyebrow: "What it does",
    title: "Built around the school day, not around a catalogue",
  })}
    ${benefitGrid([
      {
        benefit: "See which students need help before they fall behind.",
        body: "Assessments are mapped to the concepts underneath them, so a weak result points at a specific gap. Students who share that gap are grouped automatically.",
        feature: "Learning-gap identification",
      },
      {
        benefit: "Give every student patient help after school.",
        body: "An AI tutor that explains a topic as many times as it takes, in the language the student is comfortable with, working from what the school actually teaches.",
        feature: "AI tutor",
      },
      {
        benefit: "Give a teacher their Sunday evening back.",
        body: "Worksheets, practice sets and lesson material drafted from the syllabus in minutes. The teacher edits and approves before anything reaches a class.",
        feature: "AI content and quiz generation",
      },
      {
        benefit: "Set work that matches the student in front of you.",
        body: "Learning paths built from the gaps a student actually has, so a strong student moves on and a struggling one gets the earlier concept first.",
        feature: "Personalized learning paths",
      },
      {
        benefit: "Tell parents something more useful than a mark.",
        body: "A parent view scoped strictly to their own children: progress over the term, attendance, and the one or two things worth practising at home.",
        feature: "Parent visibility",
      },
      {
        benefit: "Show leadership how the school is doing while it can still act.",
        body: "Progress by class, subject and term, with the cohorts that need attention surfaced rather than buried in a spreadsheet.",
        feature: "School analytics",
      },
    ])}`,
});

const s5 = section({
  tone: "ink",
  children: `    <div class="grid items-center gap-12 lg:grid-cols-[1fr_1fr]">
      <div>
        ${sectionHead({
          eyebrow: "For teachers",
          title: "The AI drafts. The teacher decides.",
          lede: "A teacher asks for twenty practice questions on the water cycle for a mixed-ability Grade 6 class. What comes back is a draft — editable, rejectable, and nobody's until the teacher approves it. That distinction is the whole design.",
          tone: "dark",
        })}
        <ul class="mt-8 space-y-3">
          <li class="flex gap-3"><span aria-hidden="true" class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan"></span><span class="text-[15px] leading-relaxed text-mist">Lesson plans and explanations from the syllabus already in use</span></li>
          <li class="flex gap-3"><span aria-hidden="true" class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan"></span><span class="text-[15px] leading-relaxed text-mist">Practice sets pitched at three different levels for the same class</span></li>
          <li class="flex gap-3"><span aria-hidden="true" class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan"></span><span class="text-[15px] leading-relaxed text-mist">Questions tagged with the concept they test, so results are diagnostic</span></li>
          <li class="flex gap-3"><span aria-hidden="true" class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan"></span><span class="text-[15px] leading-relaxed text-mist">A weekly summary of who is struggling, and with what</span></li>
        </ul>
      </div>
      <div data-reveal class="rounded-card border border-white/10 bg-white/5 p-6">
        <p class="text-xs font-semibold uppercase tracking-[0.16em] text-cyan">Teacher assistant</p>
        <div class="mt-5 rounded-xl bg-ink/60 p-4">
          <p class="text-[13px] font-medium text-mist">Request</p>
          <p class="mt-1.5 text-[15px] leading-relaxed text-white">Twenty questions on the water cycle for Grade 6, three difficulty levels, tagged by concept.</p>
        </div>
        <div class="mt-4 rounded-xl border border-cyan/25 bg-cyan/10 p-4">
          <p class="text-[13px] font-medium text-cyan">Draft returned</p>
          <p class="mt-1.5 text-[15px] leading-relaxed text-white">20 questions across evaporation, condensation, precipitation and collection. Awaiting your review.</p>
        </div>
        <p class="mt-4 text-[12px] text-mist">Illustrative interface. Not customer data.</p>
      </div>
    </div>`,
});

const s6 = section({
  tone: "paper",
  children: `    ${sectionHead({
    eyebrow: "Trust",
    title: "A parent sees their child. Nobody else's.",
    lede: "Schools hold data about children, which sets the bar higher than convenience. Access is scoped by role, each school is an isolated tenant, and staff accounts that can see other people's records can be required to use a second factor at login.",
  })}
    <div class="mt-8">
      <a href="${rel("/security")}" class="inline-flex items-center justify-center gap-2 rounded-full border border-hairline px-6 py-3 text-[15px] font-semibold text-ink transition-all duration-200 ease-out hover:border-teal hover:text-teal">Read the security detail</a>
    </div>`,
});

const s7 = section({
  tone: "white",
  children: `    ${sectionHead({ eyebrow: "Questions", title: "What schools ask first" })}
    ${faq(faqs)}`,
});

const s8 = ctaBand({
  title: "See it against your own classes",
  lede: "We would rather show you the platform with a subject and a year group you recognise than run a generic tour. Tell us which class to use.",
  primary: { href: rel("/demo"), label: "Book a School Demo" },
  secondary: { href: rel("/ai-tutor"), label: "How the AI tutor works" },
});

const s9 = relatedLinks(
  [
    { label: "AI tutor", path: "/ai-tutor", note: "What the tutor does, and what it deliberately will not do." },
    { label: "The platform", path: "/platform", note: "The common layer underneath all three solution lines." },
    { label: "For parents", path: "/parents", note: "The parent view, scoped to linked children only." },
    { label: "Skills", path: "/skills", note: "How a skill is measured rather than self-reported." },
    { label: "Higher Education", path: "/higher-education", note: "The same platform, for colleges and universities." },
    { label: "Security", path: "/security", note: "Tenancy, access control and integration scope." },
  ],
  rel,
);

export const schools = {
  out: "schools.html",
  canonical: "/schools",
  title: "AI Learning & Skills Platform for Schools | GaugeSkills",
  description:
    "GaugeSkills helps schools find learning gaps early, give every student an AI tutor after school, and save teachers hours on assessments and lesson material.",
  ogImage: "og/schools.png",
  breadcrumbs: [{ name: "Schools", path: "/schools" }],
  schemaExtra: [faqPage(faqs)],
  body: [s1, s2, s3, s4, s5, s6, s7, s8, s9].join("\n"),
};
