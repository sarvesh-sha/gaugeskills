/**
 * AI at GaugeSkills.
 *
 * Two rules govern this page. First, every capability is described by what it
 * does for a person, because "AI content generation" is a feature and "a
 * teacher gets their evening back" is a reason to buy. Second, the limits are
 * a section, not a footnote: a page that only says what AI can do is not
 * credible to anyone who has run a pilot.
 */

import { linker } from "../layout.mjs";
import { faqPage } from "../seo.mjs";
import {
  benefitGrid,
  cardGrid,
  ctaBand,
  faq,
  hero,
  relatedLinks,
  section,
  sectionHead,
} from "../sections.mjs";
import { solutionById, solutions } from "../site.mjs";

const rel = linker("ai.html");

const faqs = [
  {
    q: "Does the AI tutor just give students the answer?",
    a: "No. It is built to explain, ask the next question and work through the step the learner is stuck on, using the material the institution actually teaches rather than the open internet. Sessions are saved, so a teacher can see where a student struggled and the student can use the conversation as revision.",
  },
  {
    q: "Who owns the content the AI generates?",
    a: "The educator does. Generated material arrives as a draft inside the content studio, and it stays unpublished until a teacher, faculty member or L&D owner edits and approves it. Nothing generated reaches a learner without a named person putting their name to it.",
  },
  {
    q: "Can the AI grade our examinations?",
    a: "It can score objective questions and give feedback on practice and formative work, which is where most of the marking time goes. It does not mark high-stakes examinations on its own. Anything that lands on a transcript or a promotion file is signed off by a human examiner.",
  },
  {
    q: "Can learners ask questions in their own language?",
    a: "The tutor holds a conversation in the language a learner is comfortable with, and answers from the institution's own material rather than translating a generic source. Which languages are enabled for a specific deployment is a question worth answering precisely in a technical session.",
  },
  {
    q: "Does any of this work without internet access?",
    a: "The platform installs as a progressive web app and the interface is built phone-first, so it is light on a weak connection. The AI features need connectivity. We would rather say that plainly than sell offline AI that does not exist.",
  },
];

const heroAside = `<div data-rise class="rounded-card border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
        <p class="text-xs font-semibold uppercase tracking-[0.16em] text-cyan">AI tutor session</p>
        <div class="mt-5 rounded-xl bg-ink/60 p-4">
          <p class="text-[13px] font-medium text-mist">Learner</p>
          <p class="mt-1.5 text-[15px] leading-relaxed text-white">I keep getting the second step wrong when I balance a chemical equation.</p>
        </div>
        <div class="mt-4 rounded-xl border border-cyan/25 bg-cyan/10 p-4">
          <p class="text-[13px] font-medium text-cyan">Tutor</p>
          <p class="mt-1.5 text-[15px] leading-relaxed text-white">Let us take your last attempt. Count the oxygen atoms on each side first, and tell me what you get before we change any coefficient.</p>
        </div>
        <div class="mt-4 rounded-xl border border-white/10 p-4">
          <p class="text-[13px] font-medium text-mist">Saved to the learner record</p>
          <p class="mt-1.5 text-[15px] leading-relaxed text-white">Concept flagged: balancing equations. Visible to the teacher in the class view.</p>
        </div>
        <p class="mt-4 text-[12px] text-mist">Illustrative interface. Not customer data.</p>
      </div>`;

/* ----------------------------------------------- the same capability, three ways */

/**
 * The section that stops this reading like a generic AI page. Same underlying
 * capability, written three times in three sets of words, because a principal,
 * a dean and a head of L&D do not share a vocabulary.
 */
function audienceExample({ id, situation, request, result, follow }, index) {
  const s = solutionById[id];

  return `      <li data-reveal style="--reveal-delay: ${index * 70}ms" class="group relative flex flex-col rounded-card border border-hairline bg-white p-6 shadow-soft">
        <span aria-hidden="true" class="h-1 w-12 rounded bg-cyan"></span>
        <h3 class="mt-5 text-2xl text-ink">${s.label}</h3>
        <p class="mt-2 text-[15px] leading-relaxed text-slate-body">${situation}</p>
        <div class="mt-6 rounded-xl bg-paper p-4">
          <p class="text-[12px] font-semibold uppercase tracking-[0.1em] text-teal">What they ask for</p>
          <p class="mt-1.5 text-[15px] leading-relaxed text-ink">${request}</p>
        </div>
        <div class="mt-4 rounded-xl border border-hairline p-4">
          <p class="text-[12px] font-semibold uppercase tracking-[0.1em] text-teal">What comes back</p>
          <p class="mt-1.5 text-[15px] leading-relaxed text-ink">${result}</p>
        </div>
        <p class="mt-5 grow text-[15px] leading-relaxed text-slate-body">${follow}</p>
        <a href="${rel(s.path)}" class="mt-6 inline-flex items-center gap-1.5 text-[15px] font-semibold text-teal">
          <span class="absolute inset-0" aria-hidden="true"></span>
          Explore ${s.label}
        </a>
      </li>`;
}

const audienceExamples = {
  schools: {
    situation:
      "A Grade 7 class has thirty-eight students and one teacher. Six of them have not understood equivalent fractions since last year.",
    request:
      "Draft a twenty-question practice set on equivalent fractions at three difficulty levels, tagged by concept.",
    result:
      "A draft set the teacher edits in the content studio and assigns that evening, with the easier tier going to the six students who need it.",
    follow:
      "The six students who struggle at home get the tutor instead of a parent who last did fractions in 1998. The teacher sees the sessions the next morning.",
  },
  "higher-education": {
    situation:
      "A B.Tech faculty member teaches four sections, and the placement team has started asking which students are ready for analyst interviews.",
    request:
      "Generate a question bank for the data structures module mapped to course outcomes, and summarise where Section B is falling behind Section A.",
    result:
      "A reviewed question bank plus a plain-language summary naming the two topics where Section B trails, with the affected students listed.",
    follow:
      "The same competency tags feed the placement view, so a readiness conversation starts from assessment evidence rather than a CV claim.",
  },
  enterprise: {
    situation:
      "An L&amp;D team of four supports twelve hundred engineers and has a reskilling budget that has to be defended in a board review.",
    request:
      "Build a scenario assessment for cloud architecture at level 3, and tell me which teams are furthest from what the role requires.",
    result:
      "A drafted assessment an internal expert reviews, and a ranked list of teams by gap size against the role standard.",
    follow:
      "Recommended paths are generated per person from the measured gap. The manager decides who takes them, and re-assessment shows what changed.",
  },
};

/* ----------------------------------------------------------------- sections */

const s1 = hero({
  eyebrow: "AI at GaugeSkills",
  h1: "AI-Powered Learning and Skills Intelligence",
  lede: "AI on GaugeSkills does the work nobody went into teaching or L&amp;D to do: drafting, marking practice, chasing patterns through data. It answers a learner at eleven at night and it hands a teacher a finished draft in the morning. What to teach, who needs help and what a result means stay human decisions.",
  primary: { href: rel("/demo"), label: "Book a Demo" },
  secondary: { href: rel("/ai-tutor"), label: "How the AI tutor works" },
  aside: heroAside,
});

const s2 = section({
  tone: "white",
  children: `    ${sectionHead({
    eyebrow: "The principle",
    title: "The AI drafts. A person decides.",
    lede: "Every AI output on the platform arrives as a draft attached to a named owner. That is a product constraint rather than a policy statement: generated material cannot reach a learner until somebody approves it, and generated analysis is presented as a signal to check rather than a conclusion to act on blindly.",
  })}
    ${cardGrid(
      [
        {
          title: "It works from your material",
          body: "The tutor and the content tools draw on the syllabus, courses and question banks the institution has loaded, not on whatever the open internet says about a topic.",
        },
        {
          title: "Nothing publishes itself",
          body: "A generated lesson, worksheet or assessment sits in review until a teacher, faculty member or L&D owner edits and approves it.",
        },
        {
          title: "The work is traceable",
          body: "Tutor sessions, generated drafts and the assessments behind a recommendation stay attached to the learner record, so a person can check the reasoning.",
        },
      ],
      { columns: 3 },
    )}`,
});

const s3 = section({
  tone: "paper",
  id: "ai-tutor",
  children: `    ${sectionHead({
    eyebrow: "AI tutor",
    title: "Answer a learner at eleven at night, patiently, in their own language",
    lede: "The hour a learner is actually stuck is rarely the hour a teacher is available. The tutor holds a conversation about the thing in front of them and keeps explaining until it lands.",
  })}
    ${benefitGrid(
      [
        {
          benefit: "Explain the same concept a fourth time without losing patience.",
          body: "The tutor re-explains from a different angle, works through the step the learner missed, and asks a question back instead of handing over the finished answer.",
          feature: "Conversational tutoring",
        },
        {
          benefit: "Keep the help inside what the institution actually teaches.",
          body: "Answers are grounded in the loaded syllabus, course material and question banks, so a learner is not revising from a source their examiner has never seen.",
          feature: "Grounded in your content",
        },
        {
          benefit: "Turn a late-night session into revision material and a teaching signal.",
          body: "Sessions are saved to the learner record. The student revisits them before an exam. The teacher sees which concept came up and who kept returning to it.",
          feature: "Saved sessions",
        },
      ],
      { columns: 3 },
    )}
    <p data-reveal class="mt-10 max-w-3xl text-[15px] leading-relaxed text-slate-body">
      There is a longer piece on how the tutor behaves, including what it refuses to do when a learner asks for the
      answer outright.
      <a href="${rel("/ai-tutor")}" class="font-semibold text-teal underline-offset-4 hover:underline">Read about the AI tutor</a>.
    </p>`,
});

const s4 = section({
  tone: "white",
  children: `    ${sectionHead({
    eyebrow: "AI assistant",
    title: "Give teachers, faculty and L&amp;D teams back the hours that were never teaching",
    lede: "Preparation, summarising, chasing a list out of a spreadsheet. The assistant takes the clerical half of the job and leaves the professional half alone.",
  })}
    ${benefitGrid(
      [
        {
          benefit: "Prepare tomorrow in minutes instead of an evening.",
          body: "Ask for a lesson outline, a revision sheet or a set of discussion prompts for a specific class, and edit what comes back rather than starting from an empty page.",
          feature: "Preparation co-pilot",
        },
        {
          benefit: "Find out who needs attention without building a report.",
          body: "Ask a question of your own class, department or team in plain language and get the cohort, the trend or the shortlist of people behind it.",
          feature: "Ask the data",
        },
        {
          benefit: "Write to thirty parents or three teams without writing it thirty times.",
          body: "Drafted summaries and announcements pulled from the actual record, which the sender reviews before anything goes out.",
          feature: "Drafted communication",
        },
      ],
      { columns: 3 },
    )}
    <p data-reveal class="mt-10 max-w-3xl text-[15px] leading-relaxed text-slate-body">
      Faculty have a specific version of this, built around courses, sections and semester pacing.
      <a href="${rel("/ai-for-faculty")}" class="font-semibold text-teal underline-offset-4 hover:underline">See how faculty use it</a>.
    </p>`,
});

const s5 = section({
  tone: "ink",
  children: `    ${sectionHead({
    eyebrow: "AI content generation",
    title: "Help teachers and faculty create quality learning content faster",
    lede: "The content studio turns a syllabus reference into a draft — a lesson, a worksheet, a set of notes, a diagram. The draft is the starting point of the educator's work, not a replacement for it.",
    tone: "dark",
  })}
    ${cardGrid(
      [
        {
          title: "From syllabus to draft",
          body: "Point at a chapter or a learning outcome and get structured material back in minutes, written for the level of the class in front of you.",
        },
        {
          title: "Three versions of the same lesson",
          body: "The same content pitched at different levels, so a mixed-ability class does not have to be taught as if it were one ability.",
        },
        {
          title: "Edit, reject, rewrite",
          body: "Everything lands in the content studio as an editable draft. Reject it, change it, or keep two paragraphs and write the rest yourself.",
        },
        {
          title: "Approval before publication",
          body: "Material is unpublished until an educator approves it. Authorship and accountability stay with the person, which is the point.",
        },
      ],
      { columns: 4, tone: "dark" },
    )}`,
});

const s6 = section({
  tone: "white",
  children: `    ${sectionHead({
    eyebrow: "AI assessment",
    title: "Write assessments that test the right thing, and mark the practice for you",
    lede: "A question that is not mapped to a concept produces a mark and nothing else. Generated questions carry the concept or competency they measure, which is what makes the result usable afterwards.",
  })}
    ${benefitGrid(
      [
        {
          benefit: "Build a question set for a chapter in the time it takes to find last year's.",
          body: "Questions generated against a chapter, a course outcome or a competency, at the difficulty spread you ask for, then reviewed before use.",
          feature: "Assessment generation",
        },
        {
          benefit: "Get a diagnostic result rather than a score.",
          body: "Every item carries the concept it tests, so the report says which idea broke and which learners share that gap instead of returning an average.",
          feature: "Concept mapping",
        },
        {
          benefit: "Stop marking practice by hand at the weekend.",
          body: "Objective questions are scored automatically and written work receives draft feedback the educator edits. High-stakes marking stays with the examiner.",
          feature: "Assisted marking",
        },
      ],
      { columns: 3 },
    )}`,
});

const s7 = section({
  tone: "paper",
  children: `    ${sectionHead({
    eyebrow: "AI recommendations",
    title: "Tell a learner what to do next, not just how they scored",
    lede: "A result is only useful if something follows it. Recommendations convert a measured gap into a specific next action for the learner, and a specific next decision for the person responsible for them.",
  })}
    ${cardGrid(
      [
        {
          title: "For the learner",
          body: "The chapter to revisit, the practice set to run, the module to take next, ordered by what is actually blocking progress.",
        },
        {
          title: "For the educator",
          body: "Which learners to pull into a remedial session, and which concept to reteach to the group rather than repeat individually.",
        },
        {
          title: "For the organization",
          body: "Which skills are thin across a department or a workforce, so training spend follows measured gaps rather than last year's plan.",
        },
      ],
      { columns: 3 },
    )}
    <p data-reveal class="mt-10 max-w-3xl text-[15px] leading-relaxed text-slate-body">
      Recommendations are built on measured skill levels rather than declared interests.
      <a href="${rel("/skills")}" class="font-semibold text-teal underline-offset-4 hover:underline">How a skill level is established</a>.
    </p>`,
});

const s8 = section({
  tone: "white",
  children: `    ${sectionHead({
    eyebrow: "AI analytics",
    title: "Ask the question instead of commissioning the report",
    lede: "Most institutions already hold the data that would answer the question. What they lack is somebody with three free hours and a spreadsheet. AI analytics closes that distance.",
  })}
    ${benefitGrid(
      [
        {
          benefit: "Get an answer in the meeting rather than after it.",
          body: "Ask in plain language which cohort is behind, which course dropped this term or which team is short of a skill, and get the list rather than a chart to interpret.",
          feature: "Natural-language queries",
        },
        {
          benefit: "See the trend stated, not buried in a table.",
          body: "Summaries describe what moved and what did not, with the underlying records one click away so the claim can be checked.",
          feature: "Summarised insights",
        },
        {
          benefit: "Know which signals deserve attention this week.",
          body: "Early warnings on attendance, assessment and engagement are ranked, so a head of department gets a shortlist rather than an alert feed.",
          feature: "Ranked early warnings",
        },
      ],
      { columns: 3 },
    )}
    <p data-reveal class="mt-10 max-w-3xl text-[15px] leading-relaxed text-slate-body">
      The analytics layer this runs on is part of the wider platform.
      <a href="${rel("/platform")}" class="font-semibold text-teal underline-offset-4 hover:underline">See the full platform</a>.
    </p>`,
});

const s9 = section({
  tone: "ink",
  children: `    ${sectionHead({
    eyebrow: "Three markets, three vocabularies",
    title: "The same AI, described in the words each audience uses",
    lede: "A principal, a dean and a head of L&amp;D are solving different problems with the same underlying capability. Below is what a week with the AI layer looks like in each, in that market's own language.",
    tone: "dark",
  })}
    <ul class="mt-12 grid gap-6 lg:grid-cols-3">
${solutions.map((s, i) => audienceExample({ id: s.id, ...audienceExamples[s.id] }, i)).join("\n")}
    </ul>`,
});

const s10 = section({
  tone: "white",
  id: "limits",
  children: `    ${sectionHead({
    eyebrow: "Limits",
    title: "What GaugeSkills AI deliberately does not do",
    lede: "This list exists because the alternative is a pilot where somebody discovers it during rollout. These are design decisions, not gaps waiting for the next release.",
  })}
    <ul class="mt-12 grid gap-5 sm:grid-cols-2">
      <li data-reveal class="rounded-card border border-hairline bg-paper p-6">
        <h3 class="text-[19px] font-semibold leading-snug text-ink">It does not mark high-stakes examinations on its own.</h3>
        <p class="mt-3 text-[15px] leading-relaxed text-slate-body">Objective questions are scored automatically and written practice gets draft feedback. Anything that reaches a transcript is marked or confirmed by a human examiner, because the person whose record it is deserves an accountable name behind the grade.</p>
      </li>
      <li data-reveal style="--reveal-delay: 60ms" class="rounded-card border border-hairline bg-paper p-6">
        <h3 class="text-[19px] font-semibold leading-snug text-ink">It does not make hiring or promotion decisions.</h3>
        <p class="mt-3 text-[15px] leading-relaxed text-slate-body">Skill evidence is an input a manager or an HR team reads. The platform will show that a person is two levels below what a role requires. It will not recommend who is promoted, moved or let go, and it is not built to be used that way.</p>
      </li>
      <li data-reveal class="rounded-card border border-hairline bg-paper p-6">
        <h3 class="text-[19px] font-semibold leading-snug text-ink">It does not present output as fact without human sign-off.</h3>
        <p class="mt-3 text-[15px] leading-relaxed text-slate-body">Generated content is a draft until an educator approves it, and generated analysis is a signal with its underlying records attached. AI can be confidently wrong. The workflow is built on the assumption that it sometimes will be.</p>
      </li>
      <li data-reveal style="--reveal-delay: 60ms" class="rounded-card border border-hairline bg-paper p-6">
        <h3 class="text-[19px] font-semibold leading-snug text-ink">It does not work offline.</h3>
        <p class="mt-3 text-[15px] leading-relaxed text-slate-body">The platform installs as a progressive web app and is light on a weak connection, but the AI features need connectivity. If your learners routinely have none, the tutor is not the part of the platform that will help them.</p>
      </li>
      <li data-reveal class="rounded-card border border-hairline bg-paper p-6 sm:col-span-2">
        <h3 class="text-[19px] font-semibold leading-snug text-ink">It does not decide what should be taught.</h3>
        <p class="mt-3 text-[15px] leading-relaxed text-slate-body">Curriculum, pacing, standards and judgement about a particular learner belong to the teacher, the faculty member and the L&amp;D owner. The AI removes the hours around those decisions. It does not take the decisions, and a product that claimed otherwise would be asking you to trust it with something it cannot carry.</p>
      </li>
    </ul>`,
});

const s11 = section({
  tone: "paper",
  id: "faq",
  children: `    ${sectionHead({ eyebrow: "Questions", title: "What people ask about the AI" })}
    ${faq(faqs)}`,
});

const s12 = ctaBand({
  title: "See the AI on your own material",
  lede: "Bring a chapter, a course outcome or a role standard you already use. A demo built on your content tells you far more about whether this works than a scripted tour does.",
  primary: { href: rel("/demo"), label: "Book a Demo" },
  secondary: { href: rel("/platform"), label: "Explore the platform" },
});

const s13 = relatedLinks(
  [
    { label: "AI tutor", path: "/ai-tutor", note: "How the tutor teaches, and what it refuses to do." },
    { label: "AI for faculty", path: "/ai-for-faculty", note: "The co-pilot built around courses, sections and semester pacing." },
    { label: "AI quiz generator", path: "/ai-quiz-generator", note: "Blueprints, item quality and the review step before publishing." },
    { label: "The platform", path: "/platform", note: "The layer the AI reads from and writes back to." },
    { label: "Higher Education", path: "/higher-education", note: "AI for colleges: faculty workload, at-risk students, placement readiness." },
    { label: "Enterprise", path: "/enterprise", note: "AI for workforce skills, gap analysis and reskilling paths." },
  ],
  rel,
);

export const ai = {
  out: "ai.html",
  canonical: "/ai",
  title: "AI for Learning, Teaching & Workforce Skills | GaugeSkills",
  description:
    "An AI tutor for learners, an assistant for teachers and faculty, and generated content and assessments. Plus a clear account of what our AI will not do.",
  ogImage: "og/ai.png",
  breadcrumbs: [{ name: "AI", path: "/ai" }],
  schemaExtra: [faqPage(faqs)],
  body: [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13].join("\n"),
};
