/**
 * Topic landing pages.
 *
 * Each page owns one search intent and refuses to borrow another one's
 * argument: the tutor page is about explanation, the assessment page is about
 * establishing a level, the gap page is about the arithmetic between them, and
 * upskilling and reskilling are separated by whether the person stays in their
 * role or leaves it.
 *
 * They share a skeleton — hero, breadcrumb bar, a plain definition, a grid,
 * one differentiated block, FAQ, CTA, related links — so the skeleton is
 * declared once in `topicPage()` and each page below supplies only the parts
 * that make it different from the other seven.
 */

import { linker } from "../layout.mjs";
import { faqPage } from "../seo.mjs";
import {
  benefitGrid,
  breadcrumbs,
  cardGrid,
  ctaBand,
  dashboardMock,
  faq,
  hero,
  lifecycleFlow,
  relatedLinks,
  section,
  sectionHead,
} from "../sections.mjs";

/* ----------------------------------------------------------- constants */

const HOME = { name: "Home", path: "/" };
const AI = { name: "AI", path: "/ai" };
const HIGHER_ED = { name: "Higher Education", path: "/higher-education" };
const ENTERPRISE = { name: "Enterprise", path: "/enterprise" };
const SKILLS = { name: "Skills", path: "/skills" };
const PLATFORM = { name: "Platform", path: "/platform" };

/** One shared social card. These pages are a set and should read as one. */
const OG_IMAGE = "og/topic.png";

/** Every mocked panel says so, in the same words, every time. */
const DASHBOARD_NOTE = "Illustrative dashboard. Not customer data.";
const INTERFACE_NOTE = "Illustrative interface. Not customer data.";

/* ------------------------------------------------------------- factory */

/**
 * Assemble one topic page.
 *
 * @param {object} spec
 * @param {string} spec.out          Output file, e.g. "ai-tutor.html".
 * @param {string} spec.canonical    Site-absolute path.
 * @param {string} spec.title        SEO title.
 * @param {string} spec.description  Meta description.
 * @param {Array<{name: string, path: string}>} spec.trail
 *        Breadcrumb trail excluding Home. Drives both the schema and the
 *        visible bar, so the two can never drift apart.
 * @param {object} spec.intro        Hero copy and calls to action.
 * @param {string} [spec.aside]      Optional hero panel.
 * @param {(rel: Function) => string[]} spec.middle
 *        The body between the breadcrumb bar and the FAQ. Takes the link
 *        resolver because a differentiated block sometimes links out.
 * @param {Array<{q: string, a: string}>} spec.faqs
 * @param {object} spec.close        CTA band copy.
 * @param {Array<{label: string, path: string, note: string}>} spec.links
 * @returns {object} A page object for the build registry.
 */
function topicPage({
  out,
  canonical,
  title,
  description,
  trail,
  intro,
  aside,
  middle,
  faqs,
  faqTitle,
  close,
  links,
  linksHeading,
}) {
  const rel = linker(out);

  const top = hero({
    eyebrow: intro.eyebrow,
    h1: intro.h1,
    lede: intro.lede,
    primary: { href: rel("/demo"), label: intro.primaryLabel },
    secondary: { href: rel(intro.secondary.path), label: intro.secondary.label },
    aside,
  });

  const questions = section({
    tone: "white",
    id: "faq",
    children: `    ${sectionHead({ eyebrow: "Questions", title: faqTitle })}
    ${faq(faqs)}`,
  });

  const band = ctaBand({
    title: close.title,
    lede: close.lede,
    primary: { href: rel("/demo"), label: close.primaryLabel },
    secondary: { href: rel(close.secondary.path), label: close.secondary.label },
  });

  return {
    out,
    canonical,
    title,
    description,
    ogImage: OG_IMAGE,
    breadcrumbs: trail,
    schemaExtra: [faqPage(faqs)],
    body: [
      top,
      breadcrumbs([HOME, ...trail], rel),
      ...middle(rel),
      questions,
      band,
      relatedLinks(links, rel, linksHeading ? { heading: linksHeading } : undefined),
    ].join("\n"),
  };
}

/* ------------------------------------------------------- 1. /ai-tutor */

const tutorPanel = `<div data-rise class="rounded-card border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
        <p class="text-xs font-semibold uppercase tracking-[0.16em] text-cyan">Tutor session</p>
        <div class="mt-5 rounded-xl bg-ink/60 p-4">
          <p class="text-[13px] font-medium text-mist">Student, 10:40pm</p>
          <p class="mt-1.5 text-[15px] leading-relaxed text-white">I keep getting question 4 wrong. Can you just give me the answer?</p>
        </div>
        <div class="mt-4 rounded-xl border border-cyan/25 bg-cyan/10 p-4">
          <p class="text-[13px] font-medium text-cyan">Tutor</p>
          <p class="mt-1.5 text-[15px] leading-relaxed text-white">Not yet. Your setup is right and the substitution step is where it breaks. Redo that one line and I will check it with you.</p>
        </div>
        <div class="mt-4 rounded-xl bg-ink/60 p-4">
          <p class="text-[13px] font-medium text-mist">Saved to the learning record</p>
          <p class="mt-1.5 text-[15px] leading-relaxed text-white">Simultaneous equations. Second session this week. Visible to the teacher tomorrow morning.</p>
        </div>
        <p class="mt-4 text-[12px] text-mist">${INTERFACE_NOTE}</p>
      </div>`;

const aiTutor = topicPage({
  out: "ai-tutor.html",
  canonical: "/ai-tutor",
  title: "AI Tutor for Students and Learners | GaugeSkills",
  description:
    "An AI tutor that explains a topic again after class, works from the material your institution teaches, and saves every session for the teacher to see.",
  trail: [AI, { name: "AI tutor", path: "/ai-tutor" }],
  intro: {
    eyebrow: "AI tutor",
    h1: "What an AI Tutor Actually Does",
    lede: "Most learners do not get stuck during the lesson. They get stuck at night, on question four, with nobody to ask. An AI tutor is the patient second explanation — grounded in what the institution teaches, and visible to the teacher afterwards.",
    primaryLabel: "Book a Demo",
    secondary: { path: "/ai", label: "See how the AI layer works" },
  },
  aside: tutorPanel,
  middle: (rel) => [
    section({
      tone: "white",
      children: `    ${sectionHead({
        eyebrow: "What this actually means",
        title: "A search result answers. A tutor explains.",
        lede: "An AI tutor is a conversation that stays on one difficulty until it is gone. It asks what the learner already tried, works out where the reasoning broke, and explains that step — again, differently, as many times as it takes, without sighing.",
      })}
    <div class="mt-10 grid gap-5 sm:grid-cols-3">
      <div data-reveal class="rounded-card border border-hairline p-6">
        <p class="font-display text-[15px] font-semibold text-teal">It works from your material</p>
        <p class="mt-2 text-[15px] leading-relaxed text-slate-body">The tutor is pointed at the syllabus, the course content and the assessments the institution uses, so its explanation matches the one the class was given.</p>
      </div>
      <div data-reveal style="--reveal-delay: 60ms" class="rounded-card border border-hairline p-6">
        <p class="font-display text-[15px] font-semibold text-teal">It holds a conversation</p>
        <p class="mt-2 text-[15px] leading-relaxed text-slate-body">A learner can say they still do not understand. That is the whole point. The explanation changes approach rather than repeating itself word for word.</p>
      </div>
      <div data-reveal class="rounded-card border border-hairline p-6">
        <p class="font-display text-[15px] font-semibold text-teal">It leaves a trail</p>
        <p class="mt-2 text-[15px] leading-relaxed text-slate-body">Sessions are saved against the learner. The teacher sees what the class struggled with; the learner gets their own explanations back as revision.</p>
      </div>
    </div>`,
    }),
    section({
      tone: "paper",
      children: `    ${sectionHead({
        eyebrow: "What it changes",
        title: "Help arrives at the hour it is needed",
      })}
    ${benefitGrid([
      {
        benefit: "A learner who is stuck at 11pm is not stuck until Monday.",
        body: "The tutor is available outside the timetable, so a gap that would have compounded over a weekend gets closed the night it appears.",
        feature: "Always-available explanation",
      },
      {
        benefit: "Ask the obvious question without asking it in front of the class.",
        body: "Plenty of learners will not raise a hand. A private conversation removes the social cost of not understanding something everyone else seems to have understood.",
        feature: "Private practice",
      },
      {
        benefit: "Learn in the language the learner thinks in.",
        body: "Explanation can switch language while the subject vocabulary stays as the course uses it, which matters in classrooms where the medium of instruction is a second language.",
        feature: "Multilingual explanation",
      },
      {
        benefit: "Practice aimed at the thing that broke.",
        body: "The tutor can generate a few more questions on exactly the step the learner got wrong, rather than sending them back through the whole chapter.",
        feature: "Targeted practice",
      },
      {
        benefit: "Teachers find out what the class did not follow.",
        body: "When eleven students ask the tutor about the same step, that is a signal about the lesson, not about the eleven students. It reaches the teacher as a summary.",
        feature: "Session insight for educators",
      },
    ])}`,
    }),
    section({
      tone: "ink",
      children: `    <div class="grid items-start gap-12 lg:grid-cols-[1fr_1fr]">
      <div>
        ${sectionHead({
          eyebrow: "The limits",
          title: "The interesting part is what it refuses to do",
          lede: "A tutor that hands over answers is a homework machine, and every teacher can tell within a fortnight. The constraints below are design decisions, not missing features.",
          tone: "dark",
        })}
        <ul class="mt-8 space-y-3">
          <li class="flex gap-3"><span aria-hidden="true" class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan"></span><span class="text-[15px] leading-relaxed text-mist">It works the learner towards the answer rather than supplying it</span></li>
          <li class="flex gap-3"><span aria-hidden="true" class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan"></span><span class="text-[15px] leading-relaxed text-mist">It stays inside the institution's material instead of the open internet</span></li>
          <li class="flex gap-3"><span aria-hidden="true" class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan"></span><span class="text-[15px] leading-relaxed text-mist">It does not grade formal assessments or decide what a learner is worth</span></li>
          <li class="flex gap-3"><span aria-hidden="true" class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan"></span><span class="text-[15px] leading-relaxed text-mist">It does not set the curriculum; the teacher or faculty member still does</span></li>
          <li class="flex gap-3"><span aria-hidden="true" class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan"></span><span class="text-[15px] leading-relaxed text-mist">Sessions are visible to the educator responsible for that learner</span></li>
        </ul>
        <div class="mt-9">
          <a href="${rel("/ai")}" class="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-6 py-3 text-[15px] font-semibold text-white transition-all duration-200 ease-out hover:border-cyan hover:text-cyan">How the AI layer is built</a>
        </div>
      </div>
      <div data-reveal class="rounded-card border border-white/10 bg-white/5 p-6">
        <p class="text-xs font-semibold uppercase tracking-[0.16em] text-cyan">Where the teacher stays in charge</p>
        <dl class="mt-6 space-y-5">
          <div>
            <dt class="text-[15px] font-semibold text-white">The material</dt>
            <dd class="mt-1.5 text-[15px] leading-relaxed text-mist">Loaded and approved by the institution, so the tutor teaches the syllabus rather than a version of it.</dd>
          </div>
          <div>
            <dt class="text-[15px] font-semibold text-white">The record</dt>
            <dd class="mt-1.5 text-[15px] leading-relaxed text-mist">Every session belongs to the learner's file. Nothing about the tutor is hidden from the teacher.</dd>
          </div>
          <div>
            <dt class="text-[15px] font-semibold text-white">The judgement</dt>
            <dd class="mt-1.5 text-[15px] leading-relaxed text-mist">What a learner has mastered is confirmed by assessment and by a person, not asserted by a chat window.</dd>
          </div>
        </dl>
      </div>
    </div>`,
    }),
  ],
  faqTitle: "What learners and teachers ask",
  faqs: [
    {
      q: "Will students use it to cheat on homework?",
      a: "The tutor is built to walk a learner through a problem rather than complete it, and it will say no to a request for a finished answer. It is not a perfect defence against a determined student, which is why sessions are recorded against the learner and visible to the teacher. A pattern of asking for answers is something the teacher can see and address.",
    },
    {
      q: "Does the tutor know what my class is being taught?",
      a: "Yes, when the institution loads its material. The tutor is grounded in the syllabus, course content and question banks the school or college uses, so its explanations line up with the lesson instead of contradicting it. Where it has nothing relevant to draw on, it says so rather than inventing something.",
    },
    {
      q: "Is it for school students or college students?",
      a: "Both, with different vocabulary and different depth. In schools it works at concept level against the class syllabus. In higher education it works at course and competency level, and it can be pointed at the assessments a programme uses. Enterprise learners get the same conversational help against role skills.",
    },
    {
      q: "What happens to the conversations a learner has?",
      a: "They are stored inside that institution's own tenant, attached to the learner's record, and available to the educator responsible for them. They are not pooled across customers. A learner can revisit their own sessions, which is usually the most honest revision material they have.",
    },
  ],
  close: {
    title: "See the tutor answer a question from your own syllabus",
    lede: "Bring a chapter, a course module or a past paper. We would rather show you the tutor working on material you recognise than run a scripted tour.",
    primaryLabel: "Book a Demo",
    secondary: { path: "/platform", label: "Explore the platform" },
  },
  links: [
    { label: "AI", path: "/ai", note: "The AI layer underneath the tutor, the assistant and the analytics." },
    { label: "Learning paths", path: "/learning-paths", note: "The route the tutor sits inside when a learner is working through a gap." },
    { label: "Schools", path: "/schools", note: "The tutor in a school day, alongside teacher and parent views." },
    { label: "Higher Education", path: "/higher-education", note: "The same tutor at course and competency level for colleges." },
    { label: "For students", path: "/students", note: "What a learner actually sees when they log in." },
    { label: "The platform", path: "/platform", note: "Assessment, learning and analytics in one place." },
  ],
});

/* ------------------------------------------------- 2. /ai-for-faculty */

const aiForFaculty = topicPage({
  out: "ai-for-faculty.html",
  canonical: "/ai-for-faculty",
  title: "AI for College Faculty and Teaching Staff | GaugeSkills",
  description:
    "AI that drafts course material, question banks and remediation groups for college faculty. Every output is a draft the faculty member edits and approves.",
  trail: [HIGHER_ED, { name: "AI for faculty", path: "/ai-for-faculty" }],
  intro: {
    eyebrow: "AI for faculty",
    h1: "AI That Gives Faculty Their Week Back",
    lede: "The hours do not go into teaching. They go into building question papers, rewriting last year's slides, chasing attendance and working out who is behind. GaugeSkills drafts that work in minutes and leaves the academic decisions where they belong.",
    primaryLabel: "Request a College Demo",
    secondary: { path: "/higher-education", label: "Higher Education overview" },
  },
  middle: (rel) => [
    section({
      tone: "paper",
      children: `    ${sectionHead({
        eyebrow: "What this actually means",
        title: "A co-pilot for preparation, not a substitute for a lecturer",
        lede: "Nothing here decides what a course should contain or what a student is worth. The AI produces a first draft of the repetitive artefacts around teaching — a question bank, a revision sheet, a set of worked examples, a summary of who is struggling — and the faculty member edits, rejects or approves it before anyone sees it.",
      })}
    <div class="mt-10 grid gap-5 lg:grid-cols-2">
      <div data-reveal class="rounded-card border border-hairline bg-white p-7">
        <p class="text-xs font-semibold uppercase tracking-[0.16em] text-teal">The AI does</p>
        <ul class="mt-4 space-y-2.5 text-[15px] leading-relaxed text-slate-body">
          <li>Drafts material from the syllabus and course content already in use</li>
          <li>Tags every question with the concept and competency it tests</li>
          <li>Summarises assessment results into the groups that need the same help</li>
          <li>Prepares the paperwork around a course rather than the course itself</li>
        </ul>
      </div>
      <div data-reveal style="--reveal-delay: 60ms" class="rounded-card border border-hairline bg-white p-7">
        <p class="text-xs font-semibold uppercase tracking-[0.16em] text-teal">The faculty member decides</p>
        <ul class="mt-4 space-y-2.5 text-[15px] leading-relaxed text-slate-body">
          <li>What the course covers, in what order, at what depth</li>
          <li>Whether a generated question is fair, accurate and worth asking</li>
          <li>What a piece of work is worth, and what feedback a student receives</li>
          <li>Who needs a conversation, and what that conversation is about</li>
        </ul>
      </div>
    </div>
    <p data-reveal class="mt-8 max-w-3xl text-[15px] leading-relaxed text-slate-body">
      Authorship matters in academia, so the platform never publishes an AI draft on a faculty member's behalf.
      <a href="${rel("/ai")}" class="font-semibold text-teal underline-offset-4 hover:underline">Read how the AI layer works</a>.
    </p>`,
    }),
    section({
      tone: "white",
      children: `    ${sectionHead({
        eyebrow: "Where the hours go back",
        title: "Six jobs that stop taking an evening",
      })}
    ${benefitGrid([
      {
        benefit: "Build a question paper in the time it takes to drink a coffee.",
        body: "Questions generated against a unit at the difficulty mix you ask for, each tagged with the concept it tests, so the results are diagnostic instead of just a mark.",
        feature: "AI question banks",
      },
      {
        benefit: "Stop rebuilding the same lecture material every year.",
        body: "Slides, handouts, worked examples and revision sheets drafted from the course outline, then edited into your own voice rather than written from a blank page.",
        feature: "Course content studio",
      },
      {
        benefit: "Know which students share the same gap.",
        body: "Assessment results grouped by the concept that failed, so remediation is one session for nine students rather than nine separate conversations.",
        feature: "Remediation grouping",
      },
      {
        benefit: "Answer the syllabus coverage question without building a report.",
        body: "Planned topics against delivered topics for your courses, kept current as you teach, so the review meeting starts from a fact.",
        feature: "Pacing and coverage",
      },
      {
        benefit: "Give feedback that says more than a number.",
        body: "Draft feedback per student drawn from what they actually got wrong. You edit it, sign it, and it goes out with your name on it because you wrote the final version.",
        feature: "Assisted feedback",
      },
      {
        benefit: "Spend office hours on the students who need them.",
        body: "A weekly view of who is slipping in your courses, so the invitation goes to the student who has gone quiet rather than the one who always turns up.",
        feature: "Course-level alerts",
      },
    ])}`,
    }),
    section({
      tone: "paper",
      children: `    ${sectionHead({
        eyebrow: "A worked example",
        title: "One unit, one week, two versions of the same job",
        lede: "This is a single unit of a single course. Nothing here is automated end to end — each row still finishes with the faculty member approving the work.",
      })}
    <div class="mt-10 grid gap-5 lg:grid-cols-2">
      <div data-reveal class="rounded-card border border-hairline bg-white p-7">
        <h3 class="text-[19px] font-semibold text-ink">How the week usually runs</h3>
        <ol class="mt-5 space-y-4 text-[15px] leading-relaxed text-slate-body">
          <li><span class="font-semibold text-ink">Monday.</span> Rewrite last year's slides because the unit order changed.</li>
          <li><span class="font-semibold text-ink">Tuesday.</span> Write a class test by hand, mostly by adapting old papers.</li>
          <li><span class="font-semibold text-ink">Thursday.</span> Mark, record marks, and form a rough impression of who is behind.</li>
          <li><span class="font-semibold text-ink">Friday.</span> Intend to run a remedial session. Run out of week.</li>
        </ol>
      </div>
      <div data-reveal style="--reveal-delay: 60ms" class="rounded-card border border-teal/30 bg-white p-7 shadow-soft">
        <h3 class="text-[19px] font-semibold text-ink">How it runs with a co-pilot</h3>
        <ol class="mt-5 space-y-4 text-[15px] leading-relaxed text-slate-body">
          <li><span class="font-semibold text-ink">Monday.</span> Slides and a handout come back as drafts against the new unit order. Edit and approve.</li>
          <li><span class="font-semibold text-ink">Tuesday.</span> Review a generated test, drop two questions, change one, publish.</li>
          <li><span class="font-semibold text-ink">Thursday.</span> Results arrive already grouped by the concept that failed.</li>
          <li><span class="font-semibold text-ink">Friday.</span> Run one remedial session for the group that shares the gap.</li>
        </ol>
      </div>
    </div>
    <p data-reveal class="mt-8 max-w-3xl text-[15px] leading-relaxed text-slate-body">
      The point is not speed for its own sake. It is that the remedial session on Friday is the thing that changes a result, and it is the thing that gets cut first when the week is full.
      <a href="${rel("/faculty")}" class="font-semibold text-teal underline-offset-4 hover:underline">See the full faculty workspace</a>.
    </p>`,
    }),
  ],
  faqTitle: "What faculty ask before they try it",
  faqs: [
    {
      q: "Who is the author of AI-generated course material?",
      a: "The faculty member. The platform produces a draft in a workspace only you can see, and nothing reaches a student until you approve it. Most faculty edit heavily on the first few units and less over time as the drafts learn the shape of the course, but the approval step never goes away.",
    },
    {
      q: "Can the AI mark examinations?",
      a: "It can assist with objective questions and it can draft feedback on written work, but it does not award final marks on high-stakes assessments on its own. That is a deliberate boundary. Marking carries academic and regulatory weight, and it stays with the examiner.",
    },
    {
      q: "Will this be used to evaluate faculty performance?",
      a: "Coverage and pacing data exists because departments ask whether a syllabus was delivered, and heads of department can see it. We are direct about that rather than pretending otherwise. What the platform does not do is score teaching quality or rank faculty against each other from usage data.",
    },
    {
      q: "Do I have to move my course into a new system?",
      a: "No. GaugeSkills runs as a complete platform, and it also connects over LTI and SSO, so a department committed to an existing LMS can add the content studio, the question banks and the analytics alongside what it already runs.",
    },
  ],
  close: {
    title: "Bring one unit you are tired of rebuilding",
    lede: "The fastest way to judge this is to watch it draft material for a course you already teach. Pick the unit you like preparing least and we will start there.",
    primaryLabel: "Request a College Demo",
    secondary: { path: "/faculty", label: "See the faculty workspace" },
  },
  links: [
    { label: "For faculty", path: "/faculty", note: "The full faculty view: content studio, exams, attendance and pacing." },
    { label: "AI quiz generator", path: "/ai-quiz-generator", note: "Blueprints, item quality and the review step, in detail." },
    { label: "Learning paths", path: "/learning-paths", note: "What the platform builds for the students a result flags." },
    { label: "Higher Education", path: "/higher-education", note: "How the platform fits a college or university." },
    { label: "AI", path: "/ai", note: "What the AI drafts, and where a person signs off." },
    { label: "The platform", path: "/platform", note: "The assessment, learning and analytics layer underneath." },
  ],
});

/* ---------------------------------- 3. /student-performance-analytics */

const performanceAside = `<div data-rise>
        ${dashboardMock({
          title: "Course analytics — Semester 4, Database Systems",
          stats: [
            { label: "Students", value: "186" },
            { label: "Weak concepts", value: "4" },
            { label: "Avg. mastery", value: "67%" },
          ],
          bars: [
            { label: "Relational modelling", value: "Strong", pct: 82 },
            { label: "Query optimisation", value: "On track", pct: 61 },
            { label: "Transactions and locking", value: "Needs attention", pct: 29 },
          ],
          note: DASHBOARD_NOTE,
        })}
      </div>`;

const studentPerformanceAnalytics = topicPage({
  out: "student-performance-analytics.html",
  canonical: "/student-performance-analytics",
  title: "Student Performance Analytics for Colleges | GaugeSkills",
  description:
    "Student performance analytics for colleges: mastery by concept, participation and trend, shown at student, course and department level while a term is running.",
  trail: [HIGHER_ED, { name: "Student performance analytics", path: "/student-performance-analytics" }],
  intro: {
    eyebrow: "Student performance analytics",
    h1: "See Student Performance While You Can Still Change It",
    lede: "End-of-semester results are a record, not a tool. Performance analytics is the same information arriving in week four, at the level of the concept that broke, for the people who can still do something about it.",
    primaryLabel: "Request a College Demo",
    secondary: { path: "/higher-education", label: "Higher Education overview" },
  },
  aside: performanceAside,
  middle: (rel) => [
    section({
      tone: "white",
      children: `    ${sectionHead({
        eyebrow: "What this actually means",
        title: "Reporting describes the past. Analytics changes the present.",
        lede: "Most institutions already produce reports: marks by course, pass percentages, attendance registers. Those are accurate and they arrive too late to act on. Performance analytics is a working dashboard, refreshed as assessments and attendance land, built so that every number on it points at a next step.",
      })}
    <div class="mt-10 grid gap-5 sm:grid-cols-3">
      <div data-reveal class="rounded-card border border-hairline p-6">
        <p class="font-display text-[15px] font-semibold text-teal">A mark is an outcome</p>
        <p class="mt-2 text-[15px] leading-relaxed text-slate-body">Sixty-one percent tells you the result. It does not say which four questions were missed, or that three of them tested the same concept.</p>
      </div>
      <div data-reveal style="--reveal-delay: 60ms" class="rounded-card border border-hairline p-6">
        <p class="font-display text-[15px] font-semibold text-teal">A concept is a cause</p>
        <p class="mt-2 text-[15px] leading-relaxed text-slate-body">Because every question is tagged with what it tests, a result decomposes into concepts. That is the level at which teaching can respond.</p>
      </div>
      <div data-reveal class="rounded-card border border-hairline p-6">
        <p class="font-display text-[15px] font-semibold text-teal">A trend is a decision</p>
        <p class="mt-2 text-[15px] leading-relaxed text-slate-body">The same concept measured twice shows whether last month's intervention worked. Without the second measurement, nobody knows.</p>
      </div>
    </div>`,
    }),
    section({
      tone: "paper",
      children: `    ${sectionHead({
        eyebrow: "The views",
        title: "The same data, cut for the person looking at it",
        lede: "A student, a lecturer, a head of department and a placement team need four different answers from one set of records. Each role sees the cut that matches what they are responsible for, and nothing beyond it.",
      })}
    ${cardGrid(
      [
        { tag: "Student", title: "My progress", body: "Mastery by concept across current courses, what improved since the last assessment, and the one or two topics to work on next." },
        { tag: "Faculty", title: "This course", body: "Distribution across the class, the concepts the cohort failed together, and the students whose trend is falling rather than flat." },
        { tag: "Head of department", title: "Across courses", body: "Performance by course and by semester, with participation and coverage beside it so a weak result can be read in context." },
        { tag: "Management", title: "Across the institution", body: "Programme-level trend over time, comparable between departments, without waiting for the examination cycle to close." },
        { tag: "Placement", title: "Readiness", body: "Performance mapped to the competencies employers screen for, so a placement conversation starts from evidence rather than a transcript." },
        { tag: "Advisors", title: "My students", body: "A caseload view of assigned students with their current standing, recent movement and the flags raised since the last meeting." },
      ],
      { columns: 3 },
    )}`,
    }),
    section({
      tone: "ink",
      children: `    ${sectionHead({
        eyebrow: "The metrics",
        title: "What each number on the dashboard is made of",
        lede: "A metric nobody can define is a metric nobody trusts. These are the four that carry most of the weight, and what each one is computed from.",
        tone: "dark",
      })}
    <div class="mt-12 grid gap-5 lg:grid-cols-2">
      <div data-reveal class="rounded-card border border-white/10 bg-white/5 p-7">
        <h3 class="text-[17px] font-semibold text-white">Concept mastery</h3>
        <p class="mt-2 text-[15px] leading-relaxed text-mist">The share of questions tagged to a concept that a student answers correctly, across every assessment that touched it. It moves when new evidence arrives, so it is a current position rather than a historical average.</p>
      </div>
      <div data-reveal style="--reveal-delay: 60ms" class="rounded-card border border-white/10 bg-white/5 p-7">
        <h3 class="text-[17px] font-semibold text-white">Participation</h3>
        <p class="mt-2 text-[15px] leading-relaxed text-mist">Assessments attempted against assessments set, and attendance against sessions held. Reported separately from performance, because a student who is absent and a student who is present and struggling need different responses.</p>
      </div>
      <div data-reveal class="rounded-card border border-white/10 bg-white/5 p-7">
        <h3 class="text-[17px] font-semibold text-white">Movement</h3>
        <p class="mt-2 text-[15px] leading-relaxed text-mist">The change in a student's mastery on the same concept between two measurements. This is the number that tells you whether teaching or remediation changed anything, and it is the one most reporting leaves out.</p>
      </div>
      <div data-reveal style="--reveal-delay: 60ms" class="rounded-card border border-white/10 bg-white/5 p-7">
        <h3 class="text-[17px] font-semibold text-white">Cohort spread</h3>
        <p class="mt-2 text-[15px] leading-relaxed text-mist">How wide the distribution is on a concept, not just where the average sits. A course with a healthy mean and a long tail is a different teaching problem from one where everybody is equally adrift.</p>
      </div>
    </div>
    <p data-reveal class="mt-9 max-w-3xl text-[15px] leading-relaxed text-mist">
      Analytics describes what happened and how it is moving. It does not decide who passes, and it does not produce a score for a student that nobody can explain.
      <a href="${rel("/at-risk-students")}" class="font-semibold text-cyan underline-offset-4 hover:underline">How these signals turn into an early flag</a>.
    </p>`,
    }),
  ],
  faqTitle: "What departments ask about the numbers",
  faqs: [
    {
      q: "Where does the data come from?",
      a: "Assessments taken on the platform, attendance, and submissions. Where a college runs an academic ERP, student records, programmes and enrolment sync across so the cohorts match your own structure. We would rather integrate with the system of record than ask a department to key data twice.",
    },
    {
      q: "How is this different from the reports our ERP already produces?",
      a: "An ERP report is usually accurate, periodic and at the level of a mark. This is concept-level, continuous, and built around movement between two measurements. The two are complementary: the ERP remains the record, and the analytics layer is what you look at during the term.",
    },
    {
      q: "Can students see their own analytics?",
      a: "Yes, scoped to themselves. A student sees their own mastery by concept, what has improved and what to work on next. They do not see other students, and they do not see the cohort comparisons a head of department works with.",
    },
    {
      q: "What stops faculty teaching to the dashboard?",
      a: "Nothing technical, and it is a fair concern. The mitigation is that mastery is computed from concept-tagged questions across many assessments rather than from one weighted exam, so narrowing teaching to the metric means teaching the concepts. Where a metric could be gamed cheaply, we would rather not display it.",
    },
  ],
  close: {
    title: "Look at a real cohort, not a sample one",
    lede: "Bring one programme and one semester. We will walk through what the dashboard would show for it and what a department would do differently on the strength of it.",
    primaryLabel: "Request a College Demo",
    secondary: { path: "/leadership", label: "The leadership view" },
  },
  links: [
    { label: "Higher Education", path: "/higher-education", note: "The full picture for colleges and universities." },
    { label: "At-risk students", path: "/at-risk-students", note: "Turning these signals into an early flag and an intervention." },
    { label: "AI quiz generator", path: "/ai-quiz-generator", note: "The concept tagging that makes a result readable in the first place." },
    { label: "AI", path: "/ai", note: "Asking the data a question in plain language." },
    { label: "For leadership", path: "/leadership", note: "Coverage, faculty workload and institution-wide trend." },
  ],
});

/* ----------------------------------------------- 4. /at-risk-students */

const atRiskStudents = topicPage({
  out: "at-risk-students.html",
  canonical: "/at-risk-students",
  title: "Identify At-Risk Students Early | GaugeSkills",
  description:
    "Identify at-risk students early using attendance, assessment and engagement signals together, then route each flag to a named person and re-measure after.",
  trail: [HIGHER_ED, { name: "At-risk students", path: "/at-risk-students" }],
  intro: {
    eyebrow: "At-risk students",
    h1: "Find At-Risk Students in Week 3, Not Week 15",
    lede: "By the time a student fails, everyone can see it. The information existed weeks earlier — a fortnight of missed classes, two skipped submissions, a mark that slid. It was just sitting in four systems that never spoke to each other.",
    primaryLabel: "Request a College Demo",
    secondary: { path: "/higher-education", label: "Higher Education overview" },
  },
  middle: (rel) => [
    section({
      tone: "white",
      children: `    ${sectionHead({
        eyebrow: "What this actually means",
        title: "At risk is a definition you choose, not a verdict the software issues",
        lede: "No single signal identifies a struggling student. Attendance alone flags the commuter. Marks alone flag the student who had one bad week. Early identification is what happens when the signals are read together, against a threshold the institution sets and can change.",
      })}
    <div class="mt-10 space-y-4">
      <div data-reveal class="rounded-card border border-hairline bg-paper p-6">
        <p class="text-[15px] leading-relaxed text-slate-body"><span class="font-semibold text-ink">You set the rule.</span> A department decides what counts: how many missed sessions, how far a mark has to fall, how many submissions can slip. The thresholds are visible and adjustable, not buried in a model nobody can inspect.</p>
      </div>
      <div data-reveal class="rounded-card border border-hairline bg-paper p-6">
        <p class="text-[15px] leading-relaxed text-slate-body"><span class="font-semibold text-ink">The flag is a prompt, not a label.</span> Nothing is written on a student's record. A flag reaches an advisor as a suggestion that a conversation is due, and the advisor is the one who decides whether it is warranted.</p>
      </div>
      <div data-reveal class="rounded-card border border-hairline bg-paper p-6">
        <p class="text-[15px] leading-relaxed text-slate-body"><span class="font-semibold text-ink">A flag with no owner is noise.</span> Every raised flag goes to a named person with a suggested action. An alert that lands in a shared inbox is a report, and reports do not change outcomes.</p>
      </div>
    </div>`,
    }),
    section({
      tone: "paper",
      children: `    ${sectionHead({
        eyebrow: "The signals",
        title: "Five things that show up before a result does",
        lede: "Each of these is weak on its own and meaningful in combination. The platform watches them together and only raises a flag when the combination crosses the threshold the institution set.",
      })}
    ${cardGrid(
      [
        { tag: "Signal 01", title: "Attendance that changes shape", body: "Not the absolute figure, but the break in pattern: a student who attended everything and then stopped attending Tuesdays. The change is the signal." },
        { tag: "Signal 02", title: "A falling trend, not a low mark", body: "A consistent 55 is a known quantity. A student moving from 78 to 61 to 52 across three assessments is a different situation and deserves a different response." },
        { tag: "Signal 03", title: "Submissions quietly skipped", body: "Missed and late submissions usually precede a bad result by weeks, and they rarely reach anyone who could intervene until marks are collated." },
        { tag: "Signal 04", title: "A gap that compounds", body: "A concept that never got fixed and is now a prerequisite for the current unit. This student is not lazy; they are building on something that was never solid." },
        { tag: "Signal 05", title: "Disengagement from practice", body: "A student who stops opening material, stops attempting practice and stops asking the tutor anything has usually decided something before anyone has noticed." },
      ],
      { columns: 3 },
    )}`,
    }),
    section({
      tone: "white",
      children: `    ${sectionHead({
        eyebrow: "A worked example",
        title: "What actually happens after a flag is raised",
        lede: "Identification is the easy half. The reason early-warning projects fail is that nobody defined what happens next, so the list gets produced, circulated and ignored. This is the loop the platform is built around.",
      })}
    <ol class="mt-12 grid gap-5 lg:grid-cols-4">
      <li data-reveal class="rounded-card border border-hairline bg-paper p-6">
        <span aria-hidden="true" class="grid h-9 w-9 place-items-center rounded-full bg-teal text-[13px] font-bold text-white">1</span>
        <h3 class="mt-4 text-[17px] font-semibold text-ink">The flag is raised</h3>
        <p class="mt-2 text-[15px] leading-relaxed text-slate-body">Signals cross the department's threshold in week three. The flag lists what triggered it, so the advisor knows the reason before they open the file.</p>
      </li>
      <li data-reveal style="--reveal-delay: 60ms" class="rounded-card border border-hairline bg-paper p-6">
        <span aria-hidden="true" class="grid h-9 w-9 place-items-center rounded-full bg-teal text-[13px] font-bold text-white">2</span>
        <h3 class="mt-4 text-[17px] font-semibold text-ink">A person looks at it</h3>
        <p class="mt-2 text-[15px] leading-relaxed text-slate-body">The advisor or mentor confirms, dismisses or escalates. Dismissals are recorded too, which is how the thresholds get better over a couple of terms.</p>
      </li>
      <li data-reveal class="rounded-card border border-hairline bg-paper p-6">
        <span aria-hidden="true" class="grid h-9 w-9 place-items-center rounded-full bg-teal text-[13px] font-bold text-white">3</span>
        <h3 class="mt-4 text-[17px] font-semibold text-ink">Something specific happens</h3>
        <p class="mt-2 text-[15px] leading-relaxed text-slate-body">A remedial path on the concept that broke, a mentor meeting, or a referral. The action is attached to the flag rather than remembered by whoever made it.</p>
      </li>
      <li data-reveal style="--reveal-delay: 60ms" class="rounded-card border border-hairline bg-paper p-6">
        <span aria-hidden="true" class="grid h-9 w-9 place-items-center rounded-full bg-teal text-[13px] font-bold text-white">4</span>
        <h3 class="mt-4 text-[17px] font-semibold text-ink">It is measured again</h3>
        <p class="mt-2 text-[15px] leading-relaxed text-slate-body">The same concept is re-assessed after the intervention. Either the student moved or they did not, and the second number is what tells you which.</p>
      </li>
    </ol>
    <p data-reveal class="mt-9 max-w-3xl text-[15px] leading-relaxed text-slate-body">
      Step four is the one institutions skip, and it is the one that turns an early-warning list into a practice.
      <a href="${rel("/student-performance-analytics")}" class="font-semibold text-teal underline-offset-4 hover:underline">See the metrics these flags are built from</a>.
    </p>`,
    }),
  ],
  faqTitle: "What student support teams ask",
  faqs: [
    {
      q: "Is this a prediction about whether a student will fail?",
      a: "No, and we are careful about that distinction. The platform surfaces students whose observable signals have crossed a threshold the institution defined. It does not assign a probability of failure or a risk score that follows a student around. The judgement about what the signals mean stays with the advisor.",
    },
    {
      q: "Does a student know they have been flagged?",
      a: "That is the institution's policy, not a platform default. Many colleges prefer the flag to stay with the advisor and the conversation to happen without the label, and the system supports that. Whichever way a college chooses, flags are visible to the staff responsible for the student, not to their peers.",
    },
    {
      q: "How do we avoid flagging half the cohort in week two?",
      a: "By starting with conservative thresholds and tuning them. Most departments begin with a narrow definition so the first list is small enough to act on, then widen it once the loop is working. Dismissed flags are recorded, which gives you the evidence to adjust rather than guess.",
    },
    {
      q: "What if attendance is recorded outside the platform?",
      a: "It usually is. Attendance, enrolment and programme structure sync from the academic ERP, so the signals combine without anyone re-entering data. Where a college has no ERP feed, attendance can be captured on the platform directly.",
    },
  ],
  close: {
    title: "Define at risk for one department and see who appears",
    lede: "Pick a programme, tell us what your team already counts as a warning sign, and we will show you what the flag list would look like and who it would go to.",
    primaryLabel: "Request a College Demo",
    secondary: { path: "/student-performance-analytics", label: "See the analytics behind it" },
  },
  links: [
    { label: "Higher Education", path: "/higher-education", note: "How the platform fits a college or university." },
    { label: "Student performance analytics", path: "/student-performance-analytics", note: "The dashboard and the metrics these flags are drawn from." },
    { label: "Learning paths", path: "/learning-paths", note: "The remediation a confirmed flag turns into." },
    { label: "For leadership", path: "/leadership", note: "Programme-level trend, coverage and where support is working." },
    { label: "The platform", path: "/platform", note: "Assessment, learning and analytics in one system." },
  ],
  linksHeading: "Related",
});

/* ---------------------------------------- 5. /employee-skill-assessment */

const employeeSkillAssessment = topicPage({
  out: "employee-skill-assessment.html",
  canonical: "/employee-skill-assessment",
  title: "Employee Skill Assessment Software | GaugeSkills",
  description:
    "Employee skill assessment that establishes a level from demonstrated evidence rather than self-report, and re-measures it as people learn and roles change.",
  trail: [ENTERPRISE, { name: "Employee skill assessment", path: "/employee-skill-assessment" }],
  intro: {
    eyebrow: "Employee skill assessment",
    h1: "Measure What Your Employees Can Actually Do",
    lede: "Most skills data inside an organization is a survey: people rated themselves, a manager nodded, and a spreadsheet was born. Assessment replaces the opinion with evidence, so the level on a person's profile is something they demonstrated.",
    primaryLabel: "Talk to Our Enterprise Team",
    secondary: { path: "/enterprise", label: "Enterprise overview" },
  },
  middle: (rel) => [
    section({
      tone: "white",
      children: `    ${sectionHead({
        eyebrow: "What this actually means",
        title: "Establishing a level, not producing a score",
        lede: "A skill assessment answers one narrow question: at what level can this person perform this skill today. Not how they feel about it, not how long they have been in the job, and not whether they finished a course about it two years ago.",
      })}
    <div class="mt-10 rounded-card border border-hairline bg-paper p-7 md:p-9">
      <p class="text-xs font-semibold uppercase tracking-[0.16em] text-teal">The scale</p>
      <dl class="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <dt class="text-[15px] font-semibold text-ink">Level 1 — Aware</dt>
          <dd class="mt-1 text-[15px] leading-relaxed text-slate-body">Knows the concepts and vocabulary. Cannot yet produce work in this skill.</dd>
        </div>
        <div>
          <dt class="text-[15px] font-semibold text-ink">Level 2 — Assisted</dt>
          <dd class="mt-1 text-[15px] leading-relaxed text-slate-body">Completes routine tasks with guidance and review.</dd>
        </div>
        <div>
          <dt class="text-[15px] font-semibold text-ink">Level 3 — Independent</dt>
          <dd class="mt-1 text-[15px] leading-relaxed text-slate-body">Handles normal work in this skill without supervision.</dd>
        </div>
        <div>
          <dt class="text-[15px] font-semibold text-ink">Level 4 — Advanced</dt>
          <dd class="mt-1 text-[15px] leading-relaxed text-slate-body">Handles non-standard and ambiguous cases, and reviews others' work.</dd>
        </div>
        <div>
          <dt class="text-[15px] font-semibold text-ink">Level 5 — Expert</dt>
          <dd class="mt-1 text-[15px] leading-relaxed text-slate-body">Sets the standard for the skill and develops other people in it.</dd>
        </div>
        <div>
          <dt class="text-[15px] font-semibold text-ink">The definitions are yours</dt>
          <dd class="mt-1 text-[15px] leading-relaxed text-slate-body">This is a sensible default. Organizations that already run a competency framework keep their own wording and their own number of levels.</dd>
        </div>
      </dl>
    </div>`,
    }),
    section({
      tone: "paper",
      children: `    ${sectionHead({
        eyebrow: "What it gives you",
        title: "An inventory you can make decisions from",
      })}
    ${benefitGrid([
      {
        benefit: "Stop planning against a skills list nobody believes.",
        body: "Levels come from demonstrated evidence, so a workforce view is something a leadership team can plan against rather than politely ignore.",
        feature: "Evidence-based levels",
      },
      {
        benefit: "Find the capability you already paid for.",
        body: "People routinely hold skills their current role does not use. An inventory built from assessment surfaces them before a role goes out to the market.",
        feature: "Skills inventory",
      },
      {
        benefit: "Compare like with like across teams.",
        body: "One scale, one set of level definitions, one method. Level 3 means the same thing in two departments, which is what makes any comparison honest.",
        feature: "Common framework",
      },
      {
        benefit: "Watch a level move rather than assume it did.",
        body: "Re-assessment after learning gives a second measurement on the same skill, so capability change is observed instead of inferred from course completions.",
        feature: "Re-assessment",
      },
      {
        benefit: "Keep the measurement short enough that people finish it.",
        body: "Assessments are scoped to one skill at a time and mixed in format, so measuring a role's skill set is a series of short sittings rather than an exam day.",
        feature: "Scoped assessments",
      },
      {
        benefit: "Give the employee something worth having.",
        body: "Each person gets their own profile: where they stand, what evidence supports it, and what the next level would require of them.",
        feature: "Employee skill profile",
      },
    ])}`,
    }),
    section({
      tone: "white",
      children: `    ${sectionHead({
        eyebrow: "A worked example",
        title: "How one level gets established",
        lede: "Take a single skill — query optimisation — for a single person. Four steps, and the fourth is the one that stops a skills inventory going stale.",
      })}
    <div class="mt-12 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <ol class="space-y-5">
        <li data-reveal class="rounded-card border border-hairline bg-paper p-6">
          <h3 class="text-[17px] font-semibold text-ink">1. Define what each level looks like</h3>
          <p class="mt-2 text-[15px] leading-relaxed text-slate-body">Before anyone is measured, the skill is described at every level in observable terms. If two reviewers would disagree about what Level 3 means, the definition is not finished.</p>
        </li>
        <li data-reveal style="--reveal-delay: 60ms" class="rounded-card border border-hairline bg-paper p-6">
          <h3 class="text-[17px] font-semibold text-ink">2. Gather more than one kind of evidence</h3>
          <p class="mt-2 text-[15px] leading-relaxed text-slate-body">A knowledge check, an applied task, and a scenario that has no clean answer. Three formats, because any single format measures itself as much as it measures the skill.</p>
        </li>
        <li data-reveal class="rounded-card border border-hairline bg-paper p-6">
          <h3 class="text-[17px] font-semibold text-ink">3. Place the level, and say how sure you are</h3>
          <p class="mt-2 text-[15px] leading-relaxed text-slate-body">The level is placed against the definitions, with a confidence that reflects how much evidence sits behind it. Thin evidence produces a level marked as provisional, not a level presented as fact.</p>
        </li>
        <li data-reveal style="--reveal-delay: 60ms" class="rounded-card border border-hairline bg-paper p-6">
          <h3 class="text-[17px] font-semibold text-ink">4. Give it an expiry</h3>
          <p class="mt-2 text-[15px] leading-relaxed text-slate-body">Skills decay and tools change. A level carries the date it was established and a review interval, so a three-year-old measurement is never quietly presented as a current one.</p>
        </li>
      </ol>
      <div data-reveal class="rounded-card border border-hairline bg-white p-7 shadow-soft">
        <p class="text-xs font-semibold uppercase tracking-[0.16em] text-teal">Skill record</p>
        <h3 class="mt-4 text-[19px] font-semibold text-ink">Query optimisation</h3>
        <dl class="mt-5 space-y-4 text-[15px]">
          <div class="flex items-baseline justify-between gap-4">
            <dt class="text-slate-body">Level established</dt>
            <dd class="font-semibold text-ink">3 of 5 — Independent</dd>
          </div>
          <div class="flex items-baseline justify-between gap-4">
            <dt class="text-slate-body">Evidence</dt>
            <dd class="font-semibold text-ink">Knowledge, applied, scenario</dd>
          </div>
          <div class="flex items-baseline justify-between gap-4">
            <dt class="text-slate-body">Confidence</dt>
            <dd class="font-semibold text-ink">High</dd>
          </div>
          <div class="flex items-baseline justify-between gap-4">
            <dt class="text-slate-body">Next review</dt>
            <dd class="font-semibold text-ink">In 12 months</dd>
          </div>
        </dl>
        <p class="mt-6 border-t border-hairline pt-4 text-[13px] leading-relaxed text-slate-body">${INTERFACE_NOTE}</p>
      </div>
    </div>
    <p data-reveal class="mt-9 max-w-3xl text-[15px] leading-relaxed text-slate-body">
      A measured level is only half the story. What you do with it starts with comparing it against what a role requires.
      <a href="${rel("/skills-gap-analysis")}" class="font-semibold text-teal underline-offset-4 hover:underline">See how a gap is computed</a>.
    </p>`,
    }),
  ],
  faqTitle: "What HR and L&amp;D ask first",
  faqs: [
    {
      q: "Is this used in performance reviews or promotion decisions?",
      a: "That is your call, and we would urge caution. A skill level describes capability on one skill at one point in time; it says nothing about contribution, judgement or how someone works with others. The platform gives managers the measurement. It does not rank people and it does not make personnel decisions.",
    },
    {
      q: "How long does assessing one skill take?",
      a: "Assessments are scoped to a single skill and usually sit in the range of a short sitting rather than an examination. Measuring an entire role's skill set is spread across several sittings, because a four-hour assessment day produces fatigue data as much as skills data.",
    },
    {
      q: "Can managers override an assessed level?",
      a: "A manager can add their own validation, and it is recorded as a separate, attributed piece of evidence rather than silently replacing the assessed result. Where the two disagree, that disagreement is visible, which is usually more useful than either number on its own.",
    },
    {
      q: "What about skills that cannot be tested with questions?",
      a: "Plenty cannot. For those, evidence is a submitted work product, a structured scenario, or a manager validation against the level definitions. We would rather record a level as provisional and say what it rests on than pretend a multiple-choice test measured collaboration.",
    },
  ],
  close: {
    title: "Start with one role and one set of skills",
    lede: "Pick a role you are hiring for or restructuring. We will show you how its skills would be defined, measured and recorded, and what the first inventory would tell you.",
    primaryLabel: "Talk to Our Enterprise Team",
    secondary: { path: "/skills", label: "How skills are modelled" },
  },
  links: [
    { label: "Skills", path: "/skills", note: "How a skill is defined, measured and kept current." },
    { label: "Competency management", path: "/competency-management", note: "The definitions and level criteria an assessment is placed against." },
    { label: "Enterprise", path: "/enterprise", note: "The full workforce picture: inventory, gaps and readiness." },
    { label: "Skills gap analysis", path: "/skills-gap-analysis", note: "What happens once a level exists and a role standard exists." },
    { label: "Workforce analytics", path: "/workforce-analytics", note: "What a few hundred measured levels add up to." },
    { label: "The platform", path: "/platform", note: "Assessment, learning and analytics in one system." },
  ],
});

/* ------------------------------------------- 6. /skills-gap-analysis */

const gapAside = `<div data-rise>
        ${dashboardMock({
          title: "Gap analysis — Data Engineering, 48 people",
          stats: [
            { label: "Skills in role", value: "14" },
            { label: "Critical gaps", value: "3" },
            { label: "Role ready", value: "58%" },
          ],
          bars: [
            { label: "Pipeline orchestration", value: "Gap: 2 levels", pct: 34 },
            { label: "Data modelling", value: "Gap: 1 level", pct: 66 },
            { label: "SQL performance", value: "Meets requirement", pct: 91 },
          ],
          note: DASHBOARD_NOTE,
        })}
      </div>`;

const skillsGapAnalysis = topicPage({
  out: "skills-gap-analysis.html",
  canonical: "/skills-gap-analysis",
  title: "Skills Gap Analysis for Workforce Planning | GaugeSkills",
  description:
    "Skills gap analysis that compares the level a role requires with the level your people demonstrate, then ranks each gap by size, criticality and headcount.",
  trail: [SKILLS, { name: "Skills gap analysis", path: "/skills-gap-analysis" }],
  intro: {
    eyebrow: "Skills gap analysis",
    h1: "Know the Distance Between the Skills You Have and the Skills You Need",
    lede: "A skills gap is a subtraction, and the arithmetic is the easy part. The work is in defining the standard a role requires, measuring what people can demonstrate against it, and then deciding which of the resulting gaps is worth money.",
    primaryLabel: "Book a Demo",
    secondary: { path: "/skills", label: "How skills are modelled" },
  },
  aside: gapAside,
  middle: (rel) => [
    section({
      tone: "white",
      children: `    ${sectionHead({
        eyebrow: "What this actually means",
        title: "Required level minus measured level, done properly",
        lede: "The method has four inputs, and the analysis is only as good as the weakest of them. Most gap exercises fail on the first input: nobody wrote down what the role actually requires, so the comparison had nothing to compare against.",
      })}
    ${cardGrid(
      [
        { tag: "Input 01", title: "The role standard", body: "Which skills the role needs and at what level. Defined once per role, reviewed as the work changes, and written in observable terms so two managers would place the same bar." },
        { tag: "Input 02", title: "The measured level", body: "Where each person currently stands on those skills, established from assessment evidence rather than a self-rating on a form." },
        { tag: "Input 03", title: "The gap size", body: "The difference between the two, per skill, per person. A one-level gap and a three-level gap are different problems and should never be reported as the same red cell." },
        { tag: "Input 04", title: "The population", body: "How many people share the gap. One person two levels short is a coaching conversation. Forty people one level short is a capability programme." },
        { tag: "Input 05", title: "Criticality", body: "How much the work depends on the skill. A gap in a skill nobody uses this year is not urgent, however large it looks on a heat map." },
        { tag: "Input 06", title: "The horizon", body: "Whether the requirement is current or arrives with next year's plan. A gap against a future standard is a hiring and development decision, not a performance issue." },
      ],
      { columns: 3 },
    )}`,
    }),
    section({
      tone: "ink",
      children: `    ${sectionHead({
        eyebrow: "The method",
        title: "How a gap becomes a priority",
        lede: "Every gap on a heat map looks equally alarming, which is why heat maps rarely change budgets. Ranking needs the three factors below applied in order, and the result is a short list instead of a wall of red.",
        tone: "dark",
      })}
    <div class="mt-12 grid gap-5 lg:grid-cols-3">
      <div data-reveal class="rounded-card border border-white/10 bg-white/5 p-7">
        <p class="text-xs font-semibold uppercase tracking-[0.16em] text-cyan">Step one</p>
        <h3 class="mt-3 text-[17px] font-semibold text-white">Compute the gap per person</h3>
        <p class="mt-2 text-[15px] leading-relaxed text-mist">For each skill in the role standard, subtract the measured level from the required level. Negative results are not gaps; they are capability the role does not currently use, and they belong in the mobility conversation.</p>
      </div>
      <div data-reveal style="--reveal-delay: 60ms" class="rounded-card border border-white/10 bg-white/5 p-7">
        <p class="text-xs font-semibold uppercase tracking-[0.16em] text-cyan">Step two</p>
        <h3 class="mt-3 text-[17px] font-semibold text-white">Roll it up by skill</h3>
        <p class="mt-2 text-[15px] leading-relaxed text-mist">Aggregate across the population so you see how many people are short and by how much. This is where an individual development issue separates cleanly from an organizational capability issue.</p>
      </div>
      <div data-reveal class="rounded-card border border-white/10 bg-white/5 p-7">
        <p class="text-xs font-semibold uppercase tracking-[0.16em] text-cyan">Step three</p>
        <h3 class="mt-3 text-[17px] font-semibold text-white">Weight by criticality and horizon</h3>
        <p class="mt-2 text-[15px] leading-relaxed text-mist">A large gap in a peripheral skill ranks below a small gap in a skill the next twelve months depend on. Criticality is set by the business, not derived from the data.</p>
      </div>
    </div>
    <div data-reveal class="mt-8 rounded-card border border-white/10 bg-white/5 p-7">
      <p class="text-xs font-semibold uppercase tracking-[0.16em] text-cyan">Worked through, for one skill</p>
      <ul class="mt-5 space-y-3 text-[15px] leading-relaxed text-mist">
        <li><span class="font-semibold text-white">Standard.</span> Pipeline orchestration, Level 4, marked critical for the coming year.</li>
        <li><span class="font-semibold text-white">Measured.</span> Across the team, most people sit at Level 2, a few at Level 3.</li>
        <li><span class="font-semibold text-white">Gap.</span> Predominantly two levels, held by most of the population, in a skill the plan depends on.</li>
        <li><span class="font-semibold text-white">Conclusion.</span> This is a programme with a hiring component, not a course. A one-level gap in a peripheral skill elsewhere can wait.</li>
      </ul>
      <p class="mt-5 border-t border-white/10 pt-4 text-[13px] text-mist">Illustrative example. Not customer data.</p>
    </div>
    <p data-reveal class="mt-9 max-w-3xl text-[15px] leading-relaxed text-mist">
      The analysis ends with a ranked list. What you do with each item splits two ways: deepen the skill where the person stays,
      or move the person somewhere their profile fits better.
      <a href="${rel("/upskilling")}" class="font-semibold text-cyan underline-offset-4 hover:underline">Upskilling</a>
      and
      <a href="${rel("/reskilling")}" class="font-semibold text-cyan underline-offset-4 hover:underline">reskilling</a>
      are the two answers.
    </p>`,
    }),
    section({
      tone: "paper",
      children: `    ${sectionHead({
        eyebrow: "What it is for",
        title: "The decisions a ranked gap list actually supports",
      })}
    ${benefitGrid(
      [
        {
          benefit: "Spend the training budget on the gap that matters.",
          body: "A ranked list makes the case for funding one programme and deferring another, in language a finance conversation can use.",
          feature: "Prioritised investment",
        },
        {
          benefit: "Know whether to build or to hire.",
          body: "A two-level gap held by most of a team is rarely closed by training alone. The size and spread of a gap is what tells you which lever to pull.",
          feature: "Build-versus-buy input",
        },
        {
          benefit: "See the gap before the project does.",
          body: "Running the analysis against next year's required standard rather than today's turns a staffing surprise into a plan with months in hand.",
          feature: "Forward-looking standards",
        },
        {
          benefit: "Give every manager the same picture of their team.",
          body: "The same method applied consistently, so a department head and a business unit leader are looking at comparable numbers rather than two spreadsheets.",
          feature: "Consistent rollup",
        },
      ],
      { columns: 2 },
    )}`,
    }),
  ],
  faqTitle: "Questions about the method",
  faqs: [
    {
      q: "Where does the required level for a role come from?",
      a: "From you. The platform provides starting role standards and drafts skill definitions to react to, but the bar for a role in your organization is a business judgement. Most teams start by having two or three managers place the levels independently and reconciling where they disagree, which surfaces a lot on its own.",
    },
    {
      q: "How is this different from a training needs survey?",
      a: "A survey asks people what training they would like. A gap analysis compares a defined standard against measured capability and produces a ranked list of differences. The survey tells you about appetite, which is useful; only the analysis tells you about distance.",
    },
    {
      q: "How often should the analysis be re-run?",
      a: "The gap moves when either side of the subtraction moves, so it recalculates continuously as people are re-assessed and standards are edited. The useful cadence for reviewing it is usually planning-linked: once a quarter for progress, and whenever a role standard or a business plan changes materially.",
    },
    {
      q: "What if we have not defined our roles yet?",
      a: "That is the normal starting point, and it is why most engagements begin with one job family rather than the whole organization. Defining a handful of roles properly produces a usable analysis in weeks. Attempting all of them at once produces a taxonomy project that never ships.",
    },
  ],
  close: {
    title: "Run the analysis on one job family",
    lede: "Bring one role with a headcount behind it. We will show you what defining the standard involves, how the levels get measured, and what the ranked gap list looks like at the end.",
    primaryLabel: "Book a Demo",
    secondary: { path: "/enterprise", label: "Enterprise overview" },
  },
  links: [
    { label: "Skills", path: "/skills", note: "How skills, levels and role standards are modelled." },
    { label: "Enterprise", path: "/enterprise", note: "Workforce inventory, readiness and planning." },
    { label: "Upskilling", path: "/upskilling", note: "Closing a gap where the person stays in their role." },
    { label: "Reskilling", path: "/reskilling", note: "Closing the distance to a different role entirely." },
    { label: "Employee skill assessment", path: "/employee-skill-assessment", note: "How the measured level in the subtraction is established." },
    { label: "Workforce analytics", path: "/workforce-analytics", note: "Reading a few hundred gaps as one capability picture." },
  ],
});

/* -------------------------------------------------- 7. /upskilling */

const upskilling = topicPage({
  out: "upskilling.html",
  canonical: "/upskilling",
  title: "Employee Upskilling Platform | GaugeSkills",
  description:
    "Employee upskilling that starts from a measured gap in a person's current role, targets only what is missing, and re-assesses to show what actually changed.",
  trail: [ENTERPRISE, { name: "Upskilling", path: "/upskilling" }],
  intro: {
    eyebrow: "Upskilling",
    h1: "Upskilling That Starts From a Measured Gap",
    lede: "Enrolling everyone in the same course is not a development plan. Upskilling works when a person is measured, the specific distance between them and their role is known, and the learning is aimed at that distance and nothing else.",
    primaryLabel: "Talk to Our Enterprise Team",
    secondary: { path: "/enterprise", label: "Enterprise overview" },
  },
  middle: (rel) => [
    section({
      tone: "white",
      children: `    ${sectionHead({
        eyebrow: "What this actually means",
        title: "Going deeper in the job you already have",
        lede: "Upskilling raises a person's level on skills their current role already uses. The job title does not change; what changes is what they can handle inside it — the Level 2 analyst who can now do the Level 4 work, and stops escalating it.",
      })}
    <div class="mt-10 grid gap-5 lg:grid-cols-3">
      <div data-reveal class="rounded-card border border-hairline bg-paper p-6">
        <p class="font-display text-[15px] font-semibold text-teal">The role stays</p>
        <p class="mt-2 text-[15px] leading-relaxed text-slate-body">The person keeps their job, their team and their manager. If the destination is a different role, that is a different problem — see <a href="${rel("/reskilling")}" class="font-semibold text-teal underline-offset-4 hover:underline">reskilling</a>.</p>
      </div>
      <div data-reveal style="--reveal-delay: 60ms" class="rounded-card border border-hairline bg-paper p-6">
        <p class="font-display text-[15px] font-semibold text-teal">The gap sets the scope</p>
        <p class="mt-2 text-[15px] leading-relaxed text-slate-body">Learning is assigned against the skills where a measured level sits below the required one. Skills already at level are left alone, which is most of the time saved.</p>
      </div>
      <div data-reveal class="rounded-card border border-hairline bg-paper p-6">
        <p class="font-display text-[15px] font-semibold text-teal">The proof is a second measurement</p>
        <p class="mt-2 text-[15px] leading-relaxed text-slate-body">Completion is not evidence. Re-assessing the same skill after the path is the only thing that shows whether the level moved.</p>
      </div>
    </div>`,
    }),
    section({
      tone: "paper",
      children: `    ${sectionHead({
        eyebrow: "What changes",
        title: "Development that is specific to the person doing it",
      })}
    ${benefitGrid([
      {
        benefit: "Stop paying for training people did not need.",
        body: "A path contains the modules that close a measured gap and skips the ones covering skills the person has already demonstrated. Shorter paths finish more often.",
        feature: "Gap-driven paths",
      },
      {
        benefit: "Give a manager something better than a course catalogue.",
        body: "Each team member arrives with a measured profile and a suggested path, so a development conversation starts from evidence instead of good intentions.",
        feature: "Team development view",
      },
      {
        benefit: "Help at the moment someone is stuck, not at the next session.",
        body: "An AI tutor sits inside the path to explain the difficult part again. It supports the learner between sessions; it does not replace the coach or the manager.",
        feature: "In-path AI support",
      },
      {
        benefit: "Report capability change instead of completion rates.",
        body: "Re-assessment produces a before and an after on the same skill, so the report to leadership is a movement in level rather than an attendance figure.",
        feature: "Before-and-after measurement",
      },
      {
        benefit: "Let people build the skill their next level needs.",
        body: "Each profile shows what the next level would require, so someone can work towards it deliberately rather than waiting to be nominated for something.",
        feature: "Transparent level criteria",
      },
    ])}`,
    }),
    section({
      tone: "ink",
      children: `    ${sectionHead({
        eyebrow: "The loop",
        title: "Six steps, and the last one is the one that counts",
        lede: "This is the cycle the whole platform is built on. Upskilling is the version of it pointed at a person's current role, and it only works as a loop — a path with no second measurement at the end is a catalogue with extra steps.",
        tone: "dark",
      })}
    ${lifecycleFlow({ tone: "dark" })}
    <div class="mt-12 grid gap-5 lg:grid-cols-2">
      <div data-reveal class="rounded-card border border-white/10 bg-white/5 p-7">
        <h3 class="text-[17px] font-semibold text-white">What the organization gets</h3>
        <p class="mt-2 text-[15px] leading-relaxed text-mist">A defensible answer to whether the learning spend changed anything, expressed as levels that moved on skills the business said were critical.</p>
      </div>
      <div data-reveal style="--reveal-delay: 60ms" class="rounded-card border border-white/10 bg-white/5 p-7">
        <h3 class="text-[17px] font-semibold text-white">What the employee gets</h3>
        <p class="mt-2 text-[15px] leading-relaxed text-mist">A record of capability that belongs to them and travels with them internally, rather than a folder of certificates nobody reads.</p>
      </div>
    </div>`,
    }),
  ],
  faqTitle: "What L&amp;D teams ask about upskilling",
  faqs: [
    {
      q: "Do we have to abandon the content library we already licence?",
      a: "No. Paths are assembled from whatever content you have, including your existing library and your internal material, with generated content filling the gaps nothing covers. The value here is the targeting and the measurement around the content, not the content itself.",
    },
    {
      q: "What do we do about people who never finish a path?",
      a: "First, look at length. Gap-scoped paths are shorter than catalogue courses and that alone changes completion behaviour. Beyond that, the manager sees where their team stands, and a path that stalls mid-way is visible as a stalled development commitment rather than an anonymous statistic.",
    },
    {
      q: "How soon should someone be re-assessed?",
      a: "Far enough after the path that new capability has been used in real work, rather than the day after the last module while recall is doing the heavy lifting. A gap of several weeks is usual, and the review date is set on the skill record when the path is assigned.",
    },
    {
      q: "Is upskilling only for technical skills?",
      a: "No, though technical skills are the easiest to measure. For skills like facilitation or stakeholder management, evidence is a structured scenario, a work product or a manager validation against the level definitions. The method is the same; only the form of the evidence changes.",
    },
  ],
  close: {
    title: "Pick one team and close one gap properly",
    lede: "One team, one critical skill, measured before and after. It is a small enough scope to run quickly and a real enough result to decide on.",
    primaryLabel: "Talk to Our Enterprise Team",
    secondary: { path: "/skills-gap-analysis", label: "Start with the gap analysis" },
  },
  links: [
    { label: "Skills gap analysis", path: "/skills-gap-analysis", note: "Where the gap that scopes a path comes from." },
    { label: "Learning paths", path: "/learning-paths", note: "How the path itself is assembled, sequenced and adapted." },
    { label: "Enterprise", path: "/enterprise", note: "The full workforce view for HR, L&D and leadership." },
    { label: "Reskilling", path: "/reskilling", note: "When the answer is a different role rather than a deeper one." },
    { label: "Workforce analytics", path: "/workforce-analytics", note: "Showing that the levels actually moved afterwards." },
    { label: "Skills", path: "/skills", note: "How levels, standards and evidence are modelled." },
  ],
});

/* -------------------------------------------------- 8. /reskilling */

const reskillingAside = `<div data-rise>
        ${dashboardMock({
          title: "Role transition — Support Engineer to Implementation Consultant",
          stats: [
            { label: "Skills in target", value: "11" },
            { label: "Already met", value: "6" },
            { label: "To build", value: "5" },
          ],
          bars: [
            { label: "Product knowledge", value: "Transfers at level", pct: 88 },
            { label: "Client workshops", value: "Gap: 2 levels", pct: 32 },
            { label: "Solution design", value: "Gap: 1 level", pct: 58 },
          ],
          note: DASHBOARD_NOTE,
        })}
      </div>`;

const reskilling = topicPage({
  out: "reskilling.html",
  canonical: "/reskilling",
  title: "Workforce Reskilling Platform | GaugeSkills",
  description:
    "Workforce reskilling that maps the distance between two roles, credits the skills a person already holds, and teaches only the ones the new role adds.",
  trail: [ENTERPRISE, { name: "Reskilling", path: "/reskilling" }],
  intro: {
    eyebrow: "Reskilling",
    h1: "Move People Into the Roles You Actually Need",
    lede: "Some roles are shrinking while others cannot be filled fast enough, often inside the same organization. Reskilling is the bridge between them: measure what a person already holds, work out what the target role adds, and teach only that.",
    primaryLabel: "Talk to Our Enterprise Team",
    secondary: { path: "/enterprise", label: "Enterprise overview" },
  },
  aside: reskillingAside,
  middle: (rel) => [
    section({
      tone: "white",
      children: `    ${sectionHead({
        eyebrow: "What this actually means",
        title: "The distance between two role standards, for one person",
        lede: "Reskilling is not a longer training course. It is a comparison between where someone is measured today and what a different role requires, which produces three lists: what transfers at level, what transfers but needs raising, and what is genuinely new.",
      })}
    <div class="mt-10 grid gap-5 lg:grid-cols-3">
      <div data-reveal class="rounded-card border border-hairline bg-paper p-6">
        <p class="text-xs font-semibold uppercase tracking-[0.16em] text-teal">Transfers at level</p>
        <p class="mt-2 text-[15px] leading-relaxed text-slate-body">Skills the person already demonstrates at or above what the target role requires. These are credited rather than retaught, and they are usually the majority.</p>
      </div>
      <div data-reveal style="--reveal-delay: 60ms" class="rounded-card border border-hairline bg-paper p-6">
        <p class="text-xs font-semibold uppercase tracking-[0.16em] text-teal">Transfers, needs raising</p>
        <p class="mt-2 text-[15px] leading-relaxed text-slate-body">Skills held at a lower level than the new role needs. Shorter to close than starting from nothing, because the foundation is already there.</p>
      </div>
      <div data-reveal class="rounded-card border border-hairline bg-paper p-6">
        <p class="text-xs font-semibold uppercase tracking-[0.16em] text-teal">Genuinely new</p>
        <p class="mt-2 text-[15px] leading-relaxed text-slate-body">Skills the person has no measured evidence for. This list is the real cost of the transition, and its length is what makes a move plausible or not.</p>
      </div>
    </div>
    <p data-reveal class="mt-8 max-w-3xl text-[15px] leading-relaxed text-slate-body">
      The size of the third list is the honest test. Where it is short, the transition is a plan. Where it is most of the target role, the person is starting a new career and should be told that plainly rather than enrolled in something optimistic.
    </p>`,
    }),
    section({
      tone: "paper",
      children: `    ${sectionHead({
        eyebrow: "How a transition is built",
        title: "From a role that is shrinking to one that is hiring",
      })}
    ${cardGrid(
      [
        { tag: "Step 01", title: "Find the adjacent roles", body: "For a given person, compare their measured profile against every role standard in the organization and rank the targets by how little they would have to learn." },
        { tag: "Step 02", title: "Credit what already exists", body: "Skills demonstrated at or above the target level are carried over with their evidence intact. Nobody sits through a module on something they were measured on last quarter." },
        { tag: "Step 03", title: "Scope the new skills honestly", body: "The remaining list is costed in learning time, and it is shown to the person before they commit. A transition nobody has the time for is better declined early." },
        { tag: "Step 04", title: "Learn against the target standard", body: "The path is built from the target role's requirements rather than a generic curriculum, so every module maps to a skill the new role actually needs." },
        { tag: "Step 05", title: "Practise in the real context", body: "Applied tasks and scenarios drawn from the target role, often alongside someone already doing it. Explanation on demand comes from the AI tutor; the mentoring stays human." },
        { tag: "Step 06", title: "Re-measure against the new role", body: "Readiness for the target role is re-assessed at the end, so the decision to move someone rests on a measurement rather than on how the programme felt." },
      ],
      { columns: 3 },
    )}`,
    }),
    section({
      tone: "white",
      children: `    ${sectionHead({
        eyebrow: "The distinction",
        title: "Upskilling and reskilling are not the same project",
        lede: "They get budgeted together and they behave completely differently. Confusing them is how an organization ends up running a reskilling programme on an upskilling timeline.",
      })}
    <div class="mt-12 grid gap-5 lg:grid-cols-2">
      <div data-reveal class="rounded-card border border-hairline bg-paper p-7">
        <h3 class="text-[19px] font-semibold text-ink">Upskilling</h3>
        <dl class="mt-5 space-y-4 text-[15px] leading-relaxed">
          <div><dt class="font-semibold text-ink">Destination</dt><dd class="text-slate-body">The same role, performed at a higher level.</dd></div>
          <div><dt class="font-semibold text-ink">Scope</dt><dd class="text-slate-body">A few skills, usually one or two levels apart.</dd></div>
          <div><dt class="font-semibold text-ink">Trigger</dt><dd class="text-slate-body">A gap against the standard for the job the person already holds.</dd></div>
          <div><dt class="font-semibold text-ink">Risk if it fails</dt><dd class="text-slate-body">The work keeps getting escalated to someone more senior.</dd></div>
        </dl>
        <a href="${rel("/upskilling")}" class="mt-6 inline-flex text-[15px] font-semibold text-teal underline-offset-4 hover:underline">Read about upskilling</a>
      </div>
      <div data-reveal style="--reveal-delay: 60ms" class="rounded-card border border-teal/30 bg-white p-7 shadow-soft">
        <h3 class="text-[19px] font-semibold text-ink">Reskilling</h3>
        <dl class="mt-5 space-y-4 text-[15px] leading-relaxed">
          <div><dt class="font-semibold text-ink">Destination</dt><dd class="text-slate-body">A different role, with a different standard.</dd></div>
          <div><dt class="font-semibold text-ink">Scope</dt><dd class="text-slate-body">A set of skills the person has no evidence for at all.</dd></div>
          <div><dt class="font-semibold text-ink">Trigger</dt><dd class="text-slate-body">A role that is shrinking, a role that cannot be hired for, or a person who wants to move.</dd></div>
          <div><dt class="font-semibold text-ink">Risk if it fails</dt><dd class="text-slate-body">A vacancy stays open and a capable person leaves the organization.</dd></div>
        </dl>
        <a href="${rel("/skills-gap-analysis")}" class="mt-6 inline-flex text-[15px] font-semibold text-teal underline-offset-4 hover:underline">See how both start from a gap</a>
      </div>
    </div>`,
    }),
  ],
  faqTitle: "What leaders ask before funding a transition",
  faqs: [
    {
      q: "How do you decide which roles someone could move into?",
      a: "By comparing their measured profile against every role standard you have defined and ranking the targets by how small the remaining list of new skills is. Adjacency falls out of the measurement rather than being asserted by a career map somebody drew three years ago.",
    },
    {
      q: "Is this something you do to people or with them?",
      a: "With them, or it does not work. The person sees the same three lists their manager sees, including the honest cost of the new skills, before anything is agreed. A transition someone has not chosen tends to produce an exit rather than a new role.",
    },
    {
      q: "How long does a reskilling transition take?",
      a: "It depends entirely on the length of the genuinely-new list, which is exactly why that list is produced first. A move between adjacent roles that share most of a skill set is a different order of commitment from a move across job families, and the analysis tells you which one you are looking at.",
    },
    {
      q: "What if someone is not ready at the end of the path?",
      a: "Then the re-assessment says so, which is the point of running it. Options are a longer path, a supported placement in the new role with a reduced initial scope, or a different target. None of those are failures; a programme that declares everyone ready by default is the failure.",
    },
  ],
  close: {
    title: "Start with the role you cannot hire for",
    lede: "Tell us the role you are struggling to fill. We will show you how the platform would find the people already inside the organization who are closest to it.",
    primaryLabel: "Talk to Our Enterprise Team",
    secondary: { path: "/skills-gap-analysis", label: "How the distance is measured" },
  },
  links: [
    { label: "Skills gap analysis", path: "/skills-gap-analysis", note: "The method behind both upskilling and reskilling decisions." },
    { label: "Competency management", path: "/competency-management", note: "The shared definitions that make two role standards comparable." },
    { label: "Enterprise", path: "/enterprise", note: "Workforce inventory, role readiness and internal mobility." },
    { label: "Upskilling", path: "/upskilling", note: "The other answer to a gap: deeper in the same role." },
    { label: "Workforce analytics", path: "/workforce-analytics", note: "Spotting the roles that are shrinking before they empty out." },
    { label: "Skills", path: "/skills", note: "How role standards and measured levels are modelled." },
  ],
});

/* ------------------------------------------- 9. /competency-management */

const competencyAside = `<div data-rise class="rounded-card border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
        <p class="text-xs font-semibold uppercase tracking-[0.16em] text-cyan">Competency record</p>
        <h2 class="mt-4 text-[21px] font-semibold text-white">Client requirements workshop</h2>
        <dl class="mt-5 space-y-4 text-[15px]">
          <div class="flex items-baseline justify-between gap-4">
            <dt class="text-mist">Owner</dt>
            <dd class="font-semibold text-white">Head of Delivery</dd>
          </div>
          <div class="flex items-baseline justify-between gap-4">
            <dt class="text-mist">Levels defined</dt>
            <dd class="font-semibold text-white">4 of 5, observably</dd>
          </div>
          <div class="flex items-baseline justify-between gap-4">
            <dt class="text-mist">Evidence accepted</dt>
            <dd class="font-semibold text-white">Scenario, work product</dd>
          </div>
          <div class="flex items-baseline justify-between gap-4">
            <dt class="text-mist">Roles using it</dt>
            <dd class="font-semibold text-white">3</dd>
          </div>
          <div class="flex items-baseline justify-between gap-4">
            <dt class="text-mist">Last reviewed</dt>
            <dd class="font-semibold text-white">4 months ago</dd>
          </div>
        </dl>
        <p class="mt-6 border-t border-white/10 pt-4 text-[12px] text-mist">${INTERFACE_NOTE}</p>
      </div>`;

const competencyManagement = topicPage({
  out: "competency-management.html",
  canonical: "/competency-management",
  title: "Competency Management Software | GaugeSkills",
  description:
    "Define competencies once, give every level observable evidence and a named owner, and keep the framework current as roles change rather than refreshing a PDF.",
  trail: [ENTERPRISE, { name: "Competency management", path: "/competency-management" }],
  intro: {
    eyebrow: "Competency management",
    h1: "From Competency Framework to Everyday Decisions",
    lede: "Most frameworks are commissioned once, delivered as a spreadsheet, and opened during appraisal season by the people who remember they exist. A competency model earns its keep when it is small enough to remember, specific enough to settle an argument, and wired into the decisions managers make every week.",
    primaryLabel: "Talk to Our Enterprise Team",
    secondary: { path: "/skills", label: "How skills are modelled" },
  },
  aside: competencyAside,
  middle: (rel) => [
    section({
      tone: "white",
      children: `    ${sectionHead({
        eyebrow: "What this actually means",
        title: "A competency is not a bigger skill",
        lede: "The two words get used interchangeably and then a framework collapses under the confusion. They describe different things, they are measured differently, and a working model needs both.",
      })}
    <div class="mt-10 grid gap-5 sm:grid-cols-3">
      <div data-reveal class="rounded-card border border-hairline p-6">
        <p class="font-display text-[15px] font-semibold text-teal">A skill is a capability</p>
        <p class="mt-2 text-[15px] leading-relaxed text-slate-body">Something a person can do: write a SQL query, run a payroll cycle, read a balance sheet. Narrow enough to assess directly, and it means the same thing in any organization.</p>
      </div>
      <div data-reveal style="--reveal-delay: 60ms" class="rounded-card border border-hairline p-6">
        <p class="font-display text-[15px] font-semibold text-teal">A competency is behaviour in context</p>
        <p class="mt-2 text-[15px] leading-relaxed text-slate-body">How a person applies skills, judgement and conduct to the work your organization actually does. It is yours, it is observable, and it usually needs more than one kind of evidence.</p>
      </div>
      <div data-reveal class="rounded-card border border-hairline p-6">
        <p class="font-display text-[15px] font-semibold text-teal">A role standard is the bar</p>
        <p class="mt-2 text-[15px] leading-relaxed text-slate-body">Which competencies a job requires and at what level. This is the thing a person gets compared against, and the thing most organizations never write down.</p>
      </div>
    </div>
    <div data-reveal class="mt-10 rounded-card border border-hairline bg-paper p-7 md:p-9">
      <p class="text-xs font-semibold uppercase tracking-[0.16em] text-teal">What every competency record carries</p>
      <dl class="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <dt class="text-[15px] font-semibold text-ink">A definition you could argue with</dt>
          <dd class="mt-1 text-[15px] leading-relaxed text-slate-body">Written so two managers watching the same person would reach the same conclusion. If it cannot be disputed, it cannot be evidenced either.</dd>
        </div>
        <div>
          <dt class="text-[15px] font-semibold text-ink">Levels that discriminate</dt>
          <dd class="mt-1 text-[15px] leading-relaxed text-slate-body">Each level describes different observable behaviour, not the same behaviour with adverbs attached. Three good levels beat five that blur into each other.</dd>
        </div>
        <div>
          <dt class="text-[15px] font-semibold text-ink">The evidence it accepts</dt>
          <dd class="mt-1 text-[15px] leading-relaxed text-slate-body">Assessment, work product, structured scenario or manager validation. Declared up front, so nobody has to invent a standard of proof under time pressure.</dd>
        </div>
        <div>
          <dt class="text-[15px] font-semibold text-ink">A named owner</dt>
          <dd class="mt-1 text-[15px] leading-relaxed text-slate-body">A person, not a function. Competencies owned by the business stay current; competencies owned by nobody become archaeology within two years.</dd>
        </div>
        <div>
          <dt class="text-[15px] font-semibold text-ink">A review date</dt>
          <dd class="mt-1 text-[15px] leading-relaxed text-slate-body">Work changes and definitions rot quietly. A record that has passed its review date is flagged as stale rather than presented as current.</dd>
        </div>
        <div>
          <dt class="text-[15px] font-semibold text-ink">The roles that use it</dt>
          <dd class="mt-1 text-[15px] leading-relaxed text-slate-body">Visible from the record itself, so the cost of changing a definition is obvious before somebody changes it.</dd>
        </div>
      </dl>
    </div>`,
    }),
    section({
      tone: "paper",
      children: `    ${sectionHead({
        eyebrow: "What it is for",
        title: "The decisions a framework is supposed to settle",
        lede: "A competency model is not an inventory exercise. It is shared vocabulary that lets several different decisions get made consistently by people who are not in the same room.",
      })}
    ${benefitGrid([
      {
        benefit: "Two managers describe the same job the same way.",
        body: "Role standards are defined from a shared library rather than rewritten in each job description, so the bar for a role does not move depending on who is hiring for it.",
        feature: "Shared role standards",
      },
      {
        benefit: "Know what a promotion actually requires.",
        body: "The difference between two levels is written down in observable terms, so the answer to what would get me promoted is a document rather than a manager's mood.",
        feature: "Transparent level criteria",
      },
      {
        benefit: "Stop interviewing for the same thing five different ways.",
        body: "Hiring panels work from the same competency definitions the role standard uses, which makes scorecards comparable and post-interview debriefs shorter.",
        feature: "Consistent evaluation",
      },
      {
        benefit: "Find the internal candidate before posting externally.",
        body: "When people are measured against a common set of competencies, matching a person to an open role is a query rather than a memory test.",
        feature: "Internal mobility",
      },
      {
        benefit: "Aim development at a defined level, not a vague ambition.",
        body: "A development plan built against level criteria has a finish line and a way to check whether it was crossed, which is the difference between a plan and an intention.",
        feature: "Development planning",
      },
      {
        benefit: "Retire the definitions that no longer describe the work.",
        body: "Usage is visible per competency, so the ones nothing references can be archived deliberately instead of accumulating until somebody commissions a replacement framework.",
        feature: "Framework hygiene",
      },
    ])}`,
    }),
    section({
      tone: "ink",
      children: `    <div class="grid items-start gap-12 lg:grid-cols-[1fr_1fr]">
      <div>
        ${sectionHead({
          eyebrow: "The hard part",
          title: "Governance, not authoring",
          lede: "Writing the first version of a framework takes a quarter. Keeping it true takes forever, and that is the part no spreadsheet helps with. The platform treats a competency as a record with an owner and a lifecycle rather than a row in a document.",
          tone: "dark",
        })}
        <ol class="mt-8 space-y-4">
          <li class="flex gap-3"><span aria-hidden="true" class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan"></span><span class="text-[15px] leading-relaxed text-mist"><span class="font-semibold text-white">Propose.</span> Anyone can raise a competency the work needs. It arrives as a draft, not as policy.</span></li>
          <li class="flex gap-3"><span aria-hidden="true" class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan"></span><span class="text-[15px] leading-relaxed text-mist"><span class="font-semibold text-white">Define.</span> The owner writes the levels and declares what evidence counts. Until both exist, it cannot be attached to a role.</span></li>
          <li class="flex gap-3"><span aria-hidden="true" class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan"></span><span class="text-[15px] leading-relaxed text-mist"><span class="font-semibold text-white">Pilot.</span> Used on one team first. Definitions that two assessors read differently surface here, cheaply.</span></li>
          <li class="flex gap-3"><span aria-hidden="true" class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan"></span><span class="text-[15px] leading-relaxed text-mist"><span class="font-semibold text-white">Publish.</span> It becomes available to role standards, assessments and development plans across the organization.</span></li>
          <li class="flex gap-3"><span aria-hidden="true" class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan"></span><span class="text-[15px] leading-relaxed text-mist"><span class="font-semibold text-white">Observe.</span> Usage, assessment spread and disagreement between assessors are visible to the owner as evidence the definition is working.</span></li>
          <li class="flex gap-3"><span aria-hidden="true" class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan"></span><span class="text-[15px] leading-relaxed text-mist"><span class="font-semibold text-white">Revise or retire.</span> Changes are versioned, so an assessment made last year still says which definition it was made against.</span></li>
        </ol>
        <div class="mt-9">
          <a href="${rel("/blog/competency-management-that-people-use")}" class="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-6 py-3 text-[15px] font-semibold text-white transition-all duration-200 ease-out hover:border-cyan hover:text-cyan">Why most frameworks fail</a>
        </div>
      </div>
      <div data-reveal class="rounded-card border border-white/10 bg-white/5 p-7">
        <p class="text-xs font-semibold uppercase tracking-[0.16em] text-cyan">Four ways a framework dies</p>
        <dl class="mt-6 space-y-5">
          <div>
            <dt class="text-[15px] font-semibold text-white">It was too big to learn</dt>
            <dd class="mt-1.5 text-[15px] leading-relaxed text-mist">Several hundred competencies is a reference work. Managers use what they can hold in their head, which in practice is a handful per role.</dd>
          </div>
          <div>
            <dt class="text-[15px] font-semibold text-white">The wording could mean anything</dt>
            <dd class="mt-1.5 text-[15px] leading-relaxed text-mist">Advanced stakeholder management means whatever the reader wants. A definition that cannot be disputed cannot be evidenced either.</dd>
          </div>
          <div>
            <dt class="text-[15px] font-semibold text-white">Nobody owned it</dt>
            <dd class="mt-1.5 text-[15px] leading-relaxed text-mist">A framework owned by a project that ended is a framework that stopped tracking the work the day the project closed.</dd>
          </div>
          <div>
            <dt class="text-[15px] font-semibold text-white">It only touched appraisals</dt>
            <dd class="mt-1.5 text-[15px] leading-relaxed text-mist">Vocabulary used once a year is vocabulary nobody learns. It has to appear in hiring, development and staffing decisions to stay alive.</dd>
          </div>
        </dl>
      </div>
    </div>`,
    }),
  ],
  faqTitle: "What HR leaders ask before rebuilding a framework",
  faqs: [
    {
      q: "What is the difference between a skill and a competency here?",
      a: "A skill is a discrete capability that can be assessed on its own and means roughly the same thing anywhere. A competency describes how skills, judgement and conduct combine in your organization's context, which makes it specific to you and usually harder to evidence. The platform models both, because role standards need skills for precision and competencies for the parts of a job that no test captures.",
    },
    {
      q: "We already have a framework in a spreadsheet. Do we start over?",
      a: "No, and starting over is usually the wrong instinct. Import what exists, then work through it by usage: the competencies actually referenced by roles get an owner, observable level definitions and a review date, and the rest sit in an archive until something claims them. Most organizations find that a third of the framework is doing all the work.",
    },
    {
      q: "How many competencies should a role have?",
      a: "Fewer than feels responsible. A role standard that lists twenty competencies will be read once and never used to make a decision. Somewhere between five and eight, each one genuinely load-bearing for the job, produces a standard managers can hold in their head and apply consistently, which is the only kind that changes anything.",
    },
    {
      q: "Who should own a competency?",
      a: "Someone in the business who does the work, not HR. HR owns the method, the levels scale and the governance cadence; the person who runs delivery owns what good delivery looks like. Frameworks owned entirely by a central function drift from the work because the people who notice the drift have no way to change the record.",
    },
  ],
  close: {
    title: "Bring the framework you already have",
    lede: "Send us the spreadsheet. We will show you which competencies are actually referenced, what it would take to make them evidence-based, and what the first role standard would look like.",
    primaryLabel: "Talk to Our Enterprise Team",
    secondary: { path: "/skills-gap-analysis", label: "See how a standard becomes a gap" },
  },
  links: [
    { label: "Skills", path: "/skills", note: "How skills, levels and evidence are modelled underneath." },
    { label: "Enterprise", path: "/enterprise", note: "The full workforce view for HR, L&D and leadership." },
    { label: "Employee skill assessment", path: "/employee-skill-assessment", note: "Establishing a level against a definition, from evidence." },
    { label: "Skills gap analysis", path: "/skills-gap-analysis", note: "What a role standard is for once people are measured against it." },
    { label: "Workforce analytics", path: "/workforce-analytics", note: "What the framework lets you report once it is in use." },
    { label: "Reskilling", path: "/reskilling", note: "Using shared definitions to find the roles a person is closest to." },
  ],
});

/* -------------------------------------------------- 10. /learning-paths */

const pathAside = `<div data-rise class="rounded-card border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
        <p class="text-xs font-semibold uppercase tracking-[0.16em] text-cyan">Path — Data modelling, Level 2 to Level 3</p>
        <ol class="mt-5 space-y-3">
          <li class="flex items-start gap-3 rounded-xl bg-ink/60 p-4">
            <span aria-hidden="true" class="mt-0.5 text-[13px] font-bold text-mist">01</span>
            <div>
              <p class="text-[15px] font-medium text-mist line-through">Relational basics</p>
              <p class="mt-0.5 text-[13px] text-mist">Skipped — already demonstrated at Level 3</p>
            </div>
          </li>
          <li class="flex items-start gap-3 rounded-xl border border-cyan/25 bg-cyan/10 p-4">
            <span aria-hidden="true" class="mt-0.5 text-[13px] font-bold text-cyan">02</span>
            <div>
              <p class="text-[15px] font-medium text-white">Normalisation in practice</p>
              <p class="mt-0.5 text-[13px] text-cyan">In progress — second attempt at the applied task</p>
            </div>
          </li>
          <li class="flex items-start gap-3 rounded-xl bg-ink/60 p-4">
            <span aria-hidden="true" class="mt-0.5 text-[13px] font-bold text-mist">03</span>
            <div>
              <p class="text-[15px] font-medium text-white">Added after two failed attempts</p>
              <p class="mt-0.5 text-[13px] text-mist">Remediation on functional dependencies</p>
            </div>
          </li>
          <li class="flex items-start gap-3 rounded-xl bg-ink/60 p-4">
            <span aria-hidden="true" class="mt-0.5 text-[13px] font-bold text-mist">04</span>
            <div>
              <p class="text-[15px] font-medium text-white">Re-assessment</p>
              <p class="mt-0.5 text-[13px] text-mist">Locked until the applied task is passed</p>
            </div>
          </li>
        </ol>
        <p class="mt-5 text-[12px] text-mist">${INTERFACE_NOTE}</p>
      </div>`;

const learningPaths = topicPage({
  out: "learning-paths.html",
  canonical: "/learning-paths",
  title: "Personalized Learning Paths | GaugeSkills",
  description:
    "Learning paths assembled from a measured gap: prerequisites first, your existing content where it fits, remediation when practice fails, and a re-assessment at the end.",
  trail: [PLATFORM, { name: "Learning paths", path: "/learning-paths" }],
  intro: {
    eyebrow: "Learning paths",
    h1: "Paths Built From What Someone Is Actually Missing",
    lede: "A course is the same for everyone who enrols in it. A path is the shortest honest route between what a person can demonstrate today and what their class, course or role requires — which means it cannot be written until somebody has been measured.",
    primaryLabel: "Book a Demo",
    secondary: { path: "/platform", label: "See the platform" },
  },
  aside: pathAside,
  middle: (rel) => [
    section({
      tone: "white",
      children: `    ${sectionHead({
        eyebrow: "What this actually means",
        title: "Personalized is a claim. Scoped by evidence is a mechanism.",
        lede: "Almost every learning product now says personalized, and most of them mean the learner picked a topic from a menu. A path is personalized in a narrower and more useful sense: its contents were determined by what a specific person got wrong.",
      })}
    <div class="mt-10 grid gap-5 sm:grid-cols-3">
      <div data-reveal class="rounded-card border border-hairline p-6">
        <p class="font-display text-[15px] font-semibold text-teal">Scoped by evidence</p>
        <p class="mt-2 text-[15px] leading-relaxed text-slate-body">Modules covering concepts the learner already demonstrated are dropped before the path is issued. What remains is the gap, which is usually a fraction of the course it came from.</p>
      </div>
      <div data-reveal style="--reveal-delay: 60ms" class="rounded-card border border-hairline p-6">
        <p class="font-display text-[15px] font-semibold text-teal">Ordered by prerequisite</p>
        <p class="mt-2 text-[15px] leading-relaxed text-slate-body">Concepts have dependencies. A learner failing the current unit is often missing something two units back, so the path starts where the reasoning first broke rather than where the syllabus says.</p>
      </div>
      <div data-reveal class="rounded-card border border-hairline p-6">
        <p class="font-display text-[15px] font-semibold text-teal">Changed by what happens</p>
        <p class="mt-2 text-[15px] leading-relaxed text-slate-body">A path is not fixed at assignment. Practice results extend it, shorten it, or insert remediation, so it reflects the learner in week four rather than the learner in week one.</p>
      </div>
    </div>
    <div data-reveal class="mt-10 rounded-card border border-hairline bg-paper p-7 md:p-9">
      <p class="text-xs font-semibold uppercase tracking-[0.16em] text-teal">How a path is assembled</p>
      <ol class="mt-6 grid gap-5 sm:grid-cols-2">
        <li>
          <p class="text-[15px] font-semibold text-ink">1. Establish the target</p>
          <p class="mt-1 text-[15px] leading-relaxed text-slate-body">The syllabus for a class, the outcomes for a course, or the standard for a role. Without a defined destination there is nothing to compute a route to.</p>
        </li>
        <li>
          <p class="text-[15px] font-semibold text-ink">2. Measure the starting point</p>
          <p class="mt-1 text-[15px] leading-relaxed text-slate-body">Assessment establishes where the learner currently stands, concept by concept, rather than asking them what they think they need.</p>
        </li>
        <li>
          <p class="text-[15px] font-semibold text-ink">3. Subtract, then sequence</p>
          <p class="mt-1 text-[15px] leading-relaxed text-slate-body">The difference becomes the scope; the prerequisite graph turns that scope into an order. Foundations that are missing move to the front even if they belong to an earlier unit.</p>
        </li>
        <li>
          <p class="text-[15px] font-semibold text-ink">4. Fill it with the best content available</p>
          <p class="mt-1 text-[15px] leading-relaxed text-slate-body">Your own material first, then your licensed library, then generated content where nothing covers the concept. Provenance is visible on every item.</p>
        </li>
        <li>
          <p class="text-[15px] font-semibold text-ink">5. Adapt on evidence, not on clicks</p>
          <p class="mt-1 text-[15px] leading-relaxed text-slate-body">Practice results drive the changes. Two failed attempts on the same concept insert remediation; a clean pass collapses the rest of that branch.</p>
        </li>
        <li>
          <p class="text-[15px] font-semibold text-ink">6. Close with a measurement</p>
          <p class="mt-1 text-[15px] leading-relaxed text-slate-body">The path ends in a re-assessment of the concepts it targeted. Finishing the content is not the outcome; moving the level is.</p>
        </li>
      </ol>
    </div>`,
    }),
    section({
      tone: "paper",
      children: `    ${sectionHead({
        eyebrow: "What changes",
        title: "Shorter routes finish more often",
      })}
    ${benefitGrid([
      {
        benefit: "Nobody sits through a module on something they can already do.",
        body: "Skipping demonstrated concepts typically removes a large part of a course. The learning that remains is the learning that was needed, and it fits in the time people actually have.",
        feature: "Gap-scoped content",
      },
      {
        benefit: "Fix the foundation instead of repeating the current chapter.",
        body: "When the prerequisite graph finds a missing concept two units back, the path goes there first, which is why the third explanation of the current topic finally lands.",
        feature: "Prerequisite sequencing",
      },
      {
        benefit: "Help arrives at the exact point someone gets stuck.",
        body: "The AI tutor sits inside the path and explains the step that broke, using the institution's own material. It supports the learner between sessions rather than replacing the teacher or coach.",
        feature: "In-path AI tutor",
      },
      {
        benefit: "Teachers and managers see where a path stalled, and why.",
        body: "A path that has not moved in two weeks is visible as a stalled commitment against a named person, which is a different thing from a low completion percentage in a report.",
        feature: "Progress visibility",
      },
      {
        benefit: "Get more out of the content you already licensed.",
        body: "Paths are assembled from your existing library and internal material. The value added is the targeting and the measurement around the content, not another catalogue.",
        feature: "Bring your own content",
      },
      {
        benefit: "End with proof rather than a completion tick.",
        body: "The closing re-assessment produces a second measurement on the same concepts, so the report says which levels moved instead of how many people finished.",
        feature: "Closing re-assessment",
      },
    ])}`,
    }),
    section({
      tone: "ink",
      children: `    ${sectionHead({
        eyebrow: "Three audiences",
        title: "The same mechanism, three vocabularies",
        lede: "A path is computed the same way everywhere: target, measurement, subtraction, sequence, adapt, re-measure. What changes is what the target is made of and what the learner sees, because a Class 8 student and a mid-career engineer are not doing the same thing.",
        tone: "dark",
      })}
    <div class="mt-12 grid gap-5 lg:grid-cols-3">
      <div data-reveal class="rounded-card border border-white/10 bg-white/5 p-7">
        <p class="text-xs font-semibold uppercase tracking-[0.16em] text-cyan">Schools</p>
        <h3 class="mt-3 text-[17px] font-semibold text-white">Against the class syllabus</h3>
        <p class="mt-2 text-[15px] leading-relaxed text-mist">The target is the concepts in the subject for that class. Paths are short, run alongside the timetable, and are mostly remediation: the topic from last term that never got solid and is now blocking this one.</p>
        <a href="${rel("/schools")}" class="mt-5 inline-flex text-[15px] font-semibold text-cyan underline-offset-4 hover:underline">GaugeSkills for Schools</a>
      </div>
      <div data-reveal style="--reveal-delay: 60ms" class="rounded-card border border-white/10 bg-white/5 p-7">
        <p class="text-xs font-semibold uppercase tracking-[0.16em] text-cyan">Higher Education</p>
        <h3 class="mt-3 text-[17px] font-semibold text-white">Against course outcomes</h3>
        <p class="mt-2 text-[15px] leading-relaxed text-mist">The target is the outcomes a course declares, plus the competencies a placement team cares about. Paths run across a semester and often serve a group of students who failed the same concept together.</p>
        <a href="${rel("/higher-education")}" class="mt-5 inline-flex text-[15px] font-semibold text-cyan underline-offset-4 hover:underline">GaugeSkills for Higher Education</a>
      </div>
      <div data-reveal class="rounded-card border border-white/10 bg-white/5 p-7">
        <p class="text-xs font-semibold uppercase tracking-[0.16em] text-cyan">Enterprise</p>
        <h3 class="mt-3 text-[17px] font-semibold text-white">Against a role standard</h3>
        <p class="mt-2 text-[15px] leading-relaxed text-mist">The target is the skills and levels a role requires. Paths are scoped to the measured gap, negotiated with the person before they start, and closed by a re-assessment that decides whether the level moved.</p>
        <a href="${rel("/enterprise")}" class="mt-5 inline-flex text-[15px] font-semibold text-cyan underline-offset-4 hover:underline">GaugeSkills for Enterprise</a>
      </div>
    </div>
    <p data-reveal class="mt-9 max-w-3xl text-[15px] leading-relaxed text-mist">
      One engine, three targets. That is the whole argument for running schools, colleges and workforce development on the same platform rather than three products that share a logo.
      <a href="${rel("/platform")}" class="font-semibold text-cyan underline-offset-4 hover:underline">See the platform underneath</a>.
    </p>`,
    }),
  ],
  faqTitle: "What people ask about paths",
  faqs: [
    {
      q: "Is a learning path just a playlist of courses?",
      a: "A playlist is a fixed list somebody curated in advance. A path is computed for one learner from a measurement, ordered by prerequisites rather than by catalogue structure, and changed by what happens during it. The practical difference shows up in length: a curated playlist covers a subject, a path covers a gap, and the gap is usually much smaller.",
    },
    {
      q: "Do we have to use your content?",
      a: "No. Paths are assembled from whatever you have — your own material, an existing licensed library, or content generated where nothing covers a concept. Every item shows where it came from. What the platform contributes is the targeting, the sequencing and the measurement, which is the part a content library does not do.",
    },
    {
      q: "What happens when a learner gets stuck halfway through?",
      a: "Two failed attempts on the same concept insert remediation ahead of the next module rather than letting the learner continue and fail again. The AI tutor is available at that point to explain the step differently. If the pattern repeats, the path is flagged to the teacher, faculty member or manager responsible, because at that point it is a teaching problem rather than a content problem.",
    },
    {
      q: "Can a teacher or manager change the path?",
      a: "Yes, and they should be able to. A computed path is a strong starting point built from evidence, but it does not know that a student has been unwell or that a role is changing next quarter. Modules can be added, removed or reordered, and the change is attributed so the reasoning survives the person who made it.",
    },
  ],
  close: {
    title: "See a path built from a real gap",
    lede: "Bring a syllabus, a course outline or a role standard. We will measure against it and show you the path that comes out the other side, including everything it decided to skip.",
    primaryLabel: "Book a Demo",
    secondary: { path: "/skills", label: "How the measurement works" },
  },
  links: [
    { label: "The platform", path: "/platform", note: "Where assessment, learning and analytics sit together." },
    { label: "AI tutor", path: "/ai-tutor", note: "The explanation that sits inside a path when someone is stuck." },
    { label: "Skills", path: "/skills", note: "How the measurement that scopes a path is established." },
    { label: "Upskilling", path: "/upskilling", note: "Paths pointed at a gap in the role a person already holds." },
    { label: "Schools", path: "/schools", note: "Paths against a class syllabus, alongside the timetable." },
    { label: "Higher Education", path: "/higher-education", note: "Paths against course outcomes and placement competencies." },
  ],
});

/* ---------------------------------------------- 11. /workforce-analytics */

const workforceAside = `<div data-rise>
        ${dashboardMock({
          title: "Workforce capability — Engineering, 312 people",
          stats: [
            { label: "Roles covered", value: "9" },
            { label: "Critical gaps", value: "4" },
            { label: "Role ready", value: "61%" },
          ],
          bars: [
            { label: "Cloud infrastructure", value: "Concentrated in 3 people", pct: 24 },
            { label: "Automated testing", value: "Improving, 2 quarters", pct: 57 },
            { label: "Code review", value: "Meets requirement", pct: 88 },
          ],
          note: DASHBOARD_NOTE,
        })}
      </div>`;

const workforceAnalytics = topicPage({
  out: "workforce-analytics.html",
  canonical: "/workforce-analytics",
  title: "Workforce Skills Analytics for HR and L&D | GaugeSkills",
  description:
    "Workforce analytics built on measured skills, not course completions: a live capability inventory, role readiness by team, and whether the learning spend moved anything.",
  trail: [ENTERPRISE, { name: "Workforce analytics", path: "/workforce-analytics" }],
  intro: {
    eyebrow: "Workforce analytics",
    h1: "Report on Capability, Not Course Completions",
    lede: "Most learning dashboards measure activity: enrolments, hours consumed, completion percentages. None of them answer the question a board actually asks, which is whether this organization can do things next year that it cannot do today.",
    primaryLabel: "Talk to Our Enterprise Team",
    secondary: { path: "/enterprise", label: "Enterprise overview" },
  },
  aside: workforceAside,
  middle: (rel) => [
    section({
      tone: "white",
      children: `    ${sectionHead({
        eyebrow: "What this actually means",
        title: "Four questions, and activity data answers none of them",
        lede: "Completion rates are easy to collect, which is why they dominate learning reporting, and they describe effort rather than capability. These are the questions a workforce dashboard has to be able to answer instead.",
      })}
    ${cardGrid(
      [
        {
          tag: "Question 01",
          title: "What can this organization actually do?",
          body: "A live inventory of measured skills and levels across the workforce, rather than a headcount by job title and an assumption that the title implies the capability.",
        },
        {
          tag: "Question 02",
          title: "Where is that capability concentrated?",
          body: "How many people hold a critical skill at the required level. A capability held by three people in a company of three hundred is a dependency, and it does not show up on any completion report.",
        },
        {
          tag: "Question 03",
          title: "Are we ready for next year's plan?",
          body: "Role readiness measured against the standards the plan requires rather than the standards the current work requires, so a capability shortfall surfaces while there is still time to hire or build.",
        },
        {
          tag: "Question 04",
          title: "Did the learning spend change anything?",
          body: "Levels re-measured after development, compared against where they started. This is the only one of the four that needs two measurements, and it is the one most often skipped.",
        },
      ],
      { columns: 2 },
    )}`,
    }),
    section({
      tone: "ink",
      children: `    ${sectionHead({
        eyebrow: "The metrics",
        title: "What each number is made of",
        lede: "A metric nobody can define is a metric nobody defends in a leadership meeting. These four carry most of the weight, and each one is computed from assessment evidence rather than from activity.",
        tone: "dark",
      })}
    <div class="mt-12 grid gap-5 lg:grid-cols-2">
      <div data-reveal class="rounded-card border border-white/10 bg-white/5 p-7">
        <h3 class="text-[17px] font-semibold text-white">Capability coverage</h3>
        <p class="mt-2 text-[15px] leading-relaxed text-mist">For a given skill, how many people hold it at or above a stated level. Reported with the population attached, because eight people out of twelve and eight out of four hundred are different organizations.</p>
      </div>
      <div data-reveal style="--reveal-delay: 60ms" class="rounded-card border border-white/10 bg-white/5 p-7">
        <h3 class="text-[17px] font-semibold text-white">Role readiness</h3>
        <p class="mt-2 text-[15px] leading-relaxed text-mist">The share of a role's required skills that a person meets at level. Aggregated to a team, it says how much of the role standard the team collectively satisfies, which is a more useful planning number than an average.</p>
      </div>
      <div data-reveal class="rounded-card border border-white/10 bg-white/5 p-7">
        <h3 class="text-[17px] font-semibold text-white">Concentration</h3>
        <p class="mt-2 text-[15px] leading-relaxed text-mist">How few people a critical capability depends on. This is the metric that turns a skills inventory into a risk register, and it is invisible to any report built on averages.</p>
      </div>
      <div data-reveal style="--reveal-delay: 60ms" class="rounded-card border border-white/10 bg-white/5 p-7">
        <h3 class="text-[17px] font-semibold text-white">Movement</h3>
        <p class="mt-2 text-[15px] leading-relaxed text-mist">The change in measured level on the same skill between two points in time. Without it, an inventory is a photograph; with it, the learning investment has something to be judged against.</p>
      </div>
    </div>
    <p data-reveal class="mt-9 max-w-3xl text-[15px] leading-relaxed text-mist">
      What these numbers are not is a productivity monitor. They describe capability against defined standards; they do not track activity, time at a desk, or anything resembling individual surveillance, and there is no composite employee score.
      <a href="${rel("/security")}" class="font-semibold text-cyan underline-offset-4 hover:underline">How access and data scope work</a>.
    </p>`,
    }),
    section({
      tone: "paper",
      children: `    ${sectionHead({
        eyebrow: "The views",
        title: "The same data, cut for the decision being made",
        lede: "A CHRO planning next year and a team lead preparing a one-to-one need different answers from one set of records. Each role sees the cut that matches what they are accountable for, and nothing beyond it.",
      })}
    ${cardGrid(
      [
        { tag: "CHRO", title: "Across the organization", body: "Capability coverage and readiness by function, with the concentration risks and the gaps that the coming year's plan depends on." },
        { tag: "L&D", title: "Programme effect", body: "Before-and-after levels for the skills a programme targeted, so the review is about movement rather than attendance and satisfaction scores." },
        { tag: "Manager", title: "My team", body: "Where each person stands against their role standard, what is in progress, and which gap is worth the next development conversation." },
        { tag: "Business leader", title: "Can we staff this?", body: "Readiness for a specific initiative measured against the roles it needs, rather than an assurance that the training budget was spent." },
        { tag: "Talent acquisition", title: "Build or buy", body: "Which gaps are close enough to close internally and which need hiring, based on the size and spread of the gap instead of instinct." },
        { tag: "Employee", title: "Where I stand", body: "Their own measured profile, what the next level would require, and which internal roles their current skills are closest to." },
      ],
      { columns: 3 },
    )}
    <p data-reveal class="mt-8 max-w-3xl text-[15px] leading-relaxed text-slate-body">
      Every one of these views is computed from the same measured levels, which is what stops two departments arriving at a meeting with two different numbers.
      <a href="${rel("/skills-gap-analysis")}" class="font-semibold text-teal underline-offset-4 hover:underline">See how a gap is calculated</a>.
    </p>`,
    }),
  ],
  faqTitle: "What HR and L&amp;D teams ask",
  faqs: [
    {
      q: "How is this different from the reports our HRMS or LMS already produces?",
      a: "An HRMS reports on people and positions; an LMS reports on activity and completions. Both are accurate about what they measure, and neither measures capability. This layer sits on assessment evidence, so its unit is a skill at a level rather than a course someone finished, and that is what makes readiness and movement computable.",
    },
    {
      q: "Can managers see individual employees' skill levels?",
      a: "A manager sees the measured levels of the people who report to them, against the standards for their roles. They do not see other teams, and there is no organization-wide ranking of individuals. Aggregate views above team level are reported as populations rather than named lists, because the decisions at that level are about capability, not about people.",
    },
    {
      q: "We have not measured anyone's skills yet. Where does the data come from?",
      a: "From assessment, over time, and it is worth being honest that this is the real cost of the approach. Most organizations start with one job family, define its role standards, measure that population, and have a usable dashboard for it within a quarter. An inventory built by asking everyone to rate themselves can be assembled in a fortnight and is not worth reporting on.",
    },
    {
      q: "Can we prove return on investment for learning with this?",
      a: "You can prove that measured capability changed, which is a stronger claim than most learning functions can make and a weaker one than attributing a business result to a training programme. Movement on a targeted skill, measured before and after, is defensible. Connecting that to revenue involves assumptions the platform cannot make for you, and we would rather say so.",
    },
  ],
  close: {
    title: "Start with one function and one set of roles",
    lede: "Pick the part of the organization where a capability question is currently being answered by opinion. We will show you what measuring it involves and what the dashboard would say at the end of a quarter.",
    primaryLabel: "Talk to Our Enterprise Team",
    secondary: { path: "/employee-skill-assessment", label: "How levels are established" },
  },
  links: [
    { label: "Enterprise", path: "/enterprise", note: "The full workforce picture: inventory, gaps and readiness." },
    { label: "Skills gap analysis", path: "/skills-gap-analysis", note: "The subtraction these dashboards are built on." },
    { label: "Employee skill assessment", path: "/employee-skill-assessment", note: "Where a measured level comes from in the first place." },
    { label: "Competency management", path: "/competency-management", note: "The definitions that make numbers comparable across teams." },
    { label: "Upskilling", path: "/upskilling", note: "What happens after a gap shows up on the dashboard." },
    { label: "Security", path: "/security", note: "Tenancy, role-based access and what each role can see." },
  ],
});

/* ---------------------------------------------- 12. /ai-quiz-generator */

const quizAside = `<div data-rise class="rounded-card border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
        <p class="text-xs font-semibold uppercase tracking-[0.16em] text-cyan">Generated item — awaiting review</p>
        <div class="mt-5 rounded-xl bg-ink/60 p-4">
          <p class="text-[15px] leading-relaxed text-white">A table is in second normal form but not third. Which dependency must be present?</p>
        </div>
        <dl class="mt-4 space-y-3 text-[14px]">
          <div class="flex items-baseline justify-between gap-4">
            <dt class="text-mist">Concept</dt>
            <dd class="font-semibold text-white">Functional dependency</dd>
          </div>
          <div class="flex items-baseline justify-between gap-4">
            <dt class="text-mist">Difficulty</dt>
            <dd class="font-semibold text-white">Moderate</dd>
          </div>
          <div class="flex items-baseline justify-between gap-4">
            <dt class="text-mist">Distractors</dt>
            <dd class="font-semibold text-white">3, each a named error</dd>
          </div>
        </dl>
        <div class="mt-4 rounded-xl border border-cyan/25 bg-cyan/10 p-4">
          <p class="text-[13px] font-medium text-cyan">Flagged for the reviewer</p>
          <p class="mt-1.5 text-[15px] leading-relaxed text-white">Option C may also be defensible. Confirm or replace before publishing.</p>
        </div>
        <p class="mt-5 text-[12px] text-mist">${INTERFACE_NOTE}</p>
      </div>`;

const aiQuizGenerator = topicPage({
  out: "ai-quiz-generator.html",
  canonical: "/ai-quiz-generator",
  title: "AI Quiz and Question Paper Generator | GaugeSkills",
  description:
    "Generate quizzes and question papers from your own syllabus, every item tagged to a concept and a difficulty, and nothing published until a teacher has approved it.",
  trail: [AI, { name: "AI quiz generator", path: "/ai-quiz-generator" }],
  intro: {
    eyebrow: "AI quiz generation",
    h1: "Question Papers in Minutes, Reviewed Like an Examiner",
    lede: "Producing questions is the easy part, and it is where most tools stop. A usable paper needs a blueprint, a difficulty spread, wrong options that are wrong for a reason, and a teacher who was willing to put their name on it.",
    primaryLabel: "Book a Demo",
    secondary: { path: "/ai", label: "How the AI layer works" },
  },
  aside: quizAside,
  middle: (rel) => [
    section({
      tone: "white",
      children: `    ${sectionHead({
        eyebrow: "What this actually means",
        title: "Start from a blueprint, not from a prompt",
        lede: "Ask a general-purpose model for ten questions on a chapter and you get ten questions on a chapter: same difficulty, same shape, clustered on whatever the source text emphasised. An assessment is a specification before it is a set of questions.",
      })}
    <div class="mt-10 grid gap-5 sm:grid-cols-3">
      <div data-reveal class="rounded-card border border-hairline p-6">
        <p class="font-display text-[15px] font-semibold text-teal">You set the coverage</p>
        <p class="mt-2 text-[15px] leading-relaxed text-slate-body">Which concepts the paper must test and how many marks each is worth. Generation fills the blueprint rather than deciding what matters, so the paper matches what you taught.</p>
      </div>
      <div data-reveal style="--reveal-delay: 60ms" class="rounded-card border border-hairline p-6">
        <p class="font-display text-[15px] font-semibold text-teal">You set the difficulty spread</p>
        <p class="mt-2 text-[15px] leading-relaxed text-slate-body">A paper of uniformly moderate questions separates nobody. Specify the mix across recall, application and analysis and the generated set is built to it.</p>
      </div>
      <div data-reveal class="rounded-card border border-hairline p-6">
        <p class="font-display text-[15px] font-semibold text-teal">Every item is tagged</p>
        <p class="mt-2 text-[15px] leading-relaxed text-slate-body">Each question carries the concept it tests and the level it targets. That tagging is what turns a mark into a diagnosis afterwards, and it is why the results are usable.</p>
      </div>
    </div>
    <p data-reveal class="mt-8 max-w-3xl text-[15px] leading-relaxed text-slate-body">
      The tagging is the quiet part that matters most. A paper of untagged questions produces a number; a paper of tagged questions produces a list of concepts the class has not understood.
      <a href="${rel("/student-performance-analytics")}" class="font-semibold text-teal underline-offset-4 hover:underline">See what tagged results make possible</a>.
    </p>`,
    }),
    section({
      tone: "paper",
      children: `    ${sectionHead({
        eyebrow: "Item quality",
        title: "Six ways a generated question goes wrong",
        lede: "Anyone who has reviewed machine-written questions has met all of these. They are worth naming, because a tool that does not check for them is asking the teacher to be the entire quality process.",
      })}
    ${cardGrid(
      [
        { tag: "Fault 01", title: "Distractors nobody would pick", body: "Three wrong options that are obviously wrong turn a four-option question into a true-or-false. Each distractor should correspond to a specific mistake a learner actually makes." },
        { tag: "Fault 02", title: "More than one defensible answer", body: "The most common serious fault and the hardest to spot at speed. Candidate items are checked for it and flagged to the reviewer rather than quietly published." },
        { tag: "Fault 03", title: "Testing the phrasing, not the concept", body: "A question answerable by recognising wording lifted from the textbook measures reading memory. Items are written to require the concept rather than the sentence." },
        { tag: "Fault 04", title: "An ambiguous stem", body: "If a capable student has to guess what is being asked, the item measures inference. Stems are checked for the vagueness that only shows up under exam pressure." },
        { tag: "Fault 05", title: "Difficulty drift", body: "Generated sets tend to converge on the middle. The blueprint is enforced across the whole paper, not item by item, so the spread you asked for survives." },
        { tag: "Fault 06", title: "Answers hidden in the options", body: "Length, grammatical agreement and specificity all leak the correct answer to a test-wise student. These patterns are checked before an item reaches review." },
      ],
      { columns: 3 },
    )}`,
    }),
    section({
      tone: "ink",
      children: `    <div class="grid items-start gap-12 lg:grid-cols-[1fr_1fr]">
      <div>
        ${sectionHead({
          eyebrow: "The workflow",
          title: "Nothing reaches a student unreviewed",
          lede: "Speed is only worth having if the output is safe to use. The path from a blueprint to a published paper has a person in it, and the platform is built so that person's job is reviewing rather than rewriting.",
          tone: "dark",
        })}
        <ol class="mt-8 space-y-4">
          <li class="flex gap-3"><span aria-hidden="true" class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan"></span><span class="text-[15px] leading-relaxed text-mist"><span class="font-semibold text-white">Specify.</span> Concepts, marks, difficulty mix and question types, drawn from the syllabus already loaded.</span></li>
          <li class="flex gap-3"><span aria-hidden="true" class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan"></span><span class="text-[15px] leading-relaxed text-mist"><span class="font-semibold text-white">Generate.</span> Candidate items produced against your own course material rather than the open internet.</span></li>
          <li class="flex gap-3"><span aria-hidden="true" class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan"></span><span class="text-[15px] leading-relaxed text-mist"><span class="font-semibold text-white">Screen.</span> Automated checks for the six faults above. Suspect items arrive flagged, with the reason stated.</span></li>
          <li class="flex gap-3"><span aria-hidden="true" class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan"></span><span class="text-[15px] leading-relaxed text-mist"><span class="font-semibold text-white">Review.</span> The teacher accepts, edits or rejects each item. Rejections are cheap; a replacement is one click.</span></li>
          <li class="flex gap-3"><span aria-hidden="true" class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan"></span><span class="text-[15px] leading-relaxed text-mist"><span class="font-semibold text-white">Publish.</span> Approved items go to the class and into the bank, attributed to the person who approved them.</span></li>
          <li class="flex gap-3"><span aria-hidden="true" class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan"></span><span class="text-[15px] leading-relaxed text-mist"><span class="font-semibold text-white">Learn from the results.</span> Items everyone answers correctly, or nobody does, are surfaced for retirement next time.</span></li>
        </ol>
        <div class="mt-9">
          <a href="${rel("/ai")}" class="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-6 py-3 text-[15px] font-semibold text-white transition-all duration-200 ease-out hover:border-cyan hover:text-cyan">What the AI will not do</a>
        </div>
      </div>
      <div data-reveal class="rounded-card border border-white/10 bg-white/5 p-7">
        <p class="text-xs font-semibold uppercase tracking-[0.16em] text-cyan">The same tool, three jobs</p>
        <dl class="mt-6 space-y-5">
          <div>
            <dt class="text-[15px] font-semibold text-white">Schools</dt>
            <dd class="mt-1.5 text-[15px] leading-relaxed text-mist">Weekly class tests and practice sets against the subject syllabus, generated in a free period rather than an evening. <a href="${rel("/schools")}" class="font-semibold text-cyan underline-offset-4 hover:underline">For schools</a>.</dd>
          </div>
          <div>
            <dt class="text-[15px] font-semibold text-white">Higher Education</dt>
            <dd class="mt-1.5 text-[15px] leading-relaxed text-mist">Unit tests and question banks per course, tagged to outcomes so results feed department reporting. <a href="${rel("/ai-for-faculty")}" class="font-semibold text-cyan underline-offset-4 hover:underline">AI for faculty</a>.</dd>
          </div>
          <div>
            <dt class="text-[15px] font-semibold text-white">Enterprise</dt>
            <dd class="mt-1.5 text-[15px] leading-relaxed text-mist">Knowledge checks inside a skill assessment, written against the level definitions a role standard uses. <a href="${rel("/employee-skill-assessment")}" class="font-semibold text-cyan underline-offset-4 hover:underline">Skill assessment</a>.</dd>
          </div>
        </dl>
      </div>
    </div>`,
    }),
  ],
  faqTitle: "What teachers and faculty ask",
  faqs: [
    {
      q: "Are the generated questions accurate?",
      a: "Mostly, and not reliably enough to publish unreviewed, which is why the workflow does not allow it. Grounding generation in your own course material removes a large class of errors, and the automated screening catches several more. What remains is a review step measured in minutes rather than the hours it takes to write a paper from scratch.",
    },
    {
      q: "Can it produce anything other than multiple choice?",
      a: "Yes. Short answer, numerical, matching, true or false and longer written prompts with a marking rubric attached. Multiple choice gets the most attention because it is the format where item quality fails most quietly, but a paper built only from one format measures the format as much as the subject.",
    },
    {
      q: "Does every student get the same paper?",
      a: "Your choice per assessment. For a formal test, one fixed paper is usually what an institution wants. For practice, generating a different set per student from the same blueprint is more useful, because it makes the practice genuinely individual and makes copying pointless.",
    },
    {
      q: "Can it grade the results as well?",
      a: "Objective items are marked automatically, and written answers can be given draft feedback against the rubric. Final marks on formal or high-stakes assessments stay with the examiner. That boundary is deliberate: marking carries academic and regulatory weight that should not sit with a model.",
    },
  ],
  close: {
    title: "Bring a chapter and a blueprint",
    lede: "Pick a unit you have taught and tell us how you would weight a test on it. We will generate the paper live, flags and all, and you can tell us which items you would have thrown out.",
    primaryLabel: "Book a Demo",
    secondary: { path: "/ai-for-faculty", label: "The wider faculty co-pilot" },
  },
  links: [
    { label: "AI", path: "/ai", note: "The full AI layer, and the limits it works inside." },
    { label: "AI for faculty", path: "/ai-for-faculty", note: "Course material, pacing and remediation beyond assessments." },
    { label: "AI tutor", path: "/ai-tutor", note: "What happens after a student gets a question wrong." },
    { label: "Schools", path: "/schools", note: "Class tests and practice sets against the subject syllabus." },
    { label: "Student performance analytics", path: "/student-performance-analytics", note: "What tagged questions make possible once the results land." },
    { label: "The platform", path: "/platform", note: "Where assessments, learning and analytics sit together." },
  ],
});

/* ---------------------------------------------------------- the pages */

export const topicPages = [
  aiTutor,
  aiForFaculty,
  studentPerformanceAnalytics,
  atRiskStudents,
  employeeSkillAssessment,
  skillsGapAnalysis,
  upskilling,
  reskilling,
  competencyManagement,
  learningPaths,
  workforceAnalytics,
  aiQuizGenerator,
];
