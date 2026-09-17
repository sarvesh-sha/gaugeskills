/**
 * GaugeSkills for Enterprise.
 *
 * Vocabulary discipline: employees, managers, HR, L&D, roles, competencies,
 * skill levels, upskilling, internal mobility, HRMS. No academic language —
 * an L&D lead should never read "semester" or "syllabus" on this page.
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

const rel = linker("enterprise.html");

const faqs = [
  {
    q: "Is this another LMS?",
    a: "No. An LMS delivers training and records that it happened. GaugeSkills starts one step earlier, by measuring what people can actually do against what their roles require, and finishes one step later, by re-assessing to show whether the training changed anything. It can run as the whole platform or sit alongside an LMS you already own.",
  },
  {
    q: "How do you assess skills without taking a week off everyone's calendar?",
    a: "Assessments are scoped to the competencies a role is defined by, so an employee answers for the skills that matter to their role rather than working through a catalogue. Most sittings are short, and a measured skill level carries forward, so moving between roles re-uses evidence instead of re-collecting it.",
  },
  {
    q: "Will employees trust a system that puts a level on them?",
    a: "That depends on how it is introduced. A skill level in GaugeSkills is visible to the employee, it arrives with the learning path that closes the gap, and it is a development input rather than a performance rating. We would not recommend using it as one, and the product is not built to support that.",
  },
  {
    q: "Does it connect to our HRMS and identity provider?",
    a: "Yes. People, roles, departments and reporting lines sync from the HRMS so the skills view matches the org chart, and sign-in runs through your existing identity provider with central provisioning. Which specific systems apply depends on what you run, which is a technical session rather than a claim on a web page.",
  },
  {
    q: "Who reviews what the AI produces?",
    a: "A person, every time. The assistant drafts learning content, summarises assessment results and proposes a path. L&D owns what gets published, the manager owns the development conversation, and no AI output reaches an employee without someone approving it first.",
  },
];

const heroAside = `<div data-rise>
        ${dashboardMock({
          title: "Role readiness — Data & Analytics, 320 people",
          stats: [
            { label: "Skills tracked", value: "74" },
            { label: "Critical gaps", value: "6" },
            { label: "Role ready", value: "58%" },
          ],
          bars: [
            { label: "Data modelling", value: "Gap: 2 levels", pct: 41 },
            { label: "Cloud platforms", value: "Gap: 1 level", pct: 66 },
            { label: "Stakeholder communication", value: "Meets requirement", pct: 87 },
          ],
          note: "Illustrative dashboard. Not customer data.",
        })}
      </div>`;

const s1 = hero({
  eyebrow: "GaugeSkills for Enterprise",
  h1: "Build a Workforce Ready for What&apos;s Next",
  lede: "Most organizations cannot say what their people are actually able to do. Skills sit in job titles, old CVs and a self-assessment form nobody quite believes. GaugeSkills measures skills against the roles you need filled, shows where the gaps are, and builds the upskilling that closes them.",
  primary: { href: rel("/demo"), label: "Talk to Our Enterprise Team" },
  secondary: { href: rel("/platform"), label: "See the platform" },
  aside: heroAside,
});

const s2 = section({
  tone: "white",
  children: `    ${sectionHead({
    eyebrow: "The problem",
    title: "Your org chart says what people were hired to do. It does not say what they can do.",
    lede: "A function is asked to take on a new platform next quarter. Nobody can say how many people are already close, how many need four weeks, and how many are starting from zero. The planning cycle below is the one most organizations run, and it fails at the same point every time.",
  })}
    <ol class="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <li data-reveal class="rounded-card border border-hairline p-6">
        <p class="text-xs font-semibold uppercase tracking-[0.16em] text-teal">Step 1</p>
        <h3 class="mt-3 text-[16px] font-semibold text-ink">A capability is committed to</h3>
        <p class="mt-2 text-[15px] leading-relaxed text-slate-body">Leadership takes on a new platform, a new market or an AI programme, with a date attached to it.</p>
      </li>
      <li data-reveal style="--reveal-delay: 60ms" class="rounded-card border border-teal/40 bg-paper p-6">
        <p class="text-xs font-semibold uppercase tracking-[0.16em] text-teal">Step 2</p>
        <h3 class="mt-3 text-[16px] font-semibold text-ink">Skills are estimated</h3>
        <p class="mt-2 text-[15px] leading-relaxed text-slate-body">HR circulates a self-assessment. Managers fill in what they remember. Nobody treats the result as reliable.</p>
      </li>
      <li data-reveal class="rounded-card border border-hairline p-6">
        <p class="text-xs font-semibold uppercase tracking-[0.16em] text-teal">Step 3</p>
        <h3 class="mt-3 text-[16px] font-semibold text-ink">Training is bought</h3>
        <p class="mt-2 text-[15px] leading-relaxed text-slate-body">A catalogue is licensed and the whole function is enrolled, whatever each person's starting point was.</p>
      </li>
      <li data-reveal style="--reveal-delay: 60ms" class="rounded-card border border-hairline p-6">
        <p class="text-xs font-semibold uppercase tracking-[0.16em] text-teal">Step 4</p>
        <h3 class="mt-3 text-[16px] font-semibold text-ink">Completion is reported</h3>
        <p class="mt-2 text-[15px] leading-relaxed text-slate-body">The review deck shows hours and completion rates. It cannot show that capability moved, because nothing was measured first.</p>
      </li>
    </ol>
    <p data-reveal class="mt-8 max-w-3xl text-[15px] leading-relaxed text-slate-body">
      Step two is where the rest of the cycle goes wrong. GaugeSkills replaces the estimate with a measurement, and
      everything downstream — the spend, the paths, the report to leadership — starts pointing at something real.
    </p>`,
});

const s3 = section({
  tone: "paper",
  children: `    ${sectionHead({
    eyebrow: "Who it is for",
    title: "One skills record, five different questions asked of it",
    lede: "An employee, a manager and a leadership team are not looking for the same thing. Each gets the view that matches the decision they have to make, and nothing beyond it.",
  })}
    ${roleGrid([
      { role: "Employees", line: "A measured skill profile, the gaps between it and the role they want next, and a path aimed at those gaps." },
      { role: "Managers", line: "Where the team is strong, where it is short, and who is close to ready for the work coming next quarter." },
      { role: "HR", line: "A skills inventory that matches the org chart, kept current from the HRMS rather than from a survey." },
      { role: "L&D", line: "Programmes aimed at measured gaps, and re-assessment that shows what each programme actually changed." },
      { role: "Leadership", line: "Workforce readiness by function and role, and which capabilities the organization should build first." },
    ])}`,
});

const s4 = section({
  tone: "white",
  children: `    ${sectionHead({
    eyebrow: "What it does",
    title: "Measure first, then teach against what the measurement found",
  })}
    ${benefitGrid([
      {
        benefit: "Know which skills your workforce has — and which skills it needs next.",
        body: "Skills are measured against a defined level, then compared with what each role requires. The inventory reflects assessed capability rather than what people typed into a form last year.",
        feature: "Skill-gap analysis",
      },
      {
        benefit: "Stop guessing whether someone is ready for a role.",
        body: "Role readiness is scored against the competencies the role is defined by, so staffing a project, approving a move or shortlisting for a promotion starts from evidence.",
        feature: "Role-based skills",
      },
      {
        benefit: "Spend the training budget where the gap actually is.",
        body: "Upskilling and reskilling paths are assembled from measured gaps, so a person who already holds a skill skips it and a person two levels short starts where they need to.",
        feature: "Personalized learning paths",
      },
      {
        benefit: "Give every employee help without adding headcount to L&D.",
        body: "An AI learning assistant that answers a question in the flow of work, draws on your own material rather than the open internet, and keeps the session as reference.",
        feature: "AI learning assistant",
      },
      {
        benefit: "Show leadership what the learning changed.",
        body: "Re-assessment at the end of a path, so the quarterly report is a movement in skill level and role readiness instead of a completion percentage.",
        feature: "Training effectiveness",
      },
      {
        benefit: "Fill roles from inside before you advertise them.",
        body: "Internal mobility based on skill adjacency: who sits one or two levels away from a role you need filled, and what it would take to close the distance.",
        feature: "Internal mobility",
      },
    ])}`,
});

const s5 = section({
  tone: "ink",
  children: `    <div class="grid items-center gap-12 lg:grid-cols-[1fr_1fr]">
      <div>
        ${sectionHead({
          eyebrow: "Skills measurement",
          title: "A skills inventory you can defend in a planning meeting",
          lede: "Everything else on this page depends on the measurement being credible. So a skill level is produced by assessment against a published definition, tied to the role framework HR already maintains, and re-taken on a schedule — because an inventory that is accurate once is a document, not a system.",
          tone: "dark",
        })}
        <ul class="mt-8 space-y-3">
          <li class="flex gap-3"><span aria-hidden="true" class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan"></span><span class="text-[15px] leading-relaxed text-mist">Employee skill assessment against a defined level, not a five-point self-rating</span></li>
          <li class="flex gap-3"><span aria-hidden="true" class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan"></span><span class="text-[15px] leading-relaxed text-mist">Competency assessment mapped to the role definitions your HR team already owns</span></li>
          <li class="flex gap-3"><span aria-hidden="true" class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan"></span><span class="text-[15px] leading-relaxed text-mist">Certifications recorded with their expiry, so a compliance-critical skill does not lapse unnoticed</span></li>
          <li class="flex gap-3"><span aria-hidden="true" class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan"></span><span class="text-[15px] leading-relaxed text-mist">Manager dashboards scoped to their own team; workforce analytics for HR and leadership</span></li>
          <li class="flex gap-3"><span aria-hidden="true" class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan"></span><span class="text-[15px] leading-relaxed text-mist">Scheduled re-assessment, so the inventory stays current after the first rollout</span></li>
        </ul>
      </div>
      <div data-reveal class="rounded-card border border-white/10 bg-white/5 p-6">
        <p class="text-xs font-semibold uppercase tracking-[0.16em] text-cyan">Role readiness</p>
        <p class="mt-1.5 text-[13px] text-mist">Cloud Platform Engineer &middot; internal move</p>
        <ul class="mt-6 space-y-4">
          <li>
            <div class="flex items-baseline justify-between text-[14px]">
              <span class="font-medium text-white">Infrastructure as code</span>
              <span class="text-cyan">Required 4 &middot; held 4</span>
            </div>
            <div class="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
              <div data-bar style="--bar-width: 80%" class="h-full rounded-full bg-cyan"></div>
            </div>
          </li>
          <li>
            <div class="flex items-baseline justify-between text-[14px]">
              <span class="font-medium text-white">Incident response</span>
              <span class="text-cyan">Required 3 &middot; held 3</span>
            </div>
            <div class="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
              <div data-bar style="--bar-width: 60%; --bar-delay: 90ms" class="h-full rounded-full bg-cyan"></div>
            </div>
          </li>
          <li>
            <div class="flex items-baseline justify-between text-[14px]">
              <span class="font-medium text-white">Container orchestration</span>
              <span class="text-amber">Required 4 &middot; held 2</span>
            </div>
            <div class="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
              <div data-bar style="--bar-width: 40%; --bar-delay: 180ms" class="h-full rounded-full bg-amber"></div>
            </div>
          </li>
        </ul>
        <div class="mt-6 rounded-xl border border-cyan/25 bg-cyan/10 p-4">
          <p class="text-[13px] font-semibold uppercase tracking-[0.12em] text-cyan">Path assigned</p>
          <p class="mt-1.5 text-[14px] leading-relaxed text-white">Three of five competencies meet the requirement. The two gaps have a targeted path attached, with re-assessment scheduled before the move is confirmed.</p>
        </div>
        <p class="mt-4 text-[12px] text-mist">Illustrative interface. Not customer data.</p>
      </div>
    </div>`,
});

const s6 = section({
  tone: "paper",
  children: `    ${sectionHead({
    eyebrow: "Trust",
    title: "A skill level can follow someone&apos;s career. It is handled accordingly.",
    lede: "An assessment result in GaugeSkills can influence a project, a move or a promotion conversation, which is why access is scoped rather than open. A manager sees their own team. Each organization is an isolated tenant with nothing pooled across customers. HRMS and identity connections are limited to the records they need, and that scope is agreed before anything is switched on.",
  })}
    <div class="mt-8">
      <a href="${rel("/security")}" class="inline-flex items-center justify-center gap-2 rounded-full border border-hairline px-6 py-3 text-[15px] font-semibold text-ink transition-all duration-200 ease-out hover:border-teal hover:text-teal">Read the security detail</a>
    </div>`,
});

const s7 = section({
  tone: "white",
  children: `    ${sectionHead({ eyebrow: "Questions", title: "What HR and L&amp;D ask first" })}
    ${faq(faqs)}`,
});

const s8 = ctaBand({
  title: "Start with one function, not the whole company",
  lede: "Pick a team and a role you are trying to staff. We will assess against that role definition, show the gaps and the paths that follow, and you can judge the platform on its output rather than on a pitch.",
  primary: { href: rel("/demo"), label: "Talk to Our Enterprise Team" },
  secondary: { href: rel("/skills-gap-analysis"), label: "How skill-gap analysis works" },
});

const s9 = relatedLinks(
  [
    { label: "Skills", path: "/skills", note: "What a skill level means here, and how it is arrived at." },
    { label: "Skills gap analysis", path: "/skills-gap-analysis", note: "Comparing measured skills against what a role requires." },
    { label: "Employee skill assessment", path: "/employee-skill-assessment", note: "How an assessment is scoped, run and scored." },
    { label: "Upskilling", path: "/upskilling", note: "Deepening the skills a role already needs today." },
    { label: "Reskilling", path: "/reskilling", note: "Moving people into roles the organization needs filled." },
    { label: "AI", path: "/ai", note: "What the AI layer drafts, and where a person signs off." },
  ],
  rel,
);

export const enterprise = {
  out: "enterprise.html",
  canonical: "/enterprise",
  title: "AI-Powered Skills & Learning Platform for Enterprise | GaugeSkills",
  description:
    "GaugeSkills measures the skills your workforce has, finds the gaps against each role, and builds upskilling paths that show measurable capability change.",
  ogImage: "og/enterprise.png",
  breadcrumbs: [{ name: "Enterprise", path: "/enterprise" }],
  schemaExtra: [faqPage(faqs)],
  body: [s1, s2, s3, s4, s5, s6, s7, s8, s9].join("\n"),
};
