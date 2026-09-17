/**
 * The GaugeSkills platform.
 *
 * This page answers one question: what is the thing all three solution lines
 * sit on top of? It is organised around seven capability areas in the order a
 * buyer meets them — assess, learn, AI, intelligence, analytics, integrations,
 * administration — and it keeps every operational capability the product
 * already ships, because a platform page that drops detail reads as a rewrite
 * rather than a repositioning.
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
  relatedLinks,
  roleGrid,
  section,
  sectionHead,
} from "../sections.mjs";
import { solutionById, solutions } from "../site.mjs";

const rel = linker("platform.html");

const faqs = [
  {
    q: "Is GaugeSkills an LMS or an assessment platform?",
    a: "It is both, and the point is the join between them. Courses, classes, homework, attendance and exams run here, and every assessment result is mapped to the concept or competency it tests. That mapping is what turns a mark into a gap, and a gap into the next thing a learner should do.",
  },
  {
    q: "Do we have to replace the systems we already run?",
    a: "No. GaugeSkills works as a complete platform, and it also connects over LTI and SSO and syncs with an academic ERP or an HRMS. An institution committed to an existing system can add assessment, the AI layer and the analytics on top of it rather than migrating first.",
  },
  {
    q: "Is it the same product for a school, a college and a company?",
    a: "The engine is the same: one assessment model, one skills model, one AI layer, one analytics layer. What changes is the configuration — the vocabulary, the roles, the dashboards and the workflows each market gets. Each customer is an isolated tenant, so nothing is shared between them.",
  },
  {
    q: "Does it work properly on a phone?",
    a: "The interface is built phone-first and installs as a progressive web app, so a student on a mid-range Android device gets the same product as a laptop user. The AI features do need connectivity, and we would rather say that than promise offline AI.",
  },
  {
    q: "How much of this exists today?",
    a: "Every capability described on this page exists in the product today. If something you need is missing, we would rather tell you in the first call than have you discover it during rollout.",
  },
];

const heroAside = `<div data-rise>
        ${dashboardMock({
          title: "Platform overview — one tenant",
          stats: [
            { label: "Active learners", value: "1,860" },
            { label: "Skills tracked", value: "74" },
            { label: "Gaps open", value: "23" },
          ],
          bars: [
            { label: "Course progress against plan", value: "On track", pct: 78 },
            { label: "Assessment participation", value: "Steady", pct: 91 },
            { label: "Gaps closed after re-assessment", value: "Improving", pct: 46 },
          ],
          note: "Illustrative dashboard. Not customer data.",
        })}
      </div>`;

/* -------------------------------------------------- one platform, three views */

/**
 * The comparison that proves the claim. Each column is the same platform
 * described in the words that market actually uses — the rows are identical
 * questions, the answers are not.
 */
function experienceColumn(id, rows, index) {
  const s = solutionById[id];
  const delay = index ? ` style="--reveal-delay: ${index * 70}ms"` : "";

  const entries = rows
    .map(
      (row) => `          <div>
            <dt class="text-[12px] font-semibold uppercase tracking-[0.1em] text-cyan">${row.label}</dt>
            <dd class="mt-1.5 text-[15px] leading-relaxed text-mist">${row.body}</dd>
          </div>`,
    )
    .join("\n");

  return `      <li data-reveal${delay} class="group relative flex flex-col rounded-card border border-white/10 bg-white/5 p-6">
        <span aria-hidden="true" class="h-1 w-12 rounded bg-cyan"></span>
        <h3 class="mt-5 text-2xl text-white">${s.label}</h3>
        <p class="mt-2 text-[15px] font-semibold text-cyan">${s.promise}</p>
        <dl class="mt-6 grow space-y-5">
${entries}
        </dl>
        <a href="${rel(s.path)}" class="mt-7 inline-flex items-center gap-1.5 text-[15px] font-semibold text-cyan">
          <span class="absolute inset-0" aria-hidden="true"></span>
          Explore ${s.label}
        </a>
      </li>`;
}

const experienceRows = {
  schools: [
    { label: "Who is in it", body: "Students, teachers, parents and the principal's office." },
    { label: "Assessment looks like", body: "Chapter tests, homework and practice sets tagged to the concept behind each question." },
    { label: "Learning looks like", body: "Subjects, chapters and a tutor that explains the lesson again after school." },
    { label: "Intelligence looks like", body: "Which concept broke, which students share that gap, and who needs support this week." },
  ],
  "higher-education": [
    { label: "Who is in it", body: "Students, faculty, HODs, management and the placement team." },
    { label: "Assessment looks like", body: "Internals, labs and end-semester assessments mapped to course outcomes and employability competencies." },
    { label: "Learning looks like", body: "Programmes, semesters, pacing against the approved syllabus, and remedial paths per student." },
    { label: "Intelligence looks like", body: "At-risk students in week three, syllabus coverage against plan, and readiness for placement conversations." },
  ],
  enterprise: [
    { label: "Who is in it", body: "Employees, managers, HR, L&amp;D and leadership." },
    { label: "Assessment looks like", body: "Role-based and scenario assessments scored against a defined level on a named skill." },
    { label: "Learning looks like", body: "Upskilling and reskilling paths built from measured gaps rather than a catalogue everyone is enrolled in." },
    { label: "Intelligence looks like", body: "A skills inventory, the distance between a person and a role, and where the training budget should go." },
  ],
};

/* -------------------------------------------------------------- capabilities */

/** Every capability area uses the same shape: eyebrow, outcome, grid. */
function capability({ id, tone, eyebrow, title, lede, grid }) {
  return section({
    tone,
    id,
    children: `    ${sectionHead({ eyebrow, title, lede, tone: tone === "ink" ? "dark" : "light" })}
    ${grid}`,
  });
}

/* ------------------------------------------------------------------ sections */

const s1 = hero({
  eyebrow: "Platform overview",
  h1: "One Platform for Skills, Learning and Intelligence",
  lede: "GaugeSkills runs the day-to-day work of teaching and training — courses, classes, assignments, attendance and exams — and adds the two things a traditional learning platform was never built to do: teach a learner one to one, and tell leadership what is actually happening underneath the marks.",
  primary: { href: rel("/demo"), label: "Book a Demo" },
  secondary: { href: rel("/skills"), label: "How skills are measured" },
  aside: heroAside,
});

const s2 = section({
  tone: "white",
  children: `    ${sectionHead({
    eyebrow: "How it works",
    title: "Measure, teach against the gap, then measure again",
    lede: "Most learning systems stop at delivery: content goes out, completion comes back. GaugeSkills closes the loop, so improvement is something you can show rather than something you assert.",
  })}
    ${lifecycleFlow({ tone: "light" })}
    <p data-reveal class="mt-12 max-w-3xl text-[15px] leading-relaxed text-slate-body">
      The capability areas below are the building blocks that loop runs on — internally GaugeAssess, GaugeLearn,
      GaugeAI, GaugeIntelligence, GaugeAnalytics and GaugeAdmin. You will rarely need the names. What matters is
      that each one writes to the same record, so an exam result, a tutoring session and a skill level all describe
      the same person.
    </p>`,
});

const s3 = section({
  tone: "ink",
  children: `    ${sectionHead({
    eyebrow: "One platform, three experiences",
    title: "The same engine. Three vocabularies.",
    lede: "A school buyer should never have to translate enterprise language, and an L&amp;D head should not be reading about report cards. The assessment model, the skills model, the AI layer and the analytics layer are shared. The words, the roles and the dashboards are not.",
    tone: "dark",
  })}
    <ul class="mt-12 grid gap-6 lg:grid-cols-3">
${solutions.map((s, i) => experienceColumn(s.id, experienceRows[s.id], i)).join("\n")}
    </ul>
    <p data-reveal class="mt-10 max-w-3xl text-[15px] leading-relaxed text-mist">
      One consequence worth stating plainly: a group that runs a school, a college and a corporate training arm is
      running one platform, not three procurements. Each remains an isolated tenant with its own roles and its own
      data.
    </p>`,
});

const s4 = capability({
  id: "assess",
  tone: "paper",
  eyebrow: "Assess",
  title: "Turn a mark into something you can act on",
  lede: "A score of 46% records that something went wrong. It does not say what. Assessment on GaugeSkills is built so the result points at a concept or a competency, because that is the only version of a result anyone can teach against.",
  grid: benefitGrid([
    {
      benefit: "See which concept broke, not just which student failed.",
      body: "Every question is tagged with the concept or competency it tests, so a weak result resolves to a named gap and the learners who share it are grouped automatically.",
      feature: "Concept-mapped assessment",
    },
    {
      benefit: "Run the exams and assignments you already run.",
      body: "Exam scheduling, section management, homework and assignments sit in the same place as the material they test, so nothing has to be reconciled afterwards.",
      feature: "Exams, sections and assignments",
    },
    {
      benefit: "Give learners practice aimed at what they got wrong.",
      body: "Practice sets generated per chapter with mastery tracked against each one, so repetition targets the weak concept instead of the whole syllabus.",
      feature: "Quizzes, prep and mastery tracking",
    },
    {
      benefit: "Stop rewriting good questions every term.",
      body: "A question bank organised by course, chapter and competency, with difficulty and concept held against each item so it can be reused with intent.",
      feature: "Question banks",
    },
    {
      benefit: "Measure a skill, not only a subject.",
      body: "Competency assessments score against a defined level on a named skill. That is what makes a gap comparable across a class, a department or a workforce.",
      feature: "Competency assessment",
    },
    {
      benefit: "Show movement by asking again later.",
      body: "Re-assessment after a learning path turns a completed module into a measured move from one level to the next.",
      feature: "Re-assessment",
    },
  ]),
});

const s5 = capability({
  id: "learn",
  tone: "white",
  eyebrow: "Learn",
  title: "The everyday surface students and faculty live in",
  lede: "Teaching, material, discussion and practice in one place, arranged the way Indian programmes are actually structured rather than the way a generic course catalogue assumes.",
  grid: cardGrid(
    [
      {
        title: "Course structure",
        body: "Stream, course, chapter and module — the shape schools and colleges already use, so nothing has to be reorganised to fit the software.",
      },
      {
        title: "Live and recorded classes",
        body: "Teaching stays in the same place as the material, so a student who missed a session picks it up in context rather than chasing a link.",
      },
      {
        title: "Content studio",
        body: "Build lessons, notes and visuals in the platform, or start from a generated draft. Nothing reaches a learner until an educator approves it.",
      },
      {
        title: "Personalized learning paths",
        body: "A path assembled from the gaps a learner actually has, so a strong learner moves ahead while another gets the earlier concept first.",
      },
      {
        title: "Discussions and announcements",
        body: "Class communication inside the course, instead of a parallel chat group that nobody can search three months later.",
      },
      {
        title: "Works on the phone people have",
        body: "The interface is built phone-first and installs as a progressive web app. AI features need connectivity, and we say so plainly.",
      },
    ],
    { columns: 3 },
  ),
});

const s6 = section({
  tone: "ink",
  id: "ai",
  children: `    ${sectionHead({
    eyebrow: "AI",
    title: "AI that removes the hours, not the expertise",
    lede: "Every AI output on GaugeSkills is a draft. A teacher, a faculty member or an L&amp;D owner reviews it before it reaches a learner. Authorship stays with the person who is accountable for it.",
    tone: "dark",
  })}
    ${cardGrid(
      [
        {
          title: "AI tutor and voice",
          body: "Conversational help that explains rather than hands over an answer, with sessions saved so they become revision material and a teacher can see where a student struggled.",
        },
        {
          title: "AI assistant",
          body: "A co-pilot for teachers, faculty and L&D teams: draft, summarise, prepare. What to teach and who needs help stays a human decision.",
        },
        {
          title: "AI content generation",
          body: "Lessons, worksheets and visuals drafted from the syllabus in minutes, then edited and approved before anyone sees them.",
        },
        {
          title: "AI assessment generation",
          body: "Questions written against a chapter or a competency and tagged with the skill they measure, so the results stay diagnostic.",
        },
        {
          title: "AI recommendations",
          body: "The chapter to revisit, the practice to run, the module to take. A result becomes an instruction rather than a number.",
        },
        {
          title: "AI insights",
          body: "Ask a question of the data in plain language and get the cohort, the trend or the list of people who need attention.",
        },
      ],
      { columns: 3, tone: "dark" },
    )}
    <p data-reveal class="mt-10 max-w-3xl text-[15px] leading-relaxed text-mist">
      There is a matching list of things the AI deliberately does not do — mark high-stakes exams on its own, decide
      who gets promoted, or present generated output as fact without a person signing it off.
      <a href="${rel("/ai")}" class="font-semibold text-cyan underline-offset-4 hover:underline">Read how the AI layer works</a>.
    </p>`,
});

const s7 = capability({
  id: "intelligence",
  tone: "paper",
  eyebrow: "Intelligence",
  title: "The layer that turns activity into a decision",
  lede: "Attendance, assessment and engagement are only records until something reads them together. This is the part of the platform that produces a shortlist short enough for a busy person to act on.",
  grid: benefitGrid([
    {
      benefit: "Know a student is slipping while the term can still change.",
      body: "Attendance, assessment and engagement read together produce a forward signal before the exam rather than an explanation after it.",
      feature: "Predicted grade and at-risk flags",
    },
    {
      benefit: "See the distance between a person and a role.",
      body: "Measured skill levels compared against what a role or a course requires, so internal mobility and placement stop being guesswork.",
      feature: "Role and course readiness",
    },
    {
      benefit: "Resolve a weak result into a named gap.",
      body: "Gap analysis against a skill taxonomy, so the output is a specific missing capability at a specific level rather than a low score.",
      feature: "Skill-gap analysis",
    },
    {
      benefit: "Teach the ten students with the same problem once.",
      body: "Learners who share a gap are grouped automatically, which makes remediation a scheduled session instead of ten separate conversations.",
      feature: "Cohort grouping",
    },
    {
      benefit: "Answer whether the syllabus was actually covered.",
      body: "Planned topics against delivered topics, per course and per faculty member, without anyone filing a report to find out.",
      feature: "Coverage against plan",
    },
    {
      benefit: "Get the next action, not only the number.",
      body: "Every signal carries a recommendation: the concept to revisit, the cohort to pull, the skill the organization should build first.",
      feature: "Recommendations",
    },
  ]),
});

const s8 = section({
  tone: "white",
  id: "analytics",
  children: `    ${sectionHead({
    eyebrow: "Analytics",
    title: "One record, read differently by each person who needs it",
    lede: "The same underlying data, pointed at different questions. A teacher asks who needs help this week. A head of department asks whether teaching is landing. An L&amp;D lead asks what the organization cannot do yet.",
  })}
    <div class="mt-12 grid items-start gap-12 lg:grid-cols-[1fr_1fr]">
      <ul class="space-y-4">
        <li data-reveal class="rounded-card border border-hairline p-5">
          <h3 class="text-[16px] font-semibold text-ink">Performance analyzer</h3>
          <p class="mt-1.5 text-[15px] leading-relaxed text-slate-body">Chapter-level success across a class, not a single average that hides both the strong and the struggling.</p>
        </li>
        <li data-reveal style="--reveal-delay: 60ms" class="rounded-card border border-hairline p-5">
          <h3 class="text-[16px] font-semibold text-ink">Teaching snapshot</h3>
          <p class="mt-1.5 text-[15px] leading-relaxed text-slate-body">Courses handled, classes conducted and coverage against plan, kept current instead of assembled at the end of term.</p>
        </li>
        <li data-reveal class="rounded-card border border-hairline p-5">
          <h3 class="text-[16px] font-semibold text-ink">Faculty evaluation</h3>
          <p class="mt-1.5 text-[15px] leading-relaxed text-slate-body">Structured evaluation in one place, with the teaching record beside it rather than in a separate file.</p>
        </li>
        <li data-reveal style="--reveal-delay: 60ms" class="rounded-card border border-hairline p-5">
          <h3 class="text-[16px] font-semibold text-ink">Institution and workforce rollups</h3>
          <p class="mt-1.5 text-[15px] leading-relaxed text-slate-body">Cross-department views for leadership, with AI insights that summarise the trend instead of leaving it in a table.</p>
        </li>
      </ul>
      ${dashboardMock({
        title: "Department analytics — Semester 4",
        stats: [
          { label: "Learners", value: "214" },
          { label: "At risk", value: "17" },
          { label: "Coverage", value: "78%" },
        ],
        bars: [
          { label: "Chapter mastery — averaged", value: "On track", pct: 72 },
          { label: "Syllabus delivered against plan", value: "Behind by 8 points", pct: 78 },
          { label: "Assessment participation", value: "Steady", pct: 94 },
        ],
        note: "Illustrative dashboard. Not customer data.",
      })}
    </div>
    ${roleGrid([
      { role: "Students", line: "Their own progress, mastery per chapter and what to work on next." },
      { role: "Teachers and faculty", line: "Class performance, who needs help this week, and coverage against the plan." },
      { role: "Parents", line: "Their own child only: progress, attendance and where support would count." },
      { role: "HODs and leadership", line: "Performance across courses, departments and terms, early enough to act on." },
      { role: "HR and L&D", line: "Skills inventory, role readiness and where capability is thin." },
    ])}`,
});

const s9 = section({
  tone: "paper",
  id: "integrations",
  children: `    ${sectionHead({
    eyebrow: "Integrations",
    title: "Add the measurement layer without replacing what runs today",
    lede: "GaugeSkills is complete on its own, but almost nobody is starting from nothing. An institution with an ERP it trusts or an LMS it has just rolled out can keep both and put assessment, AI and analytics on top.",
  })}
    ${integrationGrid([
      { title: "Academic ERP", body: "Sync students, programmes, enrolment and attendance so the academic record stays in one system of truth." },
      { title: "HRMS", body: "Pull people, roles, departments and reporting lines, so the skills view matches the org chart rather than a spreadsheet." },
      { title: "LMS over LTI", body: "Launch assessments, the tutor and the analytics from inside an existing LMS, with results flowing back." },
      { title: "SSO and identity", body: "Sign-in through your identity provider, with provisioning and de-provisioning handled centrally." },
      { title: "APIs", body: "Read and write the underlying records where a workflow genuinely needs to live somewhere else." },
      { title: "Batch provisioning", body: "Bulk creation and updates for institutions that would rather move data on a schedule than in real time." },
    ])}
    <p data-reveal class="mt-8 max-w-3xl text-[15px] leading-relaxed text-slate-body">
      We list categories rather than logos. Which specific systems are supported depends on what you run, and the
      honest version of that answer comes from a technical session, not a marketing page.
    </p>`,
});

const s10 = capability({
  id: "administration",
  tone: "white",
  eyebrow: "Administration",
  title: "The operational record the office actually depends on",
  lede: "Attendance, report cards, messaging and access control are not glamorous, and a platform that ignores them quietly becomes a second system somebody has to keep in sync by hand.",
  grid: cardGrid(
    [
      {
        title: "Smart attendance",
        body: "Faculty mark it once. Students, parents and the analytics layer all read the same record, with no separate register.",
      },
      {
        title: "Curriculum pacing",
        body: "Plan the term week by week against the approved syllabus, then watch delivery against that plan as it happens.",
      },
      {
        title: "Report card",
        body: "A single academic record for the student and the parent, assembled from the assessments that already ran.",
      },
      {
        title: "Messages and directory",
        body: "Inbox, sent and a searchable people directory, so communication has a record attached to the right person.",
      },
      {
        title: "Notifications and announcements",
        body: "Announcements that reach the class, the cohort or the department, rather than a notice nobody opened.",
      },
      {
        title: "Roles, tenancy and access",
        body: "Each organization is an isolated tenant. Access is scoped by role, and staff accounts that can see other people's records can be required to use a second factor.",
      },
    ],
    { columns: 3 },
  ),
});

const s11 = section({
  tone: "paper",
  id: "faq",
  children: `    ${sectionHead({ eyebrow: "Questions", title: "What buyers ask about the platform" })}
    ${faq(faqs)}`,
});

const s12 = ctaBand({
  title: "See the platform with your own courses in it",
  lede: "A generic tour proves very little. Tell us a subject, a programme or a role you care about and we will walk the loop with that, from the first assessment to the re-assessment.",
  primary: { href: rel("/demo"), label: "Book a Demo" },
  secondary: { href: rel("/ai"), label: "How the AI layer works" },
});

const s13 = relatedLinks(
  [
    { label: "Schools", path: "/schools", note: "The platform in school vocabulary: classes, subjects, parents." },
    { label: "Higher Education", path: "/higher-education", note: "Programmes, semesters, at-risk students and placement readiness." },
    { label: "Enterprise", path: "/enterprise", note: "Skills inventory, role readiness and workforce capability." },
    { label: "Learning paths", path: "/learning-paths", note: "How a measured gap becomes an ordered route through content." },
    { label: "AI", path: "/ai", note: "What the AI layer does, and what it deliberately will not do." },
    { label: "Security", path: "/security", note: "Tenancy, role-based access and integration scope." },
  ],
  rel,
);

export const platform = {
  out: "platform.html",
  canonical: "/platform",
  title: "The GaugeSkills Platform | Skills, Learning & Intelligence",
  description:
    "One learning platform for courses, assessments, attendance and analytics, with an AI and skills layer that shows what learners can actually do.",
  ogImage: "og/platform.png",
  breadcrumbs: [{ name: "Platform", path: "/platform" }],
  schemaExtra: [softwareApplication(), faqPage(faqs)],
  body: [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13].join("\n"),
};
