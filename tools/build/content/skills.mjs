/**
 * Skills.
 *
 * The argument of this page is narrow and it is made early: a skill level is
 * evidence of something demonstrated, not a claim somebody typed into a form.
 * Everything after that — taxonomy, levels, gap analysis, readiness — follows
 * from it. The three worked examples exist because "a skill" means a different
 * object to a Grade 6 teacher, a placement officer and a head of L&D.
 */

import { linker } from "../layout.mjs";
import { faqPage } from "../seo.mjs";
import {
  benefitGrid,
  cardGrid,
  ctaBand,
  dashboardMock,
  faq,
  hero,
  relatedLinks,
  section,
  sectionHead,
} from "../sections.mjs";
import { solutionById, solutions } from "../site.mjs";

const rel = linker("skills.html");

const faqs = [
  {
    q: "Where does a skill level actually come from?",
    a: "From assessment. A level is written only when someone has demonstrated the skill on questions or tasks mapped to it, and the level carries the evidence behind it: which assessments, which items, and when. Nobody types their own level into a form, and a manager cannot award one without evidence.",
  },
  {
    q: "Do we have to build a skill taxonomy before we start?",
    a: "No. You can start from a standard framework and adapt it, or bring the competency framework you already use and map assessments to it. Most institutions begin with a small set of skills that matter for one programme or one role family, and widen it once the loop is running.",
  },
  {
    q: "How is this different from a competency spreadsheet?",
    a: "A spreadsheet records an opinion at a point in time and then ages quietly. Here the level is produced by assessment, updated by re-assessment, and shown with the date of the evidence, so a stale level looks stale rather than authoritative.",
  },
  {
    q: "How often should people be re-assessed?",
    a: "That is your decision, and it depends on how fast the skill moves. What the platform insists on is honesty about age: every level is shown with when it was last demonstrated, and a level nobody has re-tested in a year is presented as exactly that.",
  },
  {
    q: "Is this meant to be used in appraisals?",
    a: "It is meant to inform development, not to decide someone's career. Skill evidence tells a manager where the gap is and what would close it. GaugeSkills does not make hiring, promotion or termination decisions and is not built to be used as the basis for one.",
  },
];

const heroAside = `<div data-rise class="rounded-card border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
        <div class="flex items-baseline justify-between">
          <p class="text-xs font-semibold uppercase tracking-[0.16em] text-cyan">Skill record</p>
          <p class="text-[13px] text-mist">Last demonstrated: 12 days ago</p>
        </div>
        <p class="mt-5 font-display text-2xl font-bold text-white">Applied statistics</p>
        <div class="mt-4 flex items-baseline justify-between text-[14px]">
          <span class="font-medium text-white">Measured level</span>
          <span class="text-cyan">Level 2 of 5</span>
        </div>
        <div class="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
          <div data-bar style="--bar-width: 40%" class="h-full rounded-full bg-cyan"></div>
        </div>
        <div class="mt-6 rounded-xl bg-ink/60 p-4">
          <p class="text-[13px] font-semibold uppercase tracking-[0.12em] text-mist">Evidence behind the level</p>
          <p class="mt-1.5 text-[15px] leading-relaxed text-white">Three assessments mapped to this skill, plus one applied task. Not a self-rating.</p>
        </div>
        <div class="mt-4 rounded-xl border border-cyan/25 bg-cyan/10 p-4">
          <p class="text-[13px] font-semibold uppercase tracking-[0.12em] text-cyan">Gap</p>
          <p class="mt-1.5 text-[15px] leading-relaxed text-white">The target requires level 4. A learning path for the two missing levels has been assigned.</p>
        </div>
        <p class="mt-4 text-[12px] text-mist">Illustrative interface. Not customer data.</p>
      </div>`;

/* --------------------------------------------- one skill, three vocabularies */

/**
 * The same model, written out for a school student, a college learner and an
 * employee. Each column is a real worked example rather than the same sentence
 * with the nouns changed, because the three audiences do not share a unit of
 * measurement: a concept, a course outcome and a role standard are different
 * objects even when the machinery underneath is identical.
 */
function skillExample({ id, calledA, skill, level, meaning, evidence, next }, index) {
  const s = solutionById[id];

  return `      <li data-reveal style="--reveal-delay: ${index * 70}ms" class="group relative flex flex-col rounded-card border border-hairline bg-white p-6 shadow-soft">
        <span aria-hidden="true" class="h-1 w-12 rounded bg-cyan"></span>
        <h3 class="mt-5 text-2xl text-ink">${s.label}</h3>
        <p class="mt-2 text-[15px] leading-relaxed text-slate-body">${calledA}</p>
        <div class="mt-6 rounded-xl bg-paper p-4">
          <p class="text-[12px] font-semibold uppercase tracking-[0.1em] text-teal">Worked example</p>
          <p class="mt-1.5 text-[17px] font-semibold text-ink">${skill}</p>
          <p class="mt-1 text-[15px] font-semibold text-teal">${level}</p>
          <p class="mt-2 text-[15px] leading-relaxed text-slate-body">${meaning}</p>
        </div>
        <dl class="mt-5 grow space-y-4">
          <div>
            <dt class="text-[12px] font-semibold uppercase tracking-[0.1em] text-teal">Evidence behind it</dt>
            <dd class="mt-1 text-[15px] leading-relaxed text-slate-body">${evidence}</dd>
          </div>
          <div>
            <dt class="text-[12px] font-semibold uppercase tracking-[0.1em] text-teal">What happens next</dt>
            <dd class="mt-1 text-[15px] leading-relaxed text-slate-body">${next}</dd>
          </div>
        </dl>
        <a href="${rel(s.path)}" class="mt-6 inline-flex items-center gap-1.5 text-[15px] font-semibold text-teal">
          <span class="absolute inset-0" aria-hidden="true"></span>
          Explore ${s.label}
        </a>
      </li>`;
}

const skillExamples = {
  schools: {
    calledA:
      "For a school student a skill is a concept inside a subject. It is named the way the syllabus names it, because a parent should recognise the words.",
    skill: "Comparing fractions — Mathematics, Grade 6",
    level: "Level 2 of 5 — guided",
    meaning:
      "Compares fractions confidently when the denominators match. Falls back to guessing when they do not.",
    evidence:
      "Four questions tagged to this concept across two class tests, and the practice set assigned after the first one. No part of the level comes from the student or the teacher rating it.",
    next:
      "Equivalent fractions practice before the class moves on to adding unlike denominators, plus a tutor session on the step being skipped.",
  },
  "higher-education": {
    calledA:
      "For a college learner a skill is a course outcome that an employer also happens to screen for. It has to satisfy both the academic record and the placement conversation.",
    skill: "Data interpretation — B.Tech CSE, Semester 4",
    level: "Level 3 of 5 — independent",
    meaning:
      "Reads a dataset and reaches a conclusion the data supports. Cannot yet defend why one statistical method was chosen over another.",
    evidence:
      "Two lab submissions and a mid-semester assessment, each item mapped to the course outcome and to the underlying competency.",
    next:
      "Analyst roles the placement team screens for ask for level 4. A path targeting method selection is assigned, and the skill is re-assessed at the end of it.",
  },
  enterprise: {
    calledA:
      "For an employee a skill is a requirement of a role, held at a defined level. The comparison that matters is the distance between the person and the standard.",
    skill: "SQL for analysis — Data Operations",
    level: "Level 3 of 5, against a role that requires level 4",
    meaning:
      "Writes joins and aggregations against a known schema. Needs review on query performance and window functions.",
    evidence:
      "A scenario assessment completed this quarter and scored against the role standard, not a line on a CV or an annual self-rating.",
    next:
      "A reskilling path aimed at the two weak areas. Re-assessment afterwards shows whether the level moved, which is what gets reported.",
  },
};

/* ----------------------------------------------------------------- sections */

const s1 = hero({
  eyebrow: "Skills and skill-gap analysis",
  h1: "Understand the Skills That Matter",
  lede: "Marks, degrees and job titles are proxies. They tell you what somebody sat through, not what they can do. GaugeSkills measures skills directly, at a defined level, from assessment evidence — for a Grade 6 student, a final-year engineering learner and an engineer with nine years behind them.",
  primary: { href: rel("/demo"), label: "Book a Demo" },
  secondary: { href: rel("/skills-gap-analysis"), label: "See skill-gap analysis" },
  aside: heroAside,
});

const s2 = section({
  tone: "white",
  children: `    ${sectionHead({
    eyebrow: "The rule that makes this work",
    title: "A level is something you demonstrated, not something you claimed",
    lede: "Almost every skills inventory in existence is built on self-report: people rate themselves, managers moderate the ratings, and the result is a confident-looking table that nobody can defend. GaugeSkills does not write a level unless somebody has shown the skill on an assessment mapped to it.",
  })}
    <div class="mt-12 grid gap-5 lg:grid-cols-3">
      <div data-reveal class="rounded-card border border-hairline bg-paper p-6">
        <p class="text-xs font-semibold uppercase tracking-[0.16em] text-teal">What a level is not</p>
        <p class="mt-3 text-[15px] leading-relaxed text-slate-body">A self-rating on a five-point form. A line on a CV. A course somebody completed. An opinion formed in a review meeting eleven months ago.</p>
      </div>
      <div data-reveal style="--reveal-delay: 60ms" class="rounded-card border border-hairline bg-paper p-6">
        <p class="text-xs font-semibold uppercase tracking-[0.16em] text-teal">What a level is</p>
        <p class="mt-3 text-[15px] leading-relaxed text-slate-body">A judgement produced by performance on questions and tasks tagged to that skill, held with the items behind it and the date it was demonstrated.</p>
      </div>
      <div data-reveal class="rounded-card border border-hairline bg-paper p-6">
        <p class="text-xs font-semibold uppercase tracking-[0.16em] text-teal">Why the difference matters</p>
        <p class="mt-3 text-[15px] leading-relaxed text-slate-body">Only one of the two can be compared across a cohort, taught against, or re-tested later to show that something changed.</p>
      </div>
    </div>
    <p data-reveal class="mt-10 max-w-3xl text-[15px] leading-relaxed text-slate-body">
      There is a cost to this rule and it is worth being honest about it: a skill nobody has assessed has no level, and
      the platform shows it as unmeasured rather than filling the gap with a guess. An empty cell you can act on is
      more useful than a number you cannot trust.
    </p>`,
});

const s3 = section({
  tone: "paper",
  children: `    ${sectionHead({
    eyebrow: "Assessment",
    title: "Measure the skill, not just the syllabus",
    lede: "Skills assessment and competency assessment are the entry point to everything else on this page. If the assessment does not know which skill each question tests, nothing downstream can be trusted.",
  })}
    ${benefitGrid(
      [
        {
          benefit: "Find out what somebody can do, at what level.",
          body: "Assessments scored against a defined level on a named skill rather than a percentage, so the output is comparable between two people and across a year.",
          feature: "Skills assessment",
        },
        {
          benefit: "Test the applied version, not just the recall version.",
          body: "Scenario and task-based assessments for skills that only show up in application, alongside objective questions for the knowledge underneath them.",
          feature: "Competency assessment",
        },
        {
          benefit: "Make every existing test contribute.",
          body: "Class tests, internals, labs and role assessments you already run feed the skill record once their items are tagged, so measurement is not a separate programme of work.",
          feature: "Item-level mapping",
        },
        {
          benefit: "Keep the measurement current.",
          body: "Re-assessment on a cycle you set, with each level carrying the date it was last demonstrated so an old level is visibly old.",
          feature: "Re-assessment cycles",
        },
        {
          benefit: "Compare people fairly across sections and teams.",
          body: "The same skill definition and the same level descriptors apply wherever the assessment ran, so a level means one thing across the institution.",
          feature: "Shared definitions",
        },
        {
          benefit: "Show a result the learner can act on.",
          body: "Every measured skill returns the level, the evidence behind it and the specific thing standing between the learner and the next level.",
          feature: "Evidence-backed results",
        },
      ],
      { columns: 3 },
    )}`,
});

const s4 = section({
  tone: "ink",
  children: `    <div class="grid items-start gap-12 lg:grid-cols-[0.95fr_1.05fr]">
      <div>
        ${sectionHead({
          eyebrow: "Taxonomy and levels",
          title: "A shared way of naming a skill, and five ways of holding it",
          lede: "A taxonomy is the structure that lets a concept in a Grade 6 classroom and a requirement in a job description sit in the same system. Skills are grouped into families, each skill carries level descriptors, and each level says what a person at that level can actually do.",
          tone: "dark",
        })}
        <p class="mt-8 text-[15px] leading-relaxed text-mist">
          You can start from a standard framework and adapt it, or map to the competency framework your institution
          already uses. Level descriptors are written in observable behaviour, because a descriptor nobody can assess
          against is decoration.
        </p>
      </div>
      <ol class="space-y-3">
        <li data-reveal class="flex gap-4 rounded-card border border-white/10 bg-white/5 p-5">
          <span aria-hidden="true" class="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-cyan text-[13px] font-bold text-ink">1</span>
          <div>
            <h3 class="text-[16px] font-semibold text-white">Aware</h3>
            <p class="mt-1 text-[15px] leading-relaxed text-mist">Recognises the idea and the vocabulary. Cannot yet apply it.</p>
          </div>
        </li>
        <li data-reveal style="--reveal-delay: 60ms" class="flex gap-4 rounded-card border border-white/10 bg-white/5 p-5">
          <span aria-hidden="true" class="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-cyan text-[13px] font-bold text-ink">2</span>
          <div>
            <h3 class="text-[16px] font-semibold text-white">Guided</h3>
            <p class="mt-1 text-[15px] leading-relaxed text-mist">Succeeds on familiar cases with support or a worked pattern to follow.</p>
          </div>
        </li>
        <li data-reveal class="flex gap-4 rounded-card border border-white/10 bg-white/5 p-5">
          <span aria-hidden="true" class="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-cyan text-[13px] font-bold text-ink">3</span>
          <div>
            <h3 class="text-[16px] font-semibold text-white">Independent</h3>
            <p class="mt-1 text-[15px] leading-relaxed text-mist">Applies the skill unaided in the situations it was taught for.</p>
          </div>
        </li>
        <li data-reveal style="--reveal-delay: 60ms" class="flex gap-4 rounded-card border border-white/10 bg-white/5 p-5">
          <span aria-hidden="true" class="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-cyan text-[13px] font-bold text-ink">4</span>
          <div>
            <h3 class="text-[16px] font-semibold text-white">Proficient</h3>
            <p class="mt-1 text-[15px] leading-relaxed text-mist">Handles unfamiliar and ambiguous cases, and can explain the choices made.</p>
          </div>
        </li>
        <li data-reveal class="flex gap-4 rounded-card border border-white/10 bg-white/5 p-5">
          <span aria-hidden="true" class="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-cyan text-[13px] font-bold text-ink">5</span>
          <div>
            <h3 class="text-[16px] font-semibold text-white">Teaches it</h3>
            <p class="mt-1 text-[15px] leading-relaxed text-mist">Sets the standard for others and can diagnose why someone else is stuck.</p>
          </div>
        </li>
      </ol>
    </div>`,
});

const s5 = section({
  tone: "white",
  id: "three-views",
  children: `    ${sectionHead({
    eyebrow: "One model, three vocabularies",
    title: "The same skill record, read by a teacher, a placement officer and a manager",
    lede: "A school student, a college learner and an employee are described by the same underlying object: a named skill, a measured level, the evidence behind it and the gap to a target. What changes is what the skill is called, what the target is, and who the record has to convince.",
  })}
    <ul class="mt-12 grid gap-6 lg:grid-cols-3">
${solutions.map((s, i) => skillExample({ id: s.id, ...skillExamples[s.id] }, i)).join("\n")}
    </ul>
    <p data-reveal class="mt-8 text-[13px] text-slate-body">Illustrative examples. Not customer data.</p>`,
});

const s6 = section({
  tone: "paper",
  id: "gap-analysis",
  children: `    ${sectionHead({
    eyebrow: "Skill-gap analysis",
    title: "Name the distance between where someone is and what the target requires",
    lede: "A gap is arithmetic once both sides are measured: the level a person holds, against the level a course outcome or a role standard asks for. The value is not the subtraction. It is that both numbers were produced the same way.",
  })}
    <div class="mt-12 grid items-start gap-12 lg:grid-cols-[1fr_1fr]">
      <ul class="space-y-4">
        <li data-reveal class="rounded-card border border-hairline bg-white p-5">
          <h3 class="text-[16px] font-semibold text-ink">For one person</h3>
          <p class="mt-1.5 text-[15px] leading-relaxed text-slate-body">Which skills sit below the target, by how many levels, and which single gap is blocking the most progress.</p>
        </li>
        <li data-reveal style="--reveal-delay: 60ms" class="rounded-card border border-hairline bg-white p-5">
          <h3 class="text-[16px] font-semibold text-ink">For a group</h3>
          <p class="mt-1.5 text-[15px] leading-relaxed text-slate-body">Learners who share a gap are grouped automatically, which turns ten separate conversations into one session worth scheduling.</p>
        </li>
        <li data-reveal class="rounded-card border border-hairline bg-white p-5">
          <h3 class="text-[16px] font-semibold text-ink">For an organization</h3>
          <p class="mt-1.5 text-[15px] leading-relaxed text-slate-body">Where capability is thin across a department or a workforce, ranked by gap size, so budget follows measured need.</p>
        </li>
        <li data-reveal style="--reveal-delay: 60ms" class="rounded-card border border-hairline bg-white p-5">
          <h3 class="text-[16px] font-semibold text-ink">Over time</h3>
          <p class="mt-1.5 text-[15px] leading-relaxed text-slate-body">Re-assessment after the learning path, so the report describes a movement in level rather than a completion rate.</p>
        </li>
      </ul>
      ${dashboardMock({
        title: "Skill gaps — Data Operations, 64 people",
        stats: [
          { label: "Skills tracked", value: "18" },
          { label: "Gaps open", value: "7" },
          { label: "At target", value: "61%" },
        ],
        bars: [
          { label: "SQL for analysis", value: "Gap: 1 level", pct: 60 },
          { label: "Data modelling", value: "Gap: 2 levels", pct: 38 },
          { label: "Reporting and visualisation", value: "Meets requirement", pct: 84 },
        ],
        note: "Illustrative dashboard. Not customer data.",
      })}
    </div>
    <p data-reveal class="mt-10 max-w-3xl text-[15px] leading-relaxed text-slate-body">
      The method is the same whether the target is a course outcome or a job description.
      <a href="${rel("/skills-gap-analysis")}" class="font-semibold text-teal underline-offset-4 hover:underline">Read more on skill-gap analysis</a>,
      or see how it runs against a role in
      <a href="${rel("/employee-skill-assessment")}" class="font-semibold text-teal underline-offset-4 hover:underline">employee skill assessment</a>.
    </p>`,
});

const s7 = section({
  tone: "white",
  children: `    ${sectionHead({
    eyebrow: "Recommendations",
    title: "A gap is only useful if something follows it",
    lede: "Identifying a missing skill and then handing someone a course catalogue is where most skills programmes quietly stop. Recommendations are assembled from the specific gap, at the level the person actually holds.",
  })}
    ${cardGrid(
      [
        {
          title: "Start at the right level",
          body: "A path aimed at moving one level, from where the evidence says the person is, rather than a beginner module somebody at level 3 will abandon in a week.",
        },
        {
          title: "Order by what is blocking progress",
          body: "Gaps that sit underneath other gaps come first, so a learner is not taught the advanced topic before the prerequisite they missed two years ago.",
        },
        {
          title: "Finish with a re-assessment",
          body: "Each path ends where it started, on the same skill, so completion is followed by a measured level rather than a certificate.",
        },
      ],
      { columns: 3 },
    )}
    <p data-reveal class="mt-10 max-w-3xl text-[15px] leading-relaxed text-slate-body">
      For a workforce these paths take two familiar shapes:
      <a href="${rel("/upskilling")}" class="font-semibold text-teal underline-offset-4 hover:underline">upskilling</a>
      to deepen a skill the role already needs, and
      <a href="${rel("/reskilling")}" class="font-semibold text-teal underline-offset-4 hover:underline">reskilling</a>
      to build a capability the person does not yet have.
    </p>`,
});

const s8 = section({
  tone: "ink",
  children: `    ${sectionHead({
    eyebrow: "Readiness",
    title: "Answer the readiness question with evidence instead of a feeling",
    lede: "Every institution eventually faces a version of the same question. Is this student ready for the next year, this cohort ready for placement, this team ready for the work arriving next quarter. Measured skills make that answerable.",
    tone: "dark",
  })}
    <div class="mt-12 grid gap-6 lg:grid-cols-2">
      <div data-reveal class="rounded-card border border-white/10 bg-white/5 p-7">
        <p class="text-xs font-semibold uppercase tracking-[0.16em] text-cyan">Student and learner readiness</p>
        <h3 class="mt-4 text-2xl text-white">Ready for the next stage, or carrying a gap into it</h3>
        <p class="mt-3 text-[15px] leading-relaxed text-mist">
          Prerequisite skills checked before a class moves on, so a gap is closed in the term it appeared rather than
          compounding across three years. For a final-year cohort, the same record shows which employability
          competencies are held at which level, which gives a placement team something firmer than a CV.
        </p>
      </div>
      <div data-reveal style="--reveal-delay: 60ms" class="rounded-card border border-white/10 bg-white/5 p-7">
        <p class="text-xs font-semibold uppercase tracking-[0.16em] text-cyan">Workforce readiness</p>
        <h3 class="mt-4 text-2xl text-white">What the organization can do, and what it cannot do yet</h3>
        <p class="mt-3 text-[15px] leading-relaxed text-mist">
          A skills inventory built from assessment, so internal mobility starts from evidence and a hiring plan can
          separate the roles that must be recruited from the ones that can be built. Decisions about people stay with
          managers and HR. The platform supplies the evidence, not the verdict.
        </p>
        <p class="mt-5 text-[15px] leading-relaxed text-mist">
          <a href="${rel("/enterprise")}" class="font-semibold text-cyan underline-offset-4 hover:underline">See the enterprise view</a>.
        </p>
      </div>
    </div>`,
});

const s9 = section({
  tone: "paper",
  id: "faq",
  children: `    ${sectionHead({ eyebrow: "Questions", title: "What people ask about measuring skills" })}
    ${faq(faqs)}`,
});

const s10 = ctaBand({
  title: "Start with one skill that matters to you",
  lede: "Pick a concept a cohort keeps failing, or a role you are struggling to fill internally. We will show you how that one skill is defined, assessed, gapped and re-measured before you commit to anything wider.",
  primary: { href: rel("/demo"), label: "Book a Demo" },
  secondary: { href: rel("/platform"), label: "Explore the platform" },
});

const s11 = relatedLinks(
  [
    { label: "Skill-gap analysis", path: "/skills-gap-analysis", note: "The method in detail, for a person, a cohort and a workforce." },
    { label: "Competency management", path: "/competency-management", note: "Describing behaviour in context, where a discrete skill is not enough." },
    { label: "Employee skill assessment", path: "/employee-skill-assessment", note: "Measuring skills against a role standard rather than a syllabus." },
    { label: "Learning paths", path: "/learning-paths", note: "Turning a measured gap into the shortest route that closes it." },
    { label: "Upskilling", path: "/upskilling", note: "Deepening a skill the role already requires." },
    { label: "Reskilling", path: "/reskilling", note: "Building a capability somebody does not yet have." },
  ],
  rel,
);

export const skills = {
  out: "skills.html",
  canonical: "/skills",
  title: "Skills Assessment & Skill-Gap Analysis | GaugeSkills",
  description:
    "Measure skills from assessment evidence rather than self-report. See skill levels, competency mapping and skill-gap analysis for students and employees.",
  ogImage: "og/skills.png",
  breadcrumbs: [{ name: "Skills", path: "/skills" }],
  schemaExtra: [faqPage(faqs)],
  body: [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11].join("\n"),
};
