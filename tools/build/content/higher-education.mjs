/**
 * GaugeSkills for Higher Education.
 *
 * Vocabulary discipline: students, faculty, HODs, departments, courses,
 * semesters, syllabus, placements. No enterprise language — a principal or an
 * HOD should never have to translate "workforce" into "cohort" to read this.
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

const rel = linker("higher-education.html");

const faqs = [
  {
    q: "Will this replace the academic ERP we already run?",
    a: "No. The ERP stays the system of record for admissions, enrolment, attendance and results. GaugeSkills reads from it so students, programmes and semesters are not maintained in two places, and adds the layer an ERP was never built for: skill measurement, personalized learning and academic analytics.",
  },
  {
    q: "How early can it flag an at-risk student?",
    a: "As soon as there is enough signal to read. Attendance plus the first internal assessment is usually enough to separate a student who is drifting from a student having one difficult week. What the platform produces is a list with a reason attached; the decision to call the student in stays with the faculty member or the HOD.",
  },
  {
    q: "Does the AI mark student work?",
    a: "It drafts. Objective questions are scored automatically. For written answers the AI proposes a score and a comment against the rubric the department set, and the faculty member edits and signs it off. We do not put an AI in charge of a university examination result.",
  },
  {
    q: "How can you measure employability without a recruiter in the room?",
    a: "By assessing the skills recruiters screen on — aptitude, core subject depth, communication and applied problem solving — against a defined level rather than a self-rating. That gives a placement team evidence to work from in a conversation. It is not a promise of an offer, and we will not describe it as one.",
  },
  {
    q: "Do faculty have to change how they teach?",
    a: "No. The syllabus, the course plan and the assessment pattern stay as the department set them. What changes is how long preparation takes, and how much of the result is visible during the semester instead of after it.",
  },
];

const heroAside = `<div data-rise>
        ${dashboardMock({
          title: "Department view — B.Tech ECE, Semester 5",
          stats: [
            { label: "Students", value: "186" },
            { label: "At risk", value: "14" },
            { label: "Placement ready", value: "63%" },
          ],
          bars: [
            { label: "Core subject mastery", value: "Strong", pct: 81 },
            { label: "Syllabus coverage vs plan", value: "72% of 80%", pct: 72 },
            { label: "Employability skills", value: "Needs attention", pct: 44 },
          ],
          note: "Illustrative dashboard. Not customer data.",
        })}
      </div>`;

const s1 = hero({
  eyebrow: "GaugeSkills for Higher Education",
  h1: "Turn Learning into Employability",
  lede: "A degree certifies that a student completed a programme. It does not tell a recruiter what that student can do. GaugeSkills measures the skills behind the coursework, flags the students slipping while the semester can still be changed, and gives placement teams evidence instead of a self-written CV.",
  primary: { href: rel("/demo"), label: "Request a College Demo" },
  secondary: { href: rel("/platform"), label: "See the platform" },
  aside: heroAside,
});

const s2 = section({
  tone: "white",
  children: `    ${sectionHead({
    eyebrow: "The problem",
    title: "A transcript records the result. It does not record the skill.",
    lede: "A student clears six semesters at 7.4 CGPA and still stalls in a first-round interview. The marksheet cannot say whether the cause was a core subject from second year, the way the student explains their work, or the four weeks in August when attendance quietly dropped. Placement season is a costly time to find out.",
  })}
    <div class="mt-10 grid gap-5 lg:grid-cols-2">
      <div data-reveal class="rounded-card border border-hairline p-6">
        <p class="font-display text-[15px] font-semibold text-teal">What a department holds by the end of a semester</p>
        <ul class="mt-4 space-y-2.5">
          <li class="flex gap-3"><span aria-hidden="true" class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-hairline"></span><span class="text-[15px] leading-relaxed text-slate-body">Internal marks and end-semester results</span></li>
          <li class="flex gap-3"><span aria-hidden="true" class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-hairline"></span><span class="text-[15px] leading-relaxed text-slate-body">An attendance register</span></li>
          <li class="flex gap-3"><span aria-hidden="true" class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-hairline"></span><span class="text-[15px] leading-relaxed text-slate-body">Faculty impressions, shared in a review meeting</span></li>
          <li class="flex gap-3"><span aria-hidden="true" class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-hairline"></span><span class="text-[15px] leading-relaxed text-slate-body">A placement spreadsheet assembled in the final year</span></li>
        </ul>
      </div>
      <div data-reveal style="--reveal-delay: 60ms" class="rounded-card border border-hairline p-6">
        <p class="font-display text-[15px] font-semibold text-teal">What it needs by week four</p>
        <ul class="mt-4 space-y-2.5">
          <li class="flex gap-3"><span aria-hidden="true" class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal"></span><span class="text-[15px] leading-relaxed text-slate-body">Which students are drifting, and on which topics</span></li>
          <li class="flex gap-3"><span aria-hidden="true" class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal"></span><span class="text-[15px] leading-relaxed text-slate-body">Which concepts a cohort has not absorbed yet</span></li>
          <li class="flex gap-3"><span aria-hidden="true" class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal"></span><span class="text-[15px] leading-relaxed text-slate-body">Whether each course is on plan against the syllabus</span></li>
          <li class="flex gap-3"><span aria-hidden="true" class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal"></span><span class="text-[15px] leading-relaxed text-slate-body">Which employability skills are still missing, student by student</span></li>
        </ul>
      </div>
    </div>`,
});

const s3 = section({
  tone: "paper",
  children: `    ${sectionHead({
    eyebrow: "Who it is for",
    title: "Five roles, one record of what a student can do",
    lede: "A department, an academic office and a placement cell currently work from three different spreadsheets. They get one source instead, and each role sees the slice it is accountable for.",
  })}
    ${roleGrid([
      { role: "Students", line: "A tutor for the concept that did not land in class, and a skill profile that grows with each semester." },
      { role: "Faculty", line: "Course material, question banks and marking support drafted in minutes, approved by the faculty member before use." },
      { role: "HODs", line: "Syllabus coverage, cohort performance and the at-risk list for every course in the department." },
      { role: "Academic leadership", line: "Performance across departments and semesters, and whether last term's intervention actually moved anything." },
      { role: "Placement teams", line: "Placement readiness per student, built from skill assessments rather than from what a CV claims." },
    ])}`,
});

const s4 = section({
  tone: "white",
  children: `    ${sectionHead({
    eyebrow: "What it does",
    title: "Built around the semester, not around a content catalogue",
  })}
    ${benefitGrid([
      {
        benefit: "Find the students who are drifting while the semester can still be saved.",
        body: "Attendance, internal assessment and engagement are read together, so a student sliding in week four appears on a list rather than in the results in December.",
        feature: "At-risk student identification",
      },
      {
        benefit: "Know what a low internal score was actually caused by.",
        body: "Every question is tagged to the concept and skill it tests, so a weak result points at a specific topic — often one from an earlier semester — instead of a number.",
        feature: "Student performance analytics",
      },
      {
        benefit: "Give students patient help at the hour they actually study.",
        body: "An AI tutor that works from the course material the department teaches, explains a concept as many times as it takes, and saves the session so it becomes revision.",
        feature: "AI tutor",
      },
      {
        benefit: "Let faculty spend the week teaching rather than preparing.",
        body: "Question banks, course material and assessment drafts generated from the syllabus in use. The faculty member edits and approves before anything reaches a class.",
        feature: "AI faculty assistant",
      },
      {
        benefit: "Answer whether the syllabus was covered, course by course.",
        body: "Planned topics against delivered topics for each course and semester, visible to the HOD without anyone compiling a report the week before a review.",
        feature: "Syllabus tracking",
      },
      {
        benefit: "Send the placement cell evidence instead of a CV.",
        body: "Skill assessments mapped to the competencies recruiters screen for, so placement readiness is a measured profile per student and per cohort.",
        feature: "Employability tracking",
      },
    ])}`,
});

const s5 = section({
  tone: "ink",
  children: `    <div class="grid items-center gap-12 lg:grid-cols-[1fr_1fr]">
      <div>
        ${sectionHead({
          eyebrow: "Skills and employability",
          title: "Employability, measured each semester rather than asserted in the final year",
          lede: "A college is judged on placements, and a placement decision is made on what a student can demonstrate. GaugeSkills assesses the skills underneath the degree — aptitude, core subject depth, communication, applied problem solving — and keeps that profile current instead of reconstructing it in the last two months.",
          tone: "dark",
        })}
        <ul class="mt-8 space-y-3">
          <li class="flex gap-3"><span aria-hidden="true" class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan"></span><span class="text-[15px] leading-relaxed text-mist">Skill assessments mapped to the competencies recruiters screen on</span></li>
          <li class="flex gap-3"><span aria-hidden="true" class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan"></span><span class="text-[15px] leading-relaxed text-mist">A profile per student that updates every semester, not once before placements</span></li>
          <li class="flex gap-3"><span aria-hidden="true" class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan"></span><span class="text-[15px] leading-relaxed text-mist">Each gap returned as a practice path, so a student has something to do about it</span></li>
          <li class="flex gap-3"><span aria-hidden="true" class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan"></span><span class="text-[15px] leading-relaxed text-mist">Cohort readiness in the same academic analytics the HOD and placement team already read</span></li>
          <li class="flex gap-3"><span aria-hidden="true" class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan"></span><span class="text-[15px] leading-relaxed text-mist">Re-assessment after the path, so improvement is shown rather than claimed</span></li>
        </ul>
      </div>
      <div data-reveal class="rounded-card border border-white/10 bg-white/5 p-6">
        <p class="text-xs font-semibold uppercase tracking-[0.16em] text-cyan">Student skill profile</p>
        <p class="mt-1.5 text-[13px] text-mist">Semester 5 &middot; re-assessed each term</p>
        <ul class="mt-6 space-y-4">
          <li>
            <div class="flex items-baseline justify-between text-[14px]">
              <span class="font-medium text-white">Core subject depth</span>
              <span class="text-cyan">Level 4 of 5</span>
            </div>
            <div class="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
              <div data-bar style="--bar-width: 80%" class="h-full rounded-full bg-cyan"></div>
            </div>
          </li>
          <li>
            <div class="flex items-baseline justify-between text-[14px]">
              <span class="font-medium text-white">Communication</span>
              <span class="text-cyan">Level 3 of 5</span>
            </div>
            <div class="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
              <div data-bar style="--bar-width: 60%; --bar-delay: 90ms" class="h-full rounded-full bg-cyan"></div>
            </div>
          </li>
          <li>
            <div class="flex items-baseline justify-between text-[14px]">
              <span class="font-medium text-white">Applied problem solving</span>
              <span class="text-amber">Level 2 of 5</span>
            </div>
            <div class="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
              <div data-bar style="--bar-width: 40%; --bar-delay: 180ms" class="h-full rounded-full bg-amber"></div>
            </div>
          </li>
        </ul>
        <div class="mt-6 rounded-xl border border-cyan/25 bg-cyan/10 p-4">
          <p class="text-[13px] font-semibold uppercase tracking-[0.12em] text-cyan">Recommended next</p>
          <p class="mt-1.5 text-[14px] leading-relaxed text-white">Applied problem solving sits two levels below the roles this student is targeting. A practice path has been assigned, with re-assessment in four weeks.</p>
        </div>
        <p class="mt-4 text-[12px] text-mist">Illustrative interface. Not customer data.</p>
      </div>
    </div>`,
});

const s6 = section({
  tone: "paper",
  children: `    ${sectionHead({
    eyebrow: "Trust",
    title: "Academic records stay with the people accountable for them",
    lede: "A college holds academic history, attendance and now skill results that follow a student into their first job. Access is scoped by role — a faculty member sees their own courses, an HOD sees their own department, a student sees themselves — and each institution is an isolated tenant. Where an academic ERP is already in place, GaugeSkills reads from it over an agreed scope rather than asking a department to maintain the same list twice.",
  })}
    <div class="mt-8">
      <a href="${rel("/security")}" class="inline-flex items-center justify-center gap-2 rounded-full border border-hairline px-6 py-3 text-[15px] font-semibold text-ink transition-all duration-200 ease-out hover:border-teal hover:text-teal">Read the security detail</a>
    </div>`,
});

const s7 = section({
  tone: "white",
  children: `    ${sectionHead({ eyebrow: "Questions", title: "What academic teams ask first" })}
    ${faq(faqs)}`,
});

const s8 = ctaBand({
  title: "See it against one of your own departments",
  lede: "We would rather run the demo on a programme and a semester you recognise than give a generic tour. Tell us the department and the courses, and we will use those.",
  primary: { href: rel("/demo"), label: "Request a College Demo" },
  secondary: { href: rel("/ai-for-faculty"), label: "How the faculty assistant works" },
});

const s9 = relatedLinks(
  [
    { label: "At-risk students", path: "/at-risk-students", note: "Which signals flag a student early, and what the platform does with them." },
    { label: "Student performance analytics", path: "/student-performance-analytics", note: "Reading a result down to the concept that caused it." },
    { label: "For students", path: "/students", note: "The student view: tutor, practice and a skill profile." },
    { label: "For faculty", path: "/faculty", note: "What changes in a faculty member's week, and what does not." },
    { label: "For leadership", path: "/leadership", note: "Academic analytics across departments, programmes and semesters." },
    { label: "Learning paths", path: "/learning-paths", note: "Remediation scoped to the concepts a cohort failed together." },
  ],
  rel,
);

export const higherEducation = {
  out: "higher-education.html",
  canonical: "/higher-education",
  title: "AI-Powered Learning & Skills Platform for Colleges | GaugeSkills",
  description:
    "GaugeSkills helps colleges spot at-risk students early, track syllabus coverage, and turn a degree into skills employers can verify before placement.",
  ogImage: "og/higher-education.png",
  breadcrumbs: [{ name: "Higher Education", path: "/higher-education" }],
  schemaExtra: [faqPage(faqs)],
  body: [s1, s2, s3, s4, s5, s6, s7, s8, s9].join("\n"),
};
