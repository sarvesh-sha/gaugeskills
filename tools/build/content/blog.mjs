/**
 * The blog: one index, four category hubs and the articles beneath them.
 *
 * Posts are declared once in `posts`. Every listing — the index, the category
 * hub, the breadcrumb trail, the schema — is derived from that array, so a new
 * article is registered in exactly one place.
 *
 * Two authoring conventions hold throughout this file:
 *
 * 1. `title` and `description` are plain text, because the layout escapes them
 *    on the way into <title>, meta tags and JSON-LD. `standfirst` and article
 *    prose are HTML fragments and carry their own entities.
 * 2. Article prose is emitted through small element helpers that put explicit
 *    classes on every tag, rather than arbitrary child variants on a wrapper.
 *    There is no typography plugin in this build, and explicit classes are what
 *    the Tailwind scanner reliably sees in the generated HTML.
 */

import { linker } from "../layout.mjs";
import { article } from "../seo.mjs";
import { blogCategories, esc } from "../site.mjs";
import { breadcrumbs, ctaBand, hero, relatedLinks, section, sectionHead } from "../sections.mjs";

const categoryById = Object.fromEntries(blogCategories.map((c) => [c.id, c]));

/* ---------------------------------------------------------------- helpers */

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/**
 * Format an ISO date without Intl, so the build produces identical output on
 * any machine regardless of the ICU data Node was compiled with.
 *
 * @param {string} iso Date as `YYYY-MM-DD`.
 */
function formatDate(iso) {
  const [year, month, day] = iso.split("-").map(Number);
  return `${day} ${MONTHS[month - 1]} ${year}`;
}

/** Approximate word count of an HTML fragment. Entities count as one word. */
function wordCount(html) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/g, "e")
    .split(/\s+/)
    .filter(Boolean).length;
}

/** Reading time in whole minutes, derived from the prose rather than guessed. */
const readingTime = (html) => Math.max(1, Math.round(wordCount(html) / 220));

/** Stagger helper, matching the rhythm used by the shared card grids. */
const delay = (i) => (i % 2 ? ' style="--reveal-delay: 60ms"' : "");

const postPath = (slug) => `/blog/${slug}`;

/* ------------------------------------------------------- prose primitives */

const PROSE_LINK = "font-medium text-teal underline decoration-teal/40 underline-offset-4 transition-colors hover:decoration-teal";

const h2 = (text) => `      <h2 class="mt-12 text-[1.6rem] leading-snug text-ink md:text-[1.75rem]">${text}</h2>`;

const h3 = (text) => `      <h3 class="mt-8 text-[19px] font-semibold leading-snug text-ink">${text}</h3>`;

const p = (html) => `      <p class="mt-5">${html}</p>`;

const ul = (items) => `      <ul class="mt-5 space-y-2 pl-5">
${items.map((item) => `        <li class="list-disc">${item}</li>`).join("\n")}
      </ul>`;

/** Readable measure for long-form text. Everything inside is plain markup. */
const prose = (blocks) => `<section class="bg-white pb-16 pt-10 md:pb-24">
  <div class="container-page">
    <div class="mx-auto max-w-[46rem] text-[17px] leading-[1.75] text-slate-body">
${blocks.join("\n")}
    </div>
  </div>
</section>`;

/** Byline strip. The organization is the author; no person is invented. */
const byline = ({ published, category, minutes, rel }) => `<section class="bg-white pt-10">
  <div class="container-page">
    <div class="mx-auto flex max-w-[46rem] flex-wrap items-center gap-x-3 gap-y-1 border-b border-hairline pb-5 text-[14px] text-slate-body">
      <span class="font-semibold text-ink">GaugeSkills</span>
      <span aria-hidden="true" class="text-hairline">/</span>
      <time datetime="${published}">${formatDate(published)}</time>
      <span aria-hidden="true" class="text-hairline">/</span>
      <a href="${rel(postPath(category.id))}" class="text-teal underline-offset-4 hover:underline">${esc(category.label)}</a>
      <span aria-hidden="true" class="text-hairline">/</span>
      <span>${minutes} min read</span>
    </div>
  </div>
</section>`;

/* ----------------------------------------------------- listing components */

/** One article card. Used identically on the index and on category hubs. */
function postCard(post, rel, i) {
  const category = categoryById[post.category];

  return `      <li data-reveal${delay(i)} class="group relative flex flex-col rounded-card border border-hairline bg-white p-6 shadow-soft transition-all duration-200 hover:-translate-y-1 hover:shadow-lift">
        <div class="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[13px] text-slate-body">
          <span class="font-semibold uppercase tracking-[0.14em] text-teal">${esc(category.label)}</span>
          <span aria-hidden="true" class="text-hairline">/</span>
          <time datetime="${post.published}">${formatDate(post.published)}</time>
        </div>
        <h3 class="mt-3 text-[21px] leading-snug text-ink">
          <a href="${rel(postPath(post.slug))}"><span class="absolute inset-0" aria-hidden="true"></span>${esc(post.title)}</a>
        </h3>
        <p class="mt-3 grow text-[15px] leading-relaxed text-slate-body">${post.standfirst}</p>
        <p class="mt-5 text-[15px] font-semibold text-teal">Read the article</p>
      </li>`;
}

const postList = (items, rel, { columns = 2 } = {}) => `<ul class="mt-12 grid gap-5 ${columns === 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "md:grid-cols-2"}">
${items.map((post, i) => postCard(post, rel, i)).join("\n")}
    </ul>`;

/** Category tiles for the index. Each links to a real hub, not an anchor. */
function categoryCards(rel) {
  return `<ul class="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
${blogCategories
  .map((category, i) => {
    const count = posts.filter((post) => post.category === category.id).length;
    return `      <li data-reveal${delay(i)} class="group relative flex flex-col rounded-card border border-hairline bg-white p-6 transition-colors hover:border-teal">
        <h3 class="text-[17px] font-semibold text-ink">
          <a href="${rel(postPath(category.id))}"><span class="absolute inset-0" aria-hidden="true"></span>${esc(category.label)}</a>
        </h3>
        <p class="mt-2 grow text-[15px] leading-relaxed text-slate-body">${esc(category.blurb)}</p>
        <p class="mt-4 text-[13px] font-semibold uppercase tracking-[0.14em] text-teal">${count} article${count === 1 ? "" : "s"}</p>
      </li>`;
  })
  .join("\n")}
    </ul>`;
}

/* ------------------------------------------------------------ article one */

const aiInSchools = (a) => [
  p(`A Grade 8 science teacher is handed a new AI tool in a Monday staff meeting. The demonstration runs fifteen minutes, the phrase &ldquo;saves hours every week&rdquo; is used twice, and there is a login sheet by the door. By Thursday the tool has been opened by four people out of thirty, three of whom were presenting it. Nobody is being obstructive. The tool simply did not touch anything that was actually on those teachers&rsquo; desks that week.`),
  p(`That pattern is the most reliable thing about AI in schools right now, and it is a useful filter. The tools that survive a term do one narrow thing: they take work an adult is already doing slowly, do a passable first version of it, and hand it back in a form the adult can still argue with. The tools that die ask a teacher to change how they teach in exchange for a benefit that arrives, if at all, next year.`),

  h2(`Three things that genuinely work`),

  h3(`Drafting the material nobody enjoys making`),
  p(`Producing twenty questions on the water cycle at three difficulty levels is not intellectually demanding work. It is slow, repetitive, and it happens on a Sunday evening. A model does it in under a minute, and the quality bar it has to clear is not &ldquo;better than a good teacher with unlimited time&rdquo; &mdash; it is &ldquo;better than the question bank that has not been touched in four years&rdquo;. That is a bar it clears easily.`),
  p(`Two conditions decide whether this actually helps. The output has to be editable and rejectable, so authorship stays with the teacher rather than being quietly transferred to a vendor. And the questions have to be tagged with the concept each one tests, because that tagging is what makes the results diagnostic later instead of just a column of marks. If you are evaluating something in this space, ${a("/ai-for-faculty", "how the assistant hands work back to the teacher")} matters more than how impressive the generation demo looks.`),

  h3(`Explaining the same thing for the fifth time, at nine in the evening`),
  p(`The value here is not intelligence. It is patience and availability. A student whose parent can explain simultaneous equations loses nothing when the school day ends. A student whose parent cannot loses the entire evening. That gap is one of the largest and least discussed differences between two children in the same classroom, and it is one of the few things software is genuinely well shaped to reduce.`),
  p(`The design constraints are strict, though. It has to explain rather than supply finished answers, it has to work from the material the school actually teaches rather than whatever the open internet contains, and the session has to leave a record the teacher can look at. A tutor that quietly does the homework is worse than no tutor, because it also removes the signal the teacher would have used to spot the problem. Those constraints are the whole design question behind ${a("/ai-tutor", "an AI tutor that is worth putting in front of children")}.`),

  h3(`Turning results into something you can act on`),
  p(`The distance between &ldquo;37 per cent&rdquo; and &ldquo;she cannot subtract fractions with unlike denominators&rdquo; is the distance between a report and an instruction. Closing it is mechanical work: map items to concepts, group students who failed the same concept, order those groups by how much downstream content depends on the broken idea. It is exactly the sort of boring, high-volume bookkeeping that should be automated, and it is far more valuable to a school than anything generative. This is the part of ${a("/schools", "an AI platform for schools")} that changes what happens on Monday.`),

  h2(`Three things that are still mostly marketing`),

  h3(`&ldquo;Personalized learning&rdquo; that is a branching quiz`),
  p(`Personalization has a testable meaning: the next thing a student does is chosen because of what they specifically got wrong. Much of what is sold under the word is a two-branch decision tree sitting on top of a video library, which serves easier content to students who score badly and harder content to students who score well. That is streaming with a shorter feedback loop.`),
  p(`There is a question that separates the two quickly. Ask what the system does for a Grade 9 student whose real problem is a Grade 5 gap. If the answer involves more Grade 9 practice, delivered more slowly, the system cannot reach the actual break. A path worth the name goes backwards to the prerequisite and then returns.`),

  h3(`Engagement and attention scoring`),
  p(`Camera-based attention detection and time-on-page metrics measure compliance and household bandwidth. A student reading a paragraph three times because it is difficult looks identical to a student who has wandered off, and a student who understood it immediately looks disengaged. Beyond the measurement problem there is a behavioural one: once children know attention is scored, they perform attention. And the privacy cost of continuous observation of minors is not a footnote &mdash; it is the main term in the equation.`),

  h3(`Risk scores with nothing behind them`),
  p(`A flag that says a student is at risk without saying which evidence produced it cannot be acted on, cannot be challenged by the teacher who knows the child, and cannot be corrected when it is wrong. It also has a habit of hardening into a label that follows a student between teachers. A risk indicator is only defensible when the reasons sit one click away and the recommended action is specific, which is the standard worth holding ${a("/at-risk-students", "any early-warning system")} to.`),

  h2(`How to tell the difference before you sign`),
  p(`Most of the useful diligence questions are unglamorous:`),
  ul([
    `Which specific task disappears from someone&rsquo;s week, and whose week is it?`,
    `What happens when the model is wrong? Who sees the error first, and what does it cost to fix?`,
    `Is the content mapped to the syllabus you teach, or to a generic library?`,
    `Can a teacher see the evidence behind every number shown to them?`,
    `What does the school keep if the contract ends &mdash; the content, the assessment data, the concept mapping?`,
  ]),
  p(`Then run it on one real class for one term, with one measure agreed in advance. Teacher hours spent on preparation is a good measure because it is honest and easy to collect. Re-assessment on the same concepts eight weeks later is better, because it is the only one that speaks to learning rather than convenience.`),

  h2(`The part no tool fixes`),
  p(`Adoption follows workload relief. A school that adds a platform without removing anything has issued an instruction, not made a change, and instructions produce logins rather than use. The tools that stick are the ones a teacher would open on a Thursday without being asked, because the alternative is doing the same task by hand.`),
  p(`None of the cases that work require believing anything dramatic about artificial intelligence. They require being specific about which parts of a teacher&rsquo;s week are worth machine effort, and honest about which parts are not. The second list is longer than most vendors admit, and being clear about it is the fastest way to find the tools that will still be in use in March.`),
];

/* ------------------------------------------------------------ article two */

const aiTeachingAssistant = (a) => [
  p(`A lecturer is teaching three sections of the same second-year course, a little under two hundred students between them. The internal exam is nine days away, the question bank has not changed in four years, and last year&rsquo;s paper is already circulating as a photograph in a student group. She needs fresh items, mapped to the same learning outcomes, at three difficulty levels, by Friday. She also has a laboratory to supervise and a set of project proposals to read.`),
  p(`This is the situation an AI assistant is genuinely good for, and it is the one most conversations about AI in higher education walk straight past on their way to arguing about whether a machine can teach. It cannot. The interesting question is narrower and more useful: which parts of the work surrounding teaching can be compressed, and what becomes of the parts that cannot.`),

  h2(`What it does well`),

  h3(`First drafts of assessment material`),
  p(`Generating variants of a question, drafting plausible distractors, producing a rubric skeleton, mapping items back to outcomes: this is structured, repetitive work with a clear specification. A draft that needs twenty minutes of editing has still replaced three hours. The honest comparison is not between the model and an ideal exam paper written over a fortnight. It is between the model and reusing last year&rsquo;s paper, which is what actually happens when the week runs out.`),

  h3(`Turning one artefact into several`),
  p(`A set of lecture notes can become a revision sheet, a worked example, a short diagnostic quiz, a slide outline, and a plain-language version for students studying in their second or third language. Each of those has real teaching value and almost none of them get made, because they are translation work rather than thinking work, and translation work is the first thing a busy term deletes.`),

  h3(`Reading a cohort faster than a spreadsheet does`),
  p(`After an exam, the interesting fact is rarely the mean. It is that twenty-two students lost the same two marks at the same step, which usually means one explanation in week four did not land. Clustering wrong answers by the misconception behind them, rather than by the score, turns a marksheet into a teaching instruction. That is the whole point of ${a("/student-performance-analytics", "analytics that sit close to the assessment")} rather than on top of a grade export.`),

  h3(`Answering the same question for the fifth time at eleven at night`),
  p(`Faculty attention is not infinitely divisible, and the marginal value of a professor explaining a submission format for the fifth time is close to zero. Routine explanation, revision prompts and worked practice are well suited to ${a("/ai-tutor", "a tutor that runs outside office hours")}, provided the record of what students asked comes back to the teacher. The questions a cohort asks at midnight are a better curriculum diagnostic than most formal feedback forms.`),

  h2(`What it cannot do`),

  h3(`Know the class`),
  p(`The assistant does not know that this cohort came through two disrupted school years, that the Thursday afternoon lab is the one where attendance collapses, or that the quiet student in the third row is the strongest mathematician in the room and simply will not speak. That knowledge is accumulated by a person standing in front of other people, and it is the input that determines what should be taught next week.`),

  h3(`Decide what matters`),
  p(`Every syllabus is longer than every semester. Deciding what to cut when two weeks are lost is a judgment about the discipline, about what these particular students will need in three years, and about what the next course assumes. A model can list options. It has no stake in the outcome and no view of the discipline, which is precisely what the decision requires.`),

  h3(`Own the grade`),
  p(`A mark is an institutional claim about a person, and responsibility for it is not delegable. Machine pre-marking is reasonable for structured items and useful as a first pass on written work, where it can flag likely misreadings and inconsistencies for a human to check. What follows has to be a person reading, deciding and signing. An institution that quietly moves that line will find out where it was the first time a grade is formally challenged.`),

  h3(`Notice the student who has gone quiet`),
  p(`Analytics will flag a drop in submissions, and that is worth having. What it cannot do is tell the difference between a student who has disengaged, one who is unwell, and one who is dealing with something at home. It also cannot make the approach feel like concern rather than surveillance. The flag is the cheap part; the conversation is the part that works, which is why ${a("/at-risk-students", "early-warning systems")} should be designed to produce a named owner rather than a colour on a chart.`),

  h2(`Where faculty rollouts actually fail`),
  p(`Almost never because of model capability. Three patterns account for most of it:`),
  ul([
    `<strong class="font-semibold text-ink">The mandate without the relief.</strong> A tool is added to a workload from which nothing has been removed. Faculty read that correctly as more work and respond accordingly.`,
    `<strong class="font-semibold text-ink">The tool that lives outside the workflow.</strong> A separate login, no connection to the course, no link from the system where teaching is already administered. Anything that requires a detour gets used during the pilot and abandoned after it, which is why single sign-on and course-level integration matter more than they sound.`,
    `<strong class="font-semibold text-ink">Unstated rules.</strong> If nobody has said whether using the assistant is permitted, whether student work processed through it leaves the institution, or whether anything it records can appear in a performance review, cautious academics will simply not open it. The answer to the last question should be no, and it should be in writing.`,
  ]),

  h2(`A division of labour worth defending`),
  p(`The assistant drafts; the academic decides. It produces candidate questions; the academic chooses which test the thing that matters. It summarizes where a cohort went wrong; the academic decides whether to reteach, move on, or change the assessment. It answers the routine question at midnight; the academic handles the one that reveals a misconception worth a whole lecture.`),
  p(`Framed that way, the technology stops being a threat to expertise and becomes what it actually is: a way of spending less of a scarce, expensive, slow-to-train person on work that does not need them. That framing is also the one that survives contact with a faculty senate, which is not a small consideration. If you are working out where to draw that line for your own institution, start with ${a("/ai-for-faculty", "what the assistant is allowed to do unsupervised")} and work outwards from there, then look at how it fits the rest of ${a("/higher-education", "the academic operation")}.`),
];

/* ---------------------------------------------------------- article three */

const competencyManagement = (a) => [
  p(`Somewhere in most large organizations there is a competency framework with several hundred entries. It was commissioned a few years ago, delivered as a PDF and a spreadsheet, launched with a communications plan, and is now consulted once a year during appraisal season by the people who remember it exists. Nobody defends it. Nobody deletes it either, because deleting it would require admitting what it cost.`),
  p(`The framework was not wrong. It was built as a description of the organization when it needed to be an instrument for making decisions, and those two things have almost nothing in common.`),

  h2(`The test a framework has to pass`),
  p(`For every entry, someone should be able to name the decision it informs. Staffing a project. Approving training spend. Deciding whether to hire or develop. Deciding who is allowed to sign off a piece of work. Deciding what a promotion actually requires, in terms specific enough that two managers would reach the same conclusion.`),
  p(`If no decision can be named, the entry is documentation. Documentation is not worthless, but it does not justify the cost of keeping it current, and in practice it will not be kept current. A framework of two hundred entries where sixty inform decisions is worse than a framework of sixty, because the ratio teaches everyone to ignore the whole thing.`),

  h2(`Why the four-hundred-item framework dies`),
  ul([
    `Nobody can hold it in their head. A manager who cannot recall the vocabulary falls back on their own, and within two quarters the organization has as many frameworks as it has managers.`,
    `The granularity does not hold. Frameworks routinely list &ldquo;communication&rdquo; and &ldquo;configuring OAuth flows&rdquo; as peers. One is a career, the other is an afternoon.`,
    `Ratings are annual and self-reported, so the data is a negotiation rather than evidence. Everyone learns the score that produces the outcome they want.`,
    `There is no owner. Entries persist for tools that were retired two years ago, and nothing new gets added without a project.`,
    `It is disconnected from anything anyone does weekly, which means it competes with real work and loses.`,
  ]),

  h2(`What to build instead`),

  h3(`Start from roles, not from the organization chart`),
  p(`A role profile with eight to twelve competencies is usable. A person can read it, recognise themselves in it, and see what the next role requires. Build those profiles for the job families where staffing decisions are painful today, and leave the rest alone until someone asks. Resisting the enterprise-wide launch is the single highest-value decision in this whole exercise, and it is the one most programmes get wrong.`),

  h3(`Describe behaviour, not adjectives`),
  p(`&ldquo;Advanced stakeholder management&rdquo; means whatever the reader wants it to mean. &ldquo;Can run a requirements workshop with a client who disagrees internally, and leave with a written scope both sides accept&rdquo; can be observed, disputed, and evidenced. The levels underneath each competency need the same treatment, which is a longer subject in its own right &mdash; ${a("/blog/skill-levels-that-mean-something", "defining levels that mean something")} is where most frameworks quietly fall apart.`),

  h3(`Get evidence from work, not from a form`),
  p(`A rating should carry a source and a date: an assessment result, a manager observation against a defined checklist, a piece of delivered work, a verified credential. Once every rating has provenance, disagreements become productive, because two people are arguing about evidence rather than about each other&rsquo;s judgment. This is the difference between a survey and ${a("/employee-skill-assessment", "measured skill data")}, and it is the difference that decides whether anyone trusts the output.`),

  h3(`Give it an owner and a release cycle`),
  p(`A framework is a product. It needs a named owner, a version number, a change window a few times a year, a deprecation path for entries being retired, and a mapping from the old vocabulary to the new so historical data survives the change. Without a release process, the framework is accurate on launch day and decaying from the day after.`),

  h2(`The manager test`),
  p(`Two months after launch, take a real question to a line manager: there is a data migration for a regulated client starting next quarter, and you need two people who can run it. If the system answers that question with names, evidence and gaps, the framework is alive. If the manager answers from memory and then updates the system afterwards to match, you have built a record-keeping obligation.`),
  p(`The same test applies to development. A person who asks what they would need to reach the next role should get a specific, short, ordered answer &mdash; not a list of twenty competencies at level three. Reducing that answer to the two or three things that actually block progression is what ${a("/skills-gap-analysis", "gap analysis")} is for, and it is the moment most people first find the framework useful rather than administrative.`),

  h2(`What to give up`),
  p(`Some precision, deliberately. A coarse framework that managers use beats a precise one they route around, and the fastest way to lose adoption is to demand a level of detail that only the people who wrote it can sustain. Complete coverage is also worth giving up early. Starting with the job families where hiring is hardest produces evidence of value; starting everywhere produces a two-year programme with a steering committee.`),
  p(`Underneath all of this is a single idea. Competency management is not an inventory exercise, it is a decision-support system that happens to be built out of vocabulary. Judge it the way you would judge any other system: by whether the decisions it touches get made faster, more consistently, and with fewer surprises six months later. If you are rebuilding one, ${a("/enterprise", "the workforce side of the platform")} is designed around that assumption rather than around annual reporting.`),
];

/* ----------------------------------------------------------- article four */

const measuringTraining = (a) => [
  p(`The quarterly learning review opens with a slide showing near-total course completion and a satisfaction score close to the top of the scale. It is structurally the same slide as last quarter. Nobody in the room disputes it, and nobody in the room can say what is different in the work because of any of it. Twenty minutes later the conversation moves on to next year&rsquo;s budget, which will be defended with the same slide.`),
  p(`Completion measures attendance. Satisfaction measures the room, the delivery and, more than anyone likes to admit, the catering. Both are worth knowing. Neither is evidence that anybody can do something they could not do before.`),

  h2(`Why the easy metrics persist`),
  p(`Because they are free. A learning platform emits them by default, they are unambiguous, and they are defensible in the narrow sense that nobody can prove them wrong. There is also a quieter reason: measuring properly creates the risk of discovering that an expensive programme does nothing. A function that has never been asked for harder evidence has little incentive to generate evidence that could be used against it.`),
  p(`That incentive problem is worth naming out loud at the start, because it determines whether the measurement programme you design will survive its first bad result. If the answer to a failed programme is blame, you will get good numbers and no learning.`),

  h2(`Three measures worth the effort`),

  h3(`Capability change, against the same instrument`),
  p(`Assess the same skills before and after, on the same scale, with the same kind of evidence. The immediate post-course measure is the least interesting one, because it largely captures short-term recall and the effect of having just been told the answers. The measure that matters is taken six to ten weeks later, once the material has either been used or forgotten.`),
  p(`Two failure modes to design against. Do not let the post-assessment be drawn from the material that was taught verbatim, or you are measuring memory of the slides. And use assessment that requires demonstration rather than self-rating, since confidence moves after training whether or not capability does. That distinction is the entire argument for ${a("/employee-skill-assessment", "assessing skills rather than surveying them")}.`),

  h3(`Transfer into the work itself`),
  p(`Capability that never appears in the work is a hobby. Transfer is harder to measure but rarely impossible, because most work leaves artefacts: code review comments, incident write-ups, client proposals, call recordings, design documents, tickets. Pick one artefact type, define two or three observable things that should look different, and sample them before and a quarter after.`),
  p(`Manager observation is the other route, and it works if &mdash; and only if &mdash; it is a short checklist of specific behaviours at a fixed interval, rather than an open question at appraisal time. &ldquo;Has Priya used the new escalation protocol on a live incident?&rdquo; produces data. &ldquo;Has Priya improved?&rdquo; produces politeness.`),

  h3(`The sponsor&rsquo;s number, agreed in advance`),
  p(`Before the programme runs, ask whoever is paying what should be different afterwards, and write the answer down. Time for a new hire to reach independent delivery. Rework rate on a class of tasks. Internal fill rate for a role family that currently goes to external hiring. The measure does not have to be perfect. It has to be chosen before the result is known, because a metric selected afterwards will always be the one that looks best.`),
  p(`This also changes the conversation with the business. A programme built against a sponsor&rsquo;s stated number is a joint commitment, which is a considerably stronger position than presenting attendance figures to someone who did not ask for them. It is also how ${a("/upskilling", "an upskilling programme")} earns a second year of funding.`),

  h2(`What you can honestly claim`),
  p(`You will rarely get a control group, and you should stop pretending otherwise. The practical substitutes are staggered rollout, where the group trained in March is compared with the group waiting until June, and cohort comparison across similar teams. Both are imperfect and both are far better than nothing.`),
  p(`When the confound is unavoidable, say so. A report that reads &ldquo;capability moved, and we cannot separate that from the reorganization that happened in the same quarter&rdquo; is more useful, and considerably more credible, than a clean attribution nobody in the room believes. Overclaiming once costs more trust than three honest null results.`),

  h2(`Measure fewer programmes, properly`),
  p(`The instinct to instrument everything produces a dashboard that measures nothing, because the effort per programme drops below the level at which any of it is reliable. Pick the two or three programmes that cost the most or carry the most strategic weight. Measure those seriously, with pre and post assessment, a transfer measure and a sponsor number. Everything else gets completion data and a light satisfaction check, which is an honest statement of how much you care.`),

  h2(`The point is to be able to stop things`),
  p(`A measurement programme that has never ended a course is not a measurement programme. When something does not work, there are three explanations worth separating, and only one of them is about the training. The content may be wrong. The population may be wrong &mdash; people sent who had no use for it. Or the environment may block transfer: the manager does not permit the new practice, the tooling does not exist, the incentive still rewards the old behaviour.`),
  p(`Telling those three apart is arguably the highest-value thing a learning function does, because the third one is not a training problem at all and no amount of redesign will fix it. Finding it is worth more than another course. Everything else &mdash; the measures, the instruments, the honest reporting, the way it connects to ${a("/skills-gap-analysis", "the gaps the organization actually has")} &mdash; is in service of being able to say which of the three you are looking at.`),
];

/* ----------------------------------------------------------- article five */

const skillTaxonomy = (a) => [
  p(`Three teams in the same company describe the same ability three different ways. One calls it data storytelling. One calls it business reporting. The third has it on a spreadsheet as &ldquo;Excel (advanced)&rdquo;. A staffing manager looking for someone who can turn a messy dataset into something a client can act on searches the skills system, finds nothing, and hires a contractor. Two of the three people she needed were on the floor above her.`),
  p(`A taxonomy is the fix for that. It is also the thing most organizations believe they already have, because they have a list of skills in a spreadsheet, and a list is not a taxonomy.`),

  h2(`What a taxonomy actually is`),
  p(`Four things, all of which have to be present for it to do any work:`),
  ul([
    `<strong class="font-semibold text-ink">A controlled vocabulary.</strong> One preferred name per skill, with every alias mapped to it. &ldquo;Data storytelling&rdquo; and &ldquo;business reporting&rdquo; resolve to the same entry, so searching either one finds both people.`,
    `<strong class="font-semibold text-ink">A structure.</strong> Families and sub-families, shallow enough that someone can navigate it without a manual. Two levels of nesting is usually enough; four is a sign the model is describing the organization rather than the work.`,
    `<strong class="font-semibold text-ink">Definitions written as capability.</strong> Each entry states what a person can do, in terms that could be observed. Not a topic, not a subject area, not a department name.`,
    `<strong class="font-semibold text-ink">Rules.</strong> Written decisions about what counts as a skill, what is a tool, what is a role, and what is a behaviour. Without rules, every contributor adds entries in their own shape and the structure dissolves within a year.`,
  ]),
  p(`Levels and evidence then hang off that structure. A taxonomy without levels tells you who has touched something; a taxonomy with levels and evidence tells you who can be trusted with it. That difference is the point of ${a("/skills", "treating skills as measured data")} rather than as tags on a profile.`),

  h2(`Why most of them fail`),

  h3(`Imported wholesale`),
  p(`Adopting a public skills library of several thousand entries gives you immediate coverage and almost no meaning. Nothing in it reflects how your organization divides work, which distinctions matter in your domain, or which of those thousands of entries anybody will ever staff against. Public libraries are excellent raw material and a poor finished product. Use one to avoid inventing vocabulary from scratch, then delete ninety per cent of it.`),

  h3(`Granularity that does not hold`),
  p(`The most common structural failure is peers that are not peers. A workable rule of thumb: a skill should be something you could meaningfully assess in one sitting and staff a piece of work against. If it would take a decade to acquire, it is a family. If it takes an afternoon, it is a task, and it belongs inside a skill rather than beside it.`),

  h3(`Tools mistaken for skills`),
  p(`Tool names are seductive because they are concrete and easy to search. They are also the fastest-decaying part of any taxonomy, and they encourage hiring for the tool rather than the capability. Model the capability &mdash; container orchestration, statistical modelling, contract drafting &mdash; and carry the specific tools as attributes underneath it. When the tool changes, and it will, the skill survives and so does the history attached to it.`),

  h3(`No owner and no change process`),
  p(`Taxonomies rot in a specific way: new work arrives, the vocabulary does not cover it, people improvise in free-text fields, and within two years the free text carries more truth than the structure. The fix is boring. Name an owner, publish a change window, require a short justification for new entries, and merge duplicates on a schedule.`),

  h3(`Not connected to evidence or to roles`),
  p(`If the taxonomy is not what assessments measure, and not what role profiles reference, it is a glossary. The connection has to run in both directions: a role states which skills at which levels it needs, and an assessment result writes back to the same entries. Only then can ${a("/skills-gap-analysis", "the gap between the two")} be computed rather than estimated in a workshop.`),

  h2(`A smaller thing that works`),
  p(`Pick one job family where staffing is painful right now. Build forty to sixty skills for it, with real definitions and mapped aliases. Attach them to the four or five role profiles in that family. Assess one cohort. Look at what the data cannot answer and fix the vocabulary. Then, and only then, take the second job family.`),
  p(`This is slower to announce and considerably faster to finish. It also produces something defensible at every stage, which matters when the programme has to survive a change of sponsor. The enterprise-wide launch, by contrast, produces its first usable output at the point where the original budget has already been spent.`),

  h2(`Education has the same problem, in different clothes`),
  p(`Curriculum outcomes, syllabus topics and the concepts that actually get assessed are three overlapping vocabularies that are rarely reconciled. When a question is tagged with a topic rather than the concept it tests, results can be reported but not diagnosed, which is why a college can know a module has a low pass rate and still not know what to change about it. The discipline required is identical to the enterprise case: one vocabulary, defined as capability, connected to the evidence. Getting that mapping right is most of what makes ${a("/higher-education", "academic analytics")} useful rather than decorative.`),

  h2(`The test`),
  p(`A taxonomy is working when a question about people can be answered by the system rather than by the longest-serving manager in the room. That is a low bar and very few organizations clear it, largely because they built a comprehensive list when what they needed was a small, governed vocabulary connected to real evidence.`),
];

/* ------------------------------------------------------------ article six */

const skillLevels = (a) => [
  p(`A self-assessment goes out across a department on a five-point scale. Almost everyone selects three. The handful who select five are, on inspection, not the strongest practitioners; several of the strongest select four, because they have a clear enough picture of the field to know what five would actually require. The resulting dataset is a study of temperament with a skills label on it.`),
  p(`This is not a failure of the people filling in the form. It is a failure of the scale. Beginner, intermediate, advanced and expert are adjectives, not measurements. They are empty containers that each rater fills with their own standard, which is why two managers assessing the same person routinely land two levels apart and both feel confident.`),

  h2(`A level needs three things`),

  h3(`A task`),
  p(`What can this person complete? Stated as work, not as knowledge. &ldquo;Understands normalisation&rdquo; is unfalsifiable. &ldquo;Can design a schema for a new transactional service and defend the trade-offs in review&rdquo; is something that either has or has not happened. The task descriptor is what stops a level from being a feeling.`),

  h3(`A condition`),
  p(`This is the axis that does the most work and the one most often missing. The same task performed under different conditions represents very different levels of capability:`),
  ul([
    `Can do it with close supervision and a worked example to follow.`,
    `Can do it independently on routine cases, and knows when to ask.`,
    `Can do it independently on ambiguous cases, where the requirements are contested or incomplete.`,
    `Sets the standard for how it is done, and is the escalation point when others are stuck.`,
  ]),
  p(`Those four conditions are stable across almost every skill in an organization, which is what makes them useful as a backbone. The task descriptor changes; the shape of the ladder does not.`),

  h3(`An evidence rule`),
  p(`What would settle a disagreement between two raters? A piece of delivered work, an assessment result, an observation against a defined checklist, a record of having handled a specific class of problem. If nothing could settle it, the level is decorative, and everybody will eventually work that out. Attaching evidence is also what makes ${a("/employee-skill-assessment", "a skill rating")} survive contact with a promotion committee.`),

  h2(`Fewer levels than you think`),
  p(`Five-point scales usually collapse into three real distinctions under examination: cannot do it alone, can do it alone, can be relied on when it is hard. The extra levels buy a finer progression narrative that people find motivating, and they cost calibration accuracy, because the boundaries between adjacent levels stop being distinguishable in practice.`),
  p(`Four is the compromise worth defending: one learning state, two working states separated by whether the case is routine or ambiguous, and one state for people who set direction for others. Going beyond five is a decision to have conversations about whether someone is a three or a four, forever, with no decision resting on the answer.`),

  h2(`One scale, or one per skill`),
  p(`A single organization-wide scale is comparable, cheap to teach and easy to roll up into a report. Skill-specific scales are more accurate and impossible to aggregate, which means the organization gets precision at the level of the individual and nothing at the level of the portfolio.`),
  p(`The compromise that survives contact with reality is a universal structure with skill-specific content: the same four conditions everywhere, with task descriptors written per skill by someone who does the work. You keep comparability, you keep meaning, and the cost is that each skill needs an hour of somebody competent writing four sentences. That is a real cost and it is the reason to keep ${a("/skills", "the skill model")} small enough that the writing is achievable.`),

  h2(`Levels decay, so date them`),
  p(`A level measured two years ago, against a version of a technology that no longer exists, is a historical claim rather than a current fact. Every rating should carry its source and the date it was established, and the interface should show the age rather than hiding it behind a number that looks equally fresh whether it is two weeks or two years old.`),
  p(`Decay rates differ and the policy should reflect that. Fast-moving technical skills are worth re-measuring annually. Judgment-heavy capabilities like facilitation or negotiation decay slowly and do not justify the same cadence. Re-measuring everything on the same schedule is how a programme collapses under its own administrative weight in the second year, taking ${a("/reskilling", "the reskilling work that depends on it")} with it.`),

  h2(`Calibration is the actual work`),
  p(`Write the descriptors well and raters will still disagree, because the descriptors are read by people with different standards. The fix is a calibration session: several raters independently rate the same anonymised evidence, then argue about the differences. The disagreements point exactly at the descriptors that are vague, which is information you cannot get any other way.`),
  p(`Run it twice a year, publish the worked examples as reference cases, and accept that this is not overhead &mdash; it is the mechanism that makes the numbers comparable across teams. A scale without calibration produces data that looks consistent and is not, which is a worse position than having no data, because people act on it.`),

  h2(`What levels are not for`),
  p(`Be careful about wiring levels directly into pay. The moment a level determines money, the rating stops being a measurement and becomes a negotiation, evidence gets curated, and managers start advocating rather than assessing. Levels do their best work in development planning and staffing, where the incentive is to be accurate because an inflated rating leads directly to being handed work you cannot do.`),
  p(`If levels do eventually feed compensation, budget for the verification that becomes necessary: independent assessment, evidence review, and an appeals route. That is a fair trade, but it should be an explicit decision rather than something that happens gradually because a spreadsheet was convenient.`),
];

/* ---------------------------------------------------------- article seven */

const learningGaps = (a) => [
  p(`A Grade 9 student cannot solve a two-step linear equation. Her teacher reteaches the method, slowly, twice, and she still cannot do it. The actual break is four years upstream: she has never been secure with equivalent fractions, so every time the algebra requires multiplying through by a denominator she loses the thread and guesses. No amount of reteaching Grade 9 content will reach a Grade 5 gap.`),
  p(`This is the mechanic behind most of what gets recorded as &ldquo;weak in maths&rdquo;, and it is almost entirely invisible in the data a school collects, because the data is organised by the term in which the mark was awarded rather than by the concept that failed.`),

  h2(`A gap is a tax, not a hole`),
  p(`In hierarchical subjects, later content assumes earlier content is automatic. When a prerequisite is missing, the student does not simply lack one piece; every downstream lesson costs more working memory, because part of their attention is spent reconstructing something that should be free. Less of the new material lands, which creates the next gap, which raises the tax again.`),
  p(`Two years of that and the accumulated effect is indistinguishable from low ability &mdash; to the teacher, to the parents, and most damagingly to the student, who has by then formed a stable opinion of herself as someone who is bad at the subject. That is the compounding. It is not the original gap getting larger. It is the interest.`),

  h2(`Why the school calendar catches it late`),
  p(`Terminal assessment reports a score after the window for acting has closed. The mark aggregates across every concept in the term, so a middling result can hide a total failure on one idea underneath solid performance on five others. And a report card is a communication instrument, designed to summarise for a parent, not to diagnose for a teacher. None of these are faults of the people involved; they are properties of measuring at the end.`),

  h2(`What catching it early actually requires`),

  h3(`Items mapped to concepts, and concepts mapped to prerequisites`),
  p(`Every question needs to carry the concept it tests and the concepts that concept assumes. Then a wrong answer points somewhere specific, and a pattern of wrong answers points upstream. Without that mapping, a low score is a fact with no address, and the only available response is to reteach the current topic more loudly.`),

  h3(`Short, frequent and low-stakes`),
  p(`Ten minutes each week produces far more usable signal than ninety minutes each term, and it produces it while there is still time to act. Frequency also lowers the stakes of any single measurement, which reduces both the anxiety and the incentive to copy &mdash; two things that quietly corrupt a lot of assessment data.`),

  h3(`Telling &ldquo;does not know&rdquo; apart from &ldquo;did not read the question&rdquo;`),
  p(`A consistent wrong answer is more informative than a low score. A student who subtracts numerators and denominators separately, every time, has a specific and correctable misconception. A student who gets four of the same item type right and one wrong has a lapse of attention. Treating those two the same wastes the intervention on the student who did not need it and mislabels the one who did.`),

  h3(`Remediation aimed upstream`),
  p(`If the diagnosis is Grade 5 fractions, then the work is Grade 5 fractions. That is easy to say and socially difficult to do: a fourteen-year-old will not accept material that is visibly labelled as four years below her class in front of her peers. It has to run alongside the current topic rather than replacing it, it has to be private, and it has to be short enough to finish. This is where ${a("/ai-tutor", "after-hours tutoring")} does its most useful work, because the embarrassment cost of asking the same question for the fifth time drops to zero.`),

  h3(`Somebody with the hours`),
  p(`The reason schools do not do this is not ignorance. It is arithmetic. One teacher, forty students, six periods a day, and a syllabus with a fixed end date. Diagnosing individual prerequisite gaps by hand is simply not available at that ratio. The automatable parts &mdash; tagging items, grouping students by shared misconception, ranking gaps by how much downstream content depends on them &mdash; are where ${a("/schools", "a platform earns its place in a school")}, because they give back the one resource that cannot otherwise be created.`),

  h2(`Where this argument does not apply`),
  p(`Not every subject is a chain. History, literature and most of the humanities build cumulative skills &mdash; argument, evidence handling, close reading &mdash; but the content is not strictly sequential, and a student who missed the Industrial Revolution is not thereby blocked from understanding decolonisation. Applying a rigid prerequisite model everywhere produces a mechanical curriculum and a lot of pointless remediation.`),
  p(`Use the model where the dependency is real: arithmetic into algebra, algebra into calculus, phonics into fluency, vocabulary into comprehension, mechanics into electromagnetism, the early programming constructs into everything that follows. In those subjects the chain is not a theory, it is the structure of the discipline.`),

  h2(`The signal worth watching`),
  p(`It is usually not the student who is failing, because that student has already been noticed. It is the one whose score drifts downward across three terms while remaining comfortably acceptable, and the one who arrives at correct answers but takes twice as long as the class to get there. Effort and time are earlier indicators than marks, and both are visible in the way students work rather than in what they finally score, which is precisely what ${a("/student-performance-analytics", "performance analytics")} should be built to surface.`),
  p(`Catching a gap in the term it appears rather than three years later is not an ambitious goal, and it does not require predicting anything. It requires measuring the right unit &mdash; the concept rather than the chapter &mdash; often enough that the measurement can still change what happens next. Most of what stands in the way is the shape of the assessment, not the difficulty of the problem. If you are looking at this in your own school, ${a("/at-risk-students", "the early-warning side")} is the natural place to start.`),
];

/* ---------------------------------------------------------- article eight */

const academicAnalytics = (a) => [
  p(`A dean opens the analytics module before a semester review. There are twenty-eight charts. Attendance by department, by day of the week, by hour. A heat map of submission times. A pie chart of pass percentages by programme, with a filter for year of study. Every figure is accurate, the module cost a considerable amount, and nothing on that screen has ever caused a decision to be made differently.`),
  p(`The problem is not the data. It is that nobody wrote the questions down first. A dashboard is a set of answers, and a set of answers assembled without questions is a wall. Five questions justify the effort of building an analytics capability in an institution. Anything on the screen that does not serve one of them is decoration, and decoration is expensive because it competes for attention with the charts that matter.`),

  h2(`One. Who needs help right now, and what kind`),
  p(`The output is a short, ranked list of named students, each with the reason attached and a recommended action. Not a score. A score on its own cannot be argued with by the tutor who knows the student, cannot be corrected when it is wrong, and cannot be explained to the student if they ask &mdash; which they are entitled to do.`),
  p(`The failure mode is a list nobody owns. Every flagged student needs a named person and a next action with a date, otherwise the list regenerates each week with the same names on it and the institution slowly learns to ignore it. Getting this right is mostly an operational design problem rather than a modelling one, which is the uncomfortable finding behind most ${a("/at-risk-students", "early-warning programmes")} that quietly stop being used.`),

  h2(`Two. Which parts of the curriculum break for everyone`),
  p(`Some units lose marks year after year, across sections, across instructors, across cohorts. That is not a teaching quality signal; it is a curriculum design signal, and it usually means the unit assumes something the students have not been taught, is scheduled at the wrong point in the sequence, or is assessed in a way that tests something other than what was taught.`),
  p(`This is the most actionable question on the list and the most frequently ignored, because acting on it means changing the syllabus, which is slow and political. It also pays back the furthest: fixing a unit fixes it for every cohort that follows, while helping an individual student helps one student.`),
  p(`The failure mode here is severe. The moment this view is used to rank faculty, the data stops being honest &mdash; assessment gets easier, marking gets generous, and the signal disappears within two semesters. Analysing the curriculum and evaluating the teacher have to be visibly separate systems, and the separation has to be stated rather than assumed.`),

  h2(`Three. Are we where we said we would be`),
  p(`Syllabus coverage against plan, and assessment completed against plan. It is the least interesting question intellectually and often the most useful in practice, because it is the only one where the remedy is obvious and the timing still allows it. Two weeks behind in week six is recoverable with a schedule adjustment. The same two weeks discovered in week thirteen is a decision about what to cut.`),
  p(`The requirement is simply that the data arrives faster than the decision cycle it serves. A coverage report published at the end of term is a historical document. The same report available weekly is an instrument, and it is the single most reliable thing ${a("/leadership", "academic leadership")} can ask for from a system.`),

  h2(`Four. Did what we did last time change anything`),
  p(`Institutions run interventions constantly: remedial sessions, mentoring, attendance drives, extra tutorials, revised assessment schedules. Very few record what was done, to whom, and when, in a form that allows anyone to re-measure afterwards. Without that record, the institution cannot tell an effective intervention from a popular one, and it will keep funding whichever is easier to organise.`),
  p(`The discipline is unglamorous: log the intervention, define what should move, re-measure the same thing at a set interval, and publish the result even when it is nothing. Expect a reasonable share to show no effect. That is not a failure of the programme, it is the reason for measuring, and an institution that cannot tolerate a null result will end up with analytics that only ever confirm decisions already taken.`),

  h2(`Five. Are students becoming ready for what comes next`),
  p(`Pass rates describe performance inside the institution&rsquo;s own system. They say relatively little about whether a graduating cohort can do the things the next stage requires, whether that is employment, a professional examination or postgraduate study. Answering this means holding a picture of what those destinations require and comparing it against what students can actually demonstrate, by cohort and by year, early enough that the final year is not the first time anyone looks.`),
  p(`This is the question that connects academic analytics to ${a("/skills-gap-analysis", "skills-gap analysis")}, and it is the one that tends to be politically hardest, because the honest answer in the first year is usually uncomfortable. It is also the only question on this list that speaks directly to what students and their families believe they are buying.`),

  h2(`What a dashboard should not do`),
  ul([
    `Label a person. A flag is a prompt for a conversation, not a property of a student, and the language on the screen should make that obvious.`,
    `Show a score without the evidence one click away. Anything that cannot be interrogated will eventually be either over-trusted or ignored, and both are bad.`,
    `Report on individual staff in a view designed for curriculum analysis. Mixing those two purposes destroys the data.`,
    `Refresh more often than anyone can act. A daily chart serving a monthly decision produces noise and the appearance of volatility where none exists.`,
    `Grow without pruning. Every chart added without removing one dilutes the attention available for the rest.`,
  ]),

  h2(`Start with three`),
  p(`Most institutions should build the first, third and fourth questions before touching the others. They need the least modelling, they produce decisions immediately, and they establish the habit of connecting a number to an owner and an action. The fifth question is the most valuable in the long run and the one most likely to stall a programme if it is attempted first, because it requires vocabulary and evidence that most institutions have not yet built.`),
  p(`The test for any chart on the screen is the same throughout: name the decision it informs and the person who makes it. Charts that survive that question tend to be few, plain and heavily used. That is what ${a("/student-performance-analytics", "an analytics layer")} should be aiming at &mdash; not comprehensiveness, which is easy, but the much harder property of being consulted before a decision rather than quoted after one.`),
];

/* ------------------------------------------------------------------ posts */

/**
 * @typedef {object} Post
 * @property {string} slug        URL segment under /blog/. Never a category id.
 * @property {string} category    Matches an id in `blogCategories`.
 * @property {string} title       Plain-text headline. H1, <title> and schema.
 * @property {string} short       Short form for the breadcrumb trail.
 * @property {string} description Plain-text meta description.
 * @property {string} standfirst  HTML fragment. Hero lede and listing summary.
 * @property {string} published   ISO date, used for schema and display.
 * @property {(a: (path: string, label: string) => string) => string[]} sections
 *           Prose blocks. Receives a linker-bound anchor helper.
 * @property {Array<{label: string, path: string, note: string}>} related
 * @property {{title: string, lede: string, primary: object, secondary: object}} cta
 */

/** Declared newest first. Every listing preserves this order. */
const posts = [
  {
    slug: "ai-in-schools-what-actually-works",
    category: "ai-in-education",
    title: "AI in Schools: What Actually Works, and What Is Still Marketing",
    seoTitle: "AI in Schools: What Actually Works",
    short: "What actually works",
    description:
      "AI in schools works when it removes work a teacher already does slowly, and fails when it claims to replace judgment. How to tell the two apart before you buy.",
    standfirst:
      "Three uses of AI that hold up in a real school week, three that do not, and the diligence questions that separate them before a contract is signed.",
    published: "2026-09-04",
    sections: aiInSchools,
    related: [
      { label: "GaugeSkills for Schools", path: "/schools", note: "Assessments, tutoring and analytics built around the school week." },
      { label: "AI tutor", path: "/ai-tutor", note: "What the tutor does after hours, and what it deliberately will not do." },
      { label: "Why learning gaps compound", path: "/blog/learning-gaps-compound", note: "The mechanic behind most of what gets recorded as weak in a subject." },
    ],
    cta: {
      title: "See it against one of your own classes",
      lede: "A generic tour proves nothing. Pick a year group and a subject you recognise, and we will run the platform against that instead.",
      primary: { path: "/demo", label: "Book a School Demo" },
      secondary: { path: "/schools", label: "GaugeSkills for Schools" },
    },
  },
  {
    slug: "ai-teaching-assistant-for-faculty",
    category: "ai-in-education",
    title: "What an AI Teaching Assistant Can and Cannot Do for Faculty",
    seoTitle: "What an AI Teaching Assistant Does for Faculty",
    short: "AI teaching assistant",
    description:
      "An AI assistant can draft assessments, reshape material and cluster cohort errors. It cannot know your class, decide what matters, or own the grade it suggests.",
    standfirst:
      "A working division of labour between an academic and an assistant, and the three reasons faculty rollouts fail that have nothing to do with the model.",
    published: "2026-08-21",
    sections: aiTeachingAssistant,
    related: [
      { label: "AI for faculty", path: "/ai-for-faculty", note: "Drafting, marking support and cohort insight, with approval kept with the academic." },
      { label: "Higher Education", path: "/higher-education", note: "The platform as it applies to colleges and universities." },
      { label: "The AI layer", path: "/ai", note: "What the models do, where they sit, and what stays under human review." },
    ],
    cta: {
      title: "Bring a course you already teach",
      lede: "We would rather draft against your outcomes and your question bank than show a demonstration course nobody in the room has taught.",
      primary: { path: "/demo", label: "Request a College Demo" },
      secondary: { path: "/ai-for-faculty", label: "AI for faculty" },
    },
  },
  {
    slug: "competency-management-that-people-use",
    category: "enterprise-learning",
    title: "Competency Management That People Actually Use",
    short: "Competency management",
    description:
      "Most competency frameworks end as a PDF nobody opens. Build one around the decisions managers actually make, with evidence attached and a named owner.",
    standfirst:
      "Why the four-hundred-item framework dies, and what a smaller one tied to staffing and promotion decisions looks like instead.",
    published: "2026-07-30",
    sections: competencyManagement,
    related: [
      { label: "GaugeSkills for Enterprise", path: "/enterprise", note: "Skills, gaps and development paths for a working organization." },
      { label: "Employee skill assessment", path: "/employee-skill-assessment", note: "Measured capability rather than an annual self-rating." },
      { label: "Defining skill levels", path: "/blog/skill-levels-that-mean-something", note: "The part of a framework where most of them quietly fall apart." },
    ],
    cta: {
      title: "Start with one job family",
      lede: "We will scope a pilot around the roles where staffing decisions are hardest today, and show what the data looks like after one assessment cycle.",
      primary: { path: "/demo", label: "Talk to Our Enterprise Team" },
      secondary: { path: "/skills", label: "How skills are measured" },
    },
  },
  {
    slug: "measuring-training-effectiveness",
    category: "enterprise-learning",
    title: "Measuring Training Effectiveness Beyond Completion Rates",
    seoTitle: "Measuring Training Effectiveness",
    short: "Training effectiveness",
    description:
      "Completion measures attendance and satisfaction measures the room. What to measure instead, and what you can honestly claim without a control group.",
    standfirst:
      "Three measures worth the effort, an honest position on attribution, and why a measurement programme that has never stopped a course is not one.",
    published: "2026-07-09",
    sections: measuringTraining,
    related: [
      { label: "Upskilling", path: "/upskilling", note: "Programmes built against a gap rather than a catalogue." },
      { label: "Employee skill assessment", path: "/employee-skill-assessment", note: "The instrument that makes before-and-after comparable." },
      { label: "Skills gap analysis", path: "/skills-gap-analysis", note: "The gap that a programme is supposed to close, stated in advance." },
    ],
    cta: {
      title: "Measure one programme properly",
      lede: "Pick the programme you most need to defend next budget cycle. We will show how the before-and-after evidence would be collected.",
      primary: { path: "/demo", label: "Talk to Our Enterprise Team" },
      secondary: { path: "/enterprise", label: "GaugeSkills for Enterprise" },
    },
  },
  {
    slug: "what-is-a-skill-taxonomy",
    category: "skills",
    title: "What a Skill Taxonomy Is, and Why Most of Them Fail",
    short: "Skill taxonomy",
    description:
      "A skill taxonomy is a governed vocabulary with structure, rules and an owner, not a list of skills. Why most of them fail, and what a smaller one gets right.",
    standfirst:
      "The four things a taxonomy needs to do any work, the five ways they usually rot, and why the enterprise-wide launch is the wrong first move.",
    published: "2026-06-18",
    sections: skillTaxonomy,
    related: [
      { label: "Skills", path: "/skills", note: "Skills as measured data rather than tags on a profile." },
      { label: "Skills gap analysis", path: "/skills-gap-analysis", note: "What the taxonomy has to support to be worth maintaining." },
      { label: "Defining skill levels", path: "/blog/skill-levels-that-mean-something", note: "The levels that hang off every entry in the taxonomy." },
    ],
    cta: {
      title: "Bring the vocabulary you already have",
      lede: "Most organizations have three overlapping lists. We will show what it takes to reconcile them into something that answers a staffing question.",
      primary: { path: "/demo", label: "Book a demo" },
      secondary: { path: "/skills", label: "How skills are measured" },
    },
  },
  {
    slug: "skill-levels-that-mean-something",
    category: "skills",
    title: "Defining Skill Levels That Mean Something",
    short: "Skill levels",
    description:
      "Beginner, intermediate, advanced and expert are adjectives, not measurements. Define levels by task, condition and evidence, then calibrate them twice a year.",
    standfirst:
      "Why five-point self-assessment produces a study of temperament, and what a level has to contain before two raters can agree on it.",
    published: "2026-05-27",
    sections: skillLevels,
    related: [
      { label: "Skills", path: "/skills", note: "The skill model the levels attach to." },
      { label: "Employee skill assessment", path: "/employee-skill-assessment", note: "Evidence that settles a disagreement between two raters." },
      { label: "What a skill taxonomy is", path: "/blog/what-is-a-skill-taxonomy", note: "The vocabulary underneath the levels, and how it rots." },
    ],
    cta: {
      title: "See what a calibrated level looks like",
      lede: "We will walk through task descriptors, the conditions ladder and the evidence rule against a role family you care about.",
      primary: { path: "/demo", label: "Book a demo" },
      secondary: { path: "/enterprise", label: "GaugeSkills for Enterprise" },
    },
  },
  {
    slug: "learning-gaps-compound",
    category: "student-performance",
    title: "Why Learning Gaps Compound, and How to Catch Them Early",
    seoTitle: "Why Learning Gaps Compound",
    short: "Learning gaps",
    description:
      "A Grade 9 algebra failure is often a Grade 5 fractions gap. Why learning gaps compound into something that looks like ability, and what catching them early takes.",
    standfirst:
      "A missing prerequisite is not a hole, it is a tax on everything downstream. What it takes to find one in the term it appears rather than three years later.",
    published: "2026-04-23",
    sections: learningGaps,
    related: [
      { label: "At-risk students", path: "/at-risk-students", note: "Finding the drift early, without turning a flag into a label." },
      { label: "Student performance analytics", path: "/student-performance-analytics", note: "Measuring the concept rather than the chapter." },
      { label: "AI tutor", path: "/ai-tutor", note: "Where upstream remediation can happen without an audience." },
    ],
    cta: {
      title: "Find the gaps in one cohort",
      lede: "Bring a subject and a year group. We will show how items map to concepts and what the grouping looks like on real content.",
      primary: { path: "/demo", label: "Book a School Demo" },
      secondary: { path: "/schools", label: "GaugeSkills for Schools" },
    },
  },
  {
    slug: "academic-analytics-questions",
    category: "student-performance",
    title: "The Five Questions Academic Analytics Should Answer",
    short: "Academic analytics",
    description:
      "A dashboard with twenty-eight charts and no decisions attached is decoration. Five questions academic analytics should answer, and the action each one triggers.",
    standfirst:
      "Name the decision and the person who makes it. Charts that survive that question tend to be few, plain, and consulted before a decision rather than after it.",
    published: "2026-03-12",
    sections: academicAnalytics,
    related: [
      { label: "Student performance analytics", path: "/student-performance-analytics", note: "The analytics layer, built around decisions rather than charts." },
      { label: "For leadership", path: "/leadership", note: "Coverage against plan, and what to ask a system for weekly." },
      { label: "Higher Education", path: "/higher-education", note: "Academic operations, analytics and employability in one platform." },
    ],
    cta: {
      title: "Bring your three hardest questions",
      lede: "We will work through which of them the data you already collect can answer, and what would have to change for the rest.",
      primary: { path: "/demo", label: "Request a College Demo" },
      secondary: { path: "/higher-education", label: "GaugeSkills for Higher Education" },
    },
  },
];

const postsIn = (categoryId) => posts.filter((post) => post.category === categoryId);

/* --------------------------------------------------------- page assembly */

/** Build one article page. Every derived value comes from the post record. */
function articlePage(post) {
  const out = `blog/${post.slug}.html`;
  const rel = linker(out);
  const category = categoryById[post.category];
  const path = postPath(post.slug);

  const a = (target, label) => `<a href="${rel(target)}" class="${PROSE_LINK}">${label}</a>`;
  const blocks = post.sections(a);
  const proseHtml = prose(blocks);

  const trail = [
    { name: "Blog", path: "/blog" },
    { name: category.label, path: postPath(category.id) },
    { name: post.short, path },
  ];

  const body = [
    hero({
      eyebrow: category.label,
      h1: esc(post.title),
      lede: post.standfirst,
    }),
    breadcrumbs(trail, rel),
    byline({
      published: post.published,
      category,
      minutes: readingTime(blocks.join(" ")),
      rel,
    }),
    proseHtml,
    relatedLinks(post.related, rel),
    ctaBand({
      title: post.cta.title,
      lede: post.cta.lede,
      primary: { href: rel(post.cta.primary.path), label: post.cta.primary.label },
      secondary: { href: rel(post.cta.secondary.path), label: post.cta.secondary.label },
    }),
  ].join("\n");

  return {
    out,
    canonical: path,
    // Long headlines read well as an H1 but get truncated in a results page,
    // so a post may carry a shorter title for search.
    title: `${post.seoTitle ?? post.title} | GaugeSkills`,
    description: post.description,
    ogImage: "og/blog.png",
    // Articles are not nav entries, so the parent category carries the state.
    active: postPath(category.id),
    breadcrumbs: trail,
    schemaExtra: [
      article({
        path,
        headline: post.title,
        description: post.description,
        published: post.published,
      }),
    ],
    body,
  };
}

/**
 * Editorial copy for each hub. Kept beside the hub builder rather than in
 * site.mjs, because it is page copy rather than shared navigation data.
 */
const hubs = {
  "ai-in-education": {
    title: "AI in Education | Writing on Classroom AI | GaugeSkills",
    description:
      "Writing on how AI is actually used in schools and colleges: what holds up in a real teaching week, what is still marketing, and where the line on judgment sits.",
    h1: "AI in education, described honestly",
    lede: "What holds up across a full teaching term, what quietly stops being opened in week three, and why the difference is rarely about the model.",
    intro: (a) => [
      p(`Most writing about AI in education argues about the wrong thing. The question is not whether a model can explain photosynthesis &mdash; it plainly can &mdash; but which parts of a teacher&rsquo;s or a lecturer&rsquo;s week are worth machine effort, and which parts collapse the moment a person stops being responsible for them. That line moves depending on the task, and locating it is a practical exercise rather than a philosophical one.`),
      p(`The pieces in this category work through that line in specific situations: drafting assessment material, explaining a concept for the fifth time after hours, turning a marksheet into a teaching instruction, and the things that are still sold with more confidence than they deserve. The consistent finding is unexciting. Tools that remove an existing task survive. Tools that ask an educator to change how they teach in exchange for a benefit next term do not.`),
      p(`If you want the product view rather than the argument, ${a("/ai", "the AI layer")} describes where the models sit and what stays under human review, and ${a("/ai-tutor", "the AI tutor")} covers the after-hours case in detail. ${a("/schools", "Schools")} and ${a("/higher-education", "higher education")} apply the same platform to two different weeks.`),
    ],
    related: [
      { label: "The AI layer", path: "/ai", note: "What the models do, and what stays under human review." },
      { label: "AI tutor", path: "/ai-tutor", note: "Explanation after hours, working from the material actually taught." },
      { label: "AI for faculty", path: "/ai-for-faculty", note: "Drafting and marking support with approval kept with the academic." },
      { label: "GaugeSkills for Schools", path: "/schools", note: "The school week: assessments, tutoring, teacher time." },
      { label: "Higher Education", path: "/higher-education", note: "Colleges and universities, from teaching to employability." },
      { label: "The platform", path: "/platform", note: "The common layer underneath all three solution lines." },
    ],
    cta: {
      title: "See the AI features against your own material",
      lede: "Bring a syllabus unit and a question bank. A demonstration built on content you recognise is worth more than a generic tour.",
      primary: { path: "/demo", label: "Book a demo" },
      secondary: { path: "/ai", label: "How the AI layer works" },
    },
  },

  "enterprise-learning": {
    title: "Enterprise Learning | Building Capability at Work | GaugeSkills",
    description:
      "Writing on building capability inside organizations: competency frameworks people use, measuring training beyond completion, and evidence that survives scrutiny.",
    h1: "Enterprise learning, measured properly",
    lede: "Frameworks that inform decisions rather than decorate an intranet, and measurement that can tell you when to stop funding something.",
    intro: (a) => [
      p(`Corporate learning has a credibility problem of its own making. It reports attendance and calls it impact, maintains competency frameworks that nobody consults between appraisals, and struggles to answer the only question a sponsor really asks: is anybody better at their job than they were before. None of that is inevitable, and fixing it is less about new content than about what gets measured and who owns the vocabulary.`),
      p(`The writing here takes the operational view. How to build a competency model small enough that managers use it and specific enough to settle a staffing question. How to measure a programme when you cannot have a control group, and what you can honestly claim afterwards. What to do when the evidence says the training was fine and the environment blocked it &mdash; which is more often the case than the training industry finds comfortable.`),
      p(`On the product side, ${a("/enterprise", "GaugeSkills for Enterprise")} covers assessment, gaps and development paths, ${a("/skills-gap-analysis", "skills gap analysis")} covers the distance between a role and the people in it, and ${a("/upskilling", "upskilling")} and ${a("/reskilling", "reskilling")} cover the two programmes that distance usually produces.`),
    ],
    related: [
      { label: "GaugeSkills for Enterprise", path: "/enterprise", note: "Assessment, gaps and development paths for a working organization." },
      { label: "Employee skill assessment", path: "/employee-skill-assessment", note: "Measured capability rather than an annual self-rating." },
      { label: "Skills gap analysis", path: "/skills-gap-analysis", note: "The distance between what a role needs and what a team has." },
      { label: "Upskilling", path: "/upskilling", note: "Deepening capability in the role someone already holds." },
      { label: "Reskilling", path: "/reskilling", note: "Moving people into a different role on evidence rather than hope." },
      { label: "The platform", path: "/platform", note: "Assessment, AI and analytics as one layer." },
    ],
    cta: {
      title: "Scope a pilot around one job family",
      lede: "Start where staffing decisions are hardest today. One family, one assessment cycle, and a look at what the evidence supports.",
      primary: { path: "/demo", label: "Talk to Our Enterprise Team" },
      secondary: { path: "/enterprise", label: "GaugeSkills for Enterprise" },
    },
  },

  skills: {
    title: "Skills | Taxonomies, Levels and Evidence | GaugeSkills",
    description:
      "Writing on measuring and describing skills: what a taxonomy needs to be useful, how to define levels two raters can agree on, and why evidence beats self-rating.",
    h1: "Describing skills so the words hold up",
    lede: "A skills programme is a vocabulary problem before it is a data problem. Get the words wrong and every number built on them inherits the error.",
    intro: (a) => [
      p(`Almost every skills initiative starts at the wrong end. A platform is selected, a library of several thousand entries is imported, everyone self-rates on a five-point scale, and the resulting dataset turns out to measure confidence and job title rather than capability. The tooling was never the problem. The vocabulary was, along with the absence of anybody owning it.`),
      p(`This category is about the unglamorous groundwork: what a taxonomy has to contain before it can answer a question, how to define a level so that two people assessing the same person land in the same place, what counts as evidence, and how quickly a rating goes stale. These decisions are cheap to make well at the start and expensive to correct once a few thousand ratings depend on them.`),
      p(`For how this works in the product, ${a("/skills", "the skills layer")} describes measurement and levels, ${a("/employee-skill-assessment", "employee skill assessment")} covers the evidence side, and ${a("/skills-gap-analysis", "gap analysis")} covers what the vocabulary is ultimately for.`),
    ],
    related: [
      { label: "Skills", path: "/skills", note: "How a skill is measured rather than self-reported." },
      { label: "Employee skill assessment", path: "/employee-skill-assessment", note: "Assessment that produces evidence, not opinion." },
      { label: "Skills gap analysis", path: "/skills-gap-analysis", note: "Role requirement against demonstrated capability." },
      { label: "GaugeSkills for Enterprise", path: "/enterprise", note: "Where the taxonomy meets staffing and development." },
      { label: "The platform", path: "/platform", note: "Assessment, AI and analytics on one model." },
      { label: "Upskilling", path: "/upskilling", note: "What a measured gap turns into." },
    ],
    cta: {
      title: "Bring the skill lists you already have",
      lede: "Most organizations hold three overlapping versions. We will show what reconciling them into one governed vocabulary involves.",
      primary: { path: "/demo", label: "Book a demo" },
      secondary: { path: "/skills", label: "How skills are measured" },
    },
  },

  "student-performance": {
    title: "Student Performance | Early Signals and Analytics | GaugeSkills",
    description:
      "Writing on seeing where learners stand early enough to act: why gaps compound, what analytics should answer, and how to flag a student without labelling them.",
    h1: "Seeing where students stand, early enough to act",
    lede: "Most institutions measure at the end, when the result is a report rather than a decision. Moving that measurement earlier changes what can be done with it.",
    intro: (a) => [
      p(`A mark awarded at the end of a term is an accurate summary and a poor instrument. It arrives after the window for acting has closed, it aggregates across every concept taught, and it hides the one idea a student never secured underneath five they understood perfectly well. The information a teacher needs is the concept that broke, the students who share it, and enough time left to do something.`),
      p(`The writing in this category deals with both halves of that: the mechanics of how a missing prerequisite compounds into what looks like low ability, and the discipline of building analytics that answer a small number of questions attached to named owners and specific actions. A recurring theme is restraint. A flag should start a conversation, not attach a label, and a dashboard should be judged by the decisions it changes rather than by how much of the institution it depicts.`),
      p(`On the product side, ${a("/student-performance-analytics", "student performance analytics")} covers the measurement layer, ${a("/at-risk-students", "at-risk students")} covers the early-warning case, and ${a("/schools", "schools")} and ${a("/higher-education", "higher education")} show how the same evidence is used in two different institutions.`),
    ],
    related: [
      { label: "Student performance analytics", path: "/student-performance-analytics", note: "Concept-level measurement, built around decisions." },
      { label: "At-risk students", path: "/at-risk-students", note: "Early signals, with the evidence attached to every flag." },
      { label: "AI tutor", path: "/ai-tutor", note: "Where upstream remediation can happen privately." },
      { label: "GaugeSkills for Schools", path: "/schools", note: "The school week, from assessment to intervention." },
      { label: "Higher Education", path: "/higher-education", note: "Cohort analytics, coverage and employability." },
      { label: "For leadership", path: "/leadership", note: "What to ask a system for weekly rather than at term end." },
    ],
    cta: {
      title: "Run it against a cohort you know",
      lede: "Pick a group whose results you can already interpret. The useful test is whether the system tells you something you did not know.",
      primary: { path: "/demo", label: "Book a demo" },
      secondary: { path: "/student-performance-analytics", label: "Student performance analytics" },
    },
  },
};

/** Build one category hub from `blogCategories` plus the editorial copy above. */
function categoryPage(category) {
  const out = `blog/${category.id}.html`;
  const rel = linker(out);
  const hub = hubs[category.id];
  const path = postPath(category.id);
  const items = postsIn(category.id);

  const a = (target, label) => `<a href="${rel(target)}" class="${PROSE_LINK}">${label}</a>`;

  const trail = [
    { name: "Blog", path: "/blog" },
    { name: category.label, path },
  ];

  const body = [
    hero({
      eyebrow: "Blog",
      h1: hub.h1,
      lede: hub.lede,
      primary: { href: rel("/blog"), label: "All writing" },
    }),
    breadcrumbs(trail, rel),
    prose(hub.intro(a)),
    section({
      tone: "paper",
      children: `    ${sectionHead({
        eyebrow: category.label,
        title: `${items.length} article${items.length === 1 ? "" : "s"} in this category`,
        lede: esc(category.blurb),
      })}
    ${postList(items, rel)}`,
    }),
    relatedLinks(hub.related, rel, { heading: "Where this shows up in the product" }),
    ctaBand({
      title: hub.cta.title,
      lede: hub.cta.lede,
      primary: { href: rel(hub.cta.primary.path), label: hub.cta.primary.label },
      secondary: { href: rel(hub.cta.secondary.path), label: hub.cta.secondary.label },
    }),
  ].join("\n");

  return {
    out,
    canonical: path,
    title: hub.title,
    description: hub.description,
    ogImage: "og/blog.png",
    breadcrumbs: trail,
    body,
  };
}

/** The index: categories first, then every article newest first. */
function indexPage() {
  const out = "blog.html";
  const rel = linker(out);

  const body = [
    hero({
      eyebrow: "Blog",
      h1: "Writing on learning, skills and AI",
      lede: "Practical pieces on measuring skills, teaching with AI and finding learning gaps early. Arguments and working methods, written for people who have to make these decisions rather than read about them.",
      primary: { href: rel("/platform"), label: "See the platform" },
      secondary: { href: rel("/demo"), label: "Book a demo" },
    }),
    section({
      tone: "white",
      children: `    ${sectionHead({
        eyebrow: "Categories",
        title: "Four topics, each with a hub of its own",
        lede: "Every article sits under one of these. The hubs carry the wider argument for the topic and the product pages it connects to.",
      })}
    ${categoryCards(rel)}`,
    }),
    section({
      tone: "paper",
      children: `    ${sectionHead({
        eyebrow: "All articles",
        title: "Newest first",
        lede: "Long-form pieces on what works in classrooms, lecture halls and workplaces &mdash; including the parts that do not.",
      })}
    ${postList(posts, rel, { columns: 3 })}`,
    }),
    ctaBand({
      title: "See the platform behind the writing",
      lede: "The arguments here are the ones the product is built on. The quickest way to judge them is against a class, cohort or team you already know.",
      primary: { href: rel("/demo"), label: "Book a demo" },
      secondary: { href: rel("/platform"), label: "See the platform" },
    }),
  ].join("\n");

  return {
    out,
    canonical: "/blog",
    title: "Blog | Learning, Skills and AI | GaugeSkills",
    description:
      "Practical writing on AI in education, enterprise learning, skills measurement and student performance, from the team building GaugeSkills.",
    ogImage: "og/blog.png",
    breadcrumbs: [{ name: "Blog", path: "/blog" }],
    body,
  };
}

/* ----------------------------------------------------------------- export */

/** Index, then the four hubs in `blogCategories` order, then the articles. */
export const blogPages = [
  indexPage(),
  ...blogCategories.map(categoryPage),
  ...posts.map(articlePage),
];
