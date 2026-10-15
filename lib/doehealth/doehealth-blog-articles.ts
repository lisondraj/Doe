export const DOEHEALTH_BLOG_PATH = "/news";

/** Doe brand colours only — three beige shades for hero art, three accent tones for body figures. */
export type DoeHealthBlogPlaceholderTone = "sand" | "panel" | "cream" | "gold" | "clay" | "umber";

export type DoeHealthBlogBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "figure"; tone: DoeHealthBlogPlaceholderTone; caption: string }
  | { type: "quote"; text: string }
  | { type: "list"; items: readonly { lead: string; text: string }[] };

/** Shape of an article's dot wave. Omitted fields keep the default wave. Every wave fills the bottom edge. */
export type DoeHealthBlogWave = {
  /** Where the wave starts, as a fraction of the box height (0.40 and up fills the bottom edge). */
  top?: number;
  amp?: number;
  phase?: number;
  /** Horizontal wavelength multiplier. */
  scale?: number;
};

export type DoeHealthBlogArticle = {
  slug: string;
  eyebrow: string;
  /** Two-line P22 title. */
  title: readonly [string, string];
  author: string;
  date: string;
  excerpt: string;
  heroTone: DoeHealthBlogPlaceholderTone;
  wave?: DoeHealthBlogWave;
  lede: string;
  blocks: readonly DoeHealthBlogBlock[];
};

const PERSONAL_AGENTS: DoeHealthBlogArticle = {
  slug: "healthcare-in-the-era-of-personal-agents",
  eyebrow: "Founder's Memo",
  title: ["Healthcare in the", "Era of Personal Agents"],
  author: "James Lisondra",
  date: "October 14, 2026",
  excerpt:
    "Patients are starting to ask agents to find, book, and pay for their care. Healthcare is not yet written in a language those agents can read.",
  heroTone: "sand",
  lede: "Very soon, the first person to look for a doctor will not be a person. It will be the agent they ask.",
  blocks: [
    {
      type: "paragraph",
      text: "A parent sits on the edge of the bed at 9:41 in the morning and types a question into their phone: can you find a pediatric ENT near Mission that takes Harbor Mutual? My son keeps getting ear infections. It is a reasonable request. It is specific, it is urgent, and every piece of information needed to answer it already exists somewhere.",
    },
    {
      type: "paragraph",
      text: "Today the agent answers the only way it can. It cannot find a clinic that fits. It suggests calling the insurance company. The parent puts the phone down and starts the same chain of hold music, voicemail, and callbacks that patients have navigated for decades.",
    },
    {
      type: "paragraph",
      text: "That answer is not a failure of intelligence. The models are more than capable of reasoning through the request. It is a failure of legibility. The information an agent would need to help that parent lives inside phone trees, PDF fee schedules, outdated directories, portal logins, and the memory of a front desk team that already has too much to do.",
    },
    { type: "heading", text: "The front door is moving." },
    {
      type: "paragraph",
      text: "For most of modern medicine, the front door of a practice was a phone number. Then it became a website, a directory listing, and a portal. Each shift changed who arrived, how they arrived, and what they expected once they did. The next shift is already underway: patients are handing the first steps of their care to personal agents that search, compare, schedule, and follow up on their behalf.",
    },
    {
      type: "paragraph",
      text: "Those agents will not browse the way people do. They do not skim a homepage, notice a phone number in the footer, and decide to call between meetings. They look for structured answers: which provider sees this condition, at this age, under this plan, at this location, with an opening this week. When those answers are missing, the agent moves on, and so does the patient.",
    },
    {
      type: "figure",
      tone: "gold",
      caption: "A personal agent asks the same questions a patient would, but it needs the answers in a form it can read.",
    },
    {
      type: "paragraph",
      text: "I came to this problem from medicine, not from software. In clinic, I watched how much of a patient's experience is decided before they ever meet a clinician: whether they found the right office, whether the referral was in place, whether the visit was covered, whether someone called them back. Those moments are rarely clinical, but they determine whether care happens at all.",
    },
    { type: "heading", text: "Agents cannot read healthcare yet." },
    {
      type: "paragraph",
      text: "Think about what it actually takes to answer the parent's question. An agent would need to know that ear tubes and tympanostomy describe the same procedure, that recurrent ear infections are a reason a pediatric ENT would see a child, and that a given surgeon sees patients from six months old. It would need to know which locations are in Mission, which plans each provider accepts, whether that plan requires a referral, what a self-pay visit costs, and which slots are open on Wednesday morning.",
    },
    {
      type: "paragraph",
      text: "None of that is exotic. Every practice knows it. But it is scattered across systems that were never designed to be read by anyone outside the building, let alone by software acting on a patient's behalf. The result is a strange gap: the most capable assistants ever built, pointed at an industry they cannot see.",
    },
    {
      type: "quote",
      text: "The bottleneck is no longer whether an agent can reason about care. It is whether care has been written down in a way an agent can understand.",
    },
    { type: "heading", text: "A practice, made legible." },
    {
      type: "paragraph",
      text: "At Doe, we are building the layer that closes that gap. Every practice we work with gets its own machine-readable index: a living description of what the practice does, who does it, and under what conditions. It is written once by the practice, kept current as the practice changes, and exposed to agents in a structured, accountable way.",
    },
    {
      type: "list",
      items: [
        {
          lead: "Services",
          text: "what the practice offers, the language patients use for it, and the conditions each service is meant for.",
        },
        {
          lead: "Providers",
          text: "who sees which patients, their specialties, the ages they treat, the languages they speak, and whether they are accepting new patients.",
        },
        {
          lead: "Coverage",
          text: "the plans each provider accepts, referral and prior authorization rules, and honest self-pay prices.",
        },
        {
          lead: "Availability",
          text: "real openings for real visit types, so an agent can offer a time instead of a phone number.",
        },
        {
          lead: "Rules",
          text: "the practice's own requirements: pre-visit calls, forms, records, and anything that must happen before a patient walks in.",
        },
      ],
    },
    {
      type: "paragraph",
      text: "With that index in place, the same request reads very differently. The agent understands that ear tubes means ear tube insertion, finds a pediatric ENT a few blocks away who is in network with Harbor Mutual, notes that a referral is needed and can be requested automatically, and offers Wednesday at 9:40. The parent says yes. The visit is on the calendar before the coffee is cold.",
    },
    {
      type: "figure",
      tone: "clay",
      caption: "The index turns a practice's tacit knowledge into answers an agent can act on.",
    },
    { type: "heading", text: "From search to the whole visit." },
    {
      type: "paragraph",
      text: "Finding the right clinic is only the first step. Once a personal agent can read a practice, it can also work with one. If a surgeon requires a pre-visit phone call with a medical assistant, the patient's agent can learn that rule, ask the parent whether to handle it, and coordinate the call. When the visit is over and a charge arrives, the agent can check it against the estimate, confirm the plan's coverage, and pay it with the family's HSA card, saving the receipt to the child's records.",
    },
    {
      type: "paragraph",
      text: "Over time, the most important conversations will happen between agents. A patient's agent talks to the practice's front desk agent. The practice's agent talks to a hospital's surgical scheduling agent, a lab, or an insurer. Each one works within the rules of the organization it represents, and each one leaves a clear record of what it did and why.",
    },
    {
      type: "paragraph",
      text: "That is a very different picture of healthcare operations than the one most teams live with today. Not a busier inbox, but fewer handoffs that disappear. Not more portals, but fewer moments where a patient has to repeat themselves to someone who should already know.",
    },
    { type: "heading", text: "The practice stays in control." },
    {
      type: "paragraph",
      text: "None of this works if practices have to give up control to get there. A clinic should decide what an agent can see and what it cannot. Some services should be bookable directly. Some should be request only. Some, like a hearing aid fitting that needs an in-person consultation first, should be hidden from agents entirely. The practice sets those rules, reviews the work, and can change its mind at any time.",
    },
    {
      type: "paragraph",
      text: "That is why we build each practice its own intelligence model, rather than renting one generic assistant to everyone. A practice's model learns its services, its voice, and its protocols, and it improves from the work its own agents complete. The knowledge that made the practice good stays with the practice.",
    },
    {
      type: "quote",
      text: "Practices and their patients should own their health intelligence, not borrow it.",
    },
    { type: "heading", text: "What we are building toward." },
    {
      type: "paragraph",
      text: "The era of personal agents will reward the practices that are easy to understand. Not the loudest, or the ones with the biggest marketing budgets, but the ones whose services, coverage, and availability can be read clearly and trusted. That is a fairer front door than the one healthcare has today, and it is one that independent practices can win.",
    },
    {
      type: "paragraph",
      text: "We started Doe to make sure the people delivering care are ready for that shift, and that patients arriving through it actually get where they are trying to go. The parent at 9:41 should get an answer, not a phone number. We are building the infrastructure so they can.",
    },
  ],
};

const DOCTOR_LED_DESIGN: DoeHealthBlogArticle = {
  slug: "product-design-led-by-doctors",
  wave: { top: 0.47, amp: 55, phase: 2.2, scale: 0.95 },
  eyebrow: "Design",
  title: ["Providers at Every Stage", "of Product Design"],
  author: "James Lisondra",
  date: "October 7, 2026",
  excerpt:
    "Clinical software is usually designed for the people who buy it. We design Doe with the people who use it, in the rooms where care happens.",
  heroTone: "panel",
  lede: "The best design decisions in healthcare software are made by people who have stood in the room when it fails.",
  blocks: [
    {
      type: "paragraph",
      text: "Most clinicians can tell you, in detail, about the worst screen they use every day. They know which button is three clicks too deep, which alert fires on every chart, and which field has to be filled in twice because two systems do not talk to each other. They rarely got a say in how any of it was built.",
    },
    {
      type: "paragraph",
      text: "Healthcare software has historically been designed for the buyer: the administrator choosing a vendor, the compliance team reviewing a contract, the IT department planning an integration. Those people matter. But the person who lives with the product is the medical assistant on the phone at 8:05, the physician closing notes at 9 p.m., and the patient trying to understand what happens next.",
    },
    { type: "heading", text: "Design starts on the clinic floor." },
    {
      type: "paragraph",
      text: "Doe is designed by doctors and people training to become them. That is not a marketing line. It changes what we notice. When you have rounded on a busy service, you know that a perfectly organized dashboard is useless if it hides the one result that needs attention. When you have worked a front desk, you know that the first ten seconds of a call decide whether a patient feels helped.",
    },
    {
      type: "paragraph",
      text: "So we start every feature where the work actually happens. We sit with front desk teams through a Monday morning rush. We watch how a nurse triages an inbox. We listen to how a physician explains a plan to a family, because the words they choose are the words our agents should learn to use.",
    },
    {
      type: "figure",
      tone: "clay",
      caption: "Every workflow begins as an observation in a real clinic, not a requirement in a document.",
    },
    { type: "heading", text: "Clinical judgment is a design material." },
    {
      type: "paragraph",
      text: "In most software, defaults are a product decision. In healthcare, they are a clinical one. Which message goes out automatically and which waits for review. When an agent escalates to a nurse instead of answering. How a refill request is routed when the last visit was eleven months ago. These choices encode judgment, and we think that judgment should come from people trained to make it.",
    },
    {
      type: "paragraph",
      text: "That is why clinicians sit in our design reviews, not just our user interviews. They help decide what the agent is allowed to do on its own, what it should prepare for a human to approve, and what it should never attempt. The goal is not to automate judgment away. It is to give judgment more room by taking the repetitive work around it.",
    },
    {
      type: "quote",
      text: "A good clinical tool should feel like a colleague who already read the chart, not a form that asks you to read it again.",
    },
    { type: "heading", text: "Our design principles." },
    {
      type: "paragraph",
      text: "Over the past year, a handful of principles have shaped nearly every decision we make. They came from the clinic, and we test new work against them before it ships.",
    },
    {
      type: "list",
      items: [
        {
          lead: "Context before action",
          text: "every agent action starts from the patient's thread, so nobody has to reconstruct the story from scattered tabs.",
        },
        {
          lead: "Review is a first-class step",
          text: "drafts, orders, and messages are prepared for approval in the place a clinician already works, with the reasoning visible.",
        },
        {
          lead: "Speak the practice's language",
          text: "agents use the clinic's own greetings, terms, and protocols, so patients hear their practice, not a generic assistant.",
        },
        {
          lead: "Fewer handoffs, clearer owners",
          text: "work that needs a person goes to the right person with everything they need, and it stays visible until it is done.",
        },
        {
          lead: "Quiet by default",
          text: "we interrupt only when it matters. An alert that fires on every chart is an alert nobody reads.",
        },
      ],
    },
    {
      type: "figure",
      tone: "umber",
      caption: "Review sits where clinicians already work, with the reasoning behind each draft one glance away.",
    },
    { type: "heading", text: "Built for the 9:40 slot." },
    {
      type: "paragraph",
      text: "We design for specific moments, not abstract personas. The 9:40 slot that just opened because a patient cancelled. The prior authorization that needs a member ID before the MRI can be scheduled. The lab result that came back on a Friday afternoon. Each of these has a right next step, a person who owns it, and a patient waiting on the outcome.",
    },
    {
      type: "paragraph",
      text: "When we design around those moments, the product gets simpler. An agent that knows the slot just opened can offer it to the patient who asked for an earlier time. An agent that knows the auth is waiting on a member ID can ask for it in the confirmation text. The interface becomes less about navigation and more about what should happen next.",
    },
    { type: "heading", text: "Designed with patients, too." },
    {
      type: "paragraph",
      text: "Doctors lead our design, but they do not design alone. Patients are on the other side of every workflow we build, and increasingly they arrive through their own personal agents. We test how reminders read on a lock screen, how a billing message lands with a worried parent, and how an agent explains a referral requirement without making anyone feel lost.",
    },
    {
      type: "paragraph",
      text: "The clinicians on our team are often the first to catch where a message sounds clinical when it should sound kind, or kind when it should be precise. That balance is hard to get right from outside medicine. It is much easier when the people designing the product have had the conversation themselves.",
    },
    {
      type: "paragraph",
      text: "We believe the next generation of healthcare software will be judged by the people who use it every day. We would rather earn that judgment in the clinic, one workflow at a time, than in a sales deck. That is what it means for product design to be led by doctors.",
    },
  ],
};

const ONE_PRICE: DoeHealthBlogArticle = {
  slug: "health-intelligence-for-one-price",
  wave: { top: 0.42, amp: 90, phase: 0.9, scale: 1.05 },
  eyebrow: "Pricing",
  title: ["Health intelligence", "for One Price"],
  author: "Matthew Lisondra",
  date: "September 30, 2026",
  excerpt:
    "Seats, modules, minutes, and tokens make healthcare AI hard to buy and harder to trust. We think a practice's intelligence should come at one clear price.",
  heroTone: "cream",
  lede: "If a practice has to do math before every call its agents take, the pricing is working against the care.",
  blocks: [
    {
      type: "paragraph",
      text: "Ask a practice manager how much their software actually costs and you will usually get a pause, then a spreadsheet. There is a per-seat license for the scheduling system, a separate module for reminders, a per-minute rate for the answering service, an implementation fee, a renewal escalator, and now, increasingly, a usage meter for AI that counts tokens, calls, or conversations.",
    },
    {
      type: "paragraph",
      text: "Each line item made sense to someone when it was written. Together they make it remarkably hard for a practice to know what it is paying for, and remarkably easy to feel penalized for using the tools it bought.",
    },
    { type: "heading", text: "Metered intelligence changes behavior." },
    {
      type: "paragraph",
      text: "Usage-based pricing sounds fair in theory: you pay for what you use. In a clinic, it quietly creates the wrong incentive. When every call answered by an agent or every note drafted by a model adds to a bill, teams start rationing. They turn off the after-hours line in slow months. They hesitate to let an agent follow up on every lab result. The technology that was supposed to give staff time back becomes another budget to watch.",
    },
    {
      type: "paragraph",
      text: "Patients feel that rationing, even if they never see the invoice. It shows up as a missed reminder, a callback that never came, or a follow-up that waited until someone had time.",
    },
    {
      type: "figure",
      tone: "umber",
      caption: "Line-item pricing makes the most useful work the most expensive to run.",
    },
    {
      type: "quote",
      text: "A practice should never have to choose between using its intelligence and affording it.",
    },
    { type: "heading", text: "One model, one price." },
    {
      type: "paragraph",
      text: "Doe is built around a simple idea: each practice gets its own intelligence model, and that model should come at one clear price. Not a base fee with add-ons. Not a meter that runs every time an agent picks up the phone. One price for the model, and for the agents that run on it.",
    },
    {
      type: "paragraph",
      text: "That is possible because of how we build. Every agent in a practice, from the front desk line to prior authorization to billing, runs on the same model and the same index of the practice. Adding the next agent does not mean buying a new product. It means turning on work the model already understands.",
    },
    { type: "heading", text: "What one price includes." },
    {
      type: "list",
      items: [
        {
          lead: "Your intelligence model",
          text: "built from your practice's services, providers, coverage, and protocols, and owned by your practice.",
        },
        {
          lead: "Agents for every task",
          text: "front desk, scheduling, prior auth, referrals, results, refills, billing, and reminders, all on your model.",
        },
        {
          lead: "Weekly improvement",
          text: "the week's finished work becomes the next version of your model, so it keeps getting better without a new contract.",
        },
        {
          lead: "Agent-ready visibility",
          text: "a machine-readable index of your practice, so patients' personal agents can find, book, and pay without a phone call.",
        },
        {
          lead: "Setup and support",
          text: "onboarding with people who understand clinics, not a separate implementation project.",
        },
      ],
    },
    {
      type: "figure",
      tone: "gold",
      caption: "Every agent runs on the same model, so the next workflow is a switch, not a purchase.",
    },
    { type: "heading", text: "Why it matters for independent practices." },
    {
      type: "paragraph",
      text: "Large health systems have procurement teams that can negotiate dozens of contracts and model out usage scenarios. A three-provider pediatric practice does not. Complicated pricing is not just an inconvenience for smaller practices. It is a barrier that keeps the best tools concentrated in the organizations that already have the most resources.",
    },
    {
      type: "paragraph",
      text: "As personal agents become a front door to care, that gap will matter more. Practices that are easy for agents to find and work with will see more of the patients looking for them. We want that advantage to be available to the independent clinic down the street, not only to the largest systems in a region.",
    },
    { type: "heading", text: "Predictable for practices, honest for patients." },
    {
      type: "paragraph",
      text: "There is a symmetry here that we care about. We ask practices to publish clear, honest prices to patients and their agents: what a visit costs, what a plan covers, and what will be due. It would be strange to build that infrastructure while hiding our own pricing behind a meter.",
    },
    {
      type: "paragraph",
      text: "One price makes Doe easy to evaluate, easy to budget for, and easy to grow into. More importantly, it lets a practice use its intelligence the way it should be used: on every call, every follow-up, and every patient, without anyone doing math first.",
    },
  ],
};

const PERSONAL_AGENTS_FOR_PRACTICE: DoeHealthBlogArticle = {
  slug: "personal-agents-for-practice",
  wave: { top: 0.4, amp: 60, phase: 1.7, scale: 1.15 },
  eyebrow: "For Practices",
  title: ["Personal Agents", "for Every Practice"],
  author: "James Lisondra",
  date: "October 15, 2026",
  excerpt:
    "A personal agent should fit the practice in front of it, whether that is one clinician, a mobile team, or a network of sites.",
  heroTone: "clay",
  lede: "Every practice can run its own personal agent. What changes is the shape of the practice it has to read.",
  blocks: [
    { type: "heading", text: "Practices, in every shape." },
    {
      type: "list",
      items: [
        {
          lead: "Independent",
          text: "One clinician and one front desk. The agent knows the practice well enough to answer the phone and book the visit before the call ends.",
        },
        {
          lead: "Mobile",
          text: "Care that travels to the patient. The agent knows which team is on the road, what each visit can take, and when the next opening is, so a home visit books as easily as a clinic slot.",
        },
        {
          lead: "Enterprise",
          text: "Many sites with one set of clinical rules. Each location keeps its services, providers, and availability current, and every patient gets the same clear answer.",
        },
      ],
    },
    {
      type: "paragraph",
      text: "The model is the same in each case. The practice writes down what it does, the agent reads it, and the practice decides what gets offered and when.",
    },
    { type: "heading", text: "Personal Agents for every discipline." },
    {
      type: "paragraph",
      text: "The same approach works across the whole care team, not only physicians. A patient's agent should find the right clinician for the need in front of it.",
    },
    {
      type: "list",
      items: [
        { lead: "Medical", text: "Primary care, specialists, and the referrals between them." },
        { lead: "Dental", text: "Cleanings, urgent visits, and the coverage rules that come with them." },
        { lead: "PT", text: "Evaluations, follow-up sessions, and the authorizations that often sit in front of them." },
        { lead: "Home Care", text: "Visits planned around the patient's home, with the caregiver's availability in view." },
      ],
    },
    {
      type: "figure",
      tone: "clay",
      caption: "Medical → Dental → PT → Home Care. Each one publishes the same clear index, so the next can pick up the care without starting over.",
    },
    {
      type: "quote",
      text: "One way for a practice to be read, whatever its size or shape.",
    },
  ],
};

const HOSPITALS_SPEAK_AGENT: DoeHealthBlogArticle = {
  slug: "hospitals-learn-to-speak-agent",
  wave: { top: 0.44, amp: 85, phase: 3.1, scale: 0.85 },
  eyebrow: "For Hospitals",
  title: ["Hospitals Learn", "to Speak Agent"],
  author: "Matthew Lisondra",
  date: "October 15, 2026",
  excerpt:
    "A hospital is a dozen front doors in one building. If it writes them down clearly, a personal agent can find the right one for every patient.",
  heroTone: "umber",
  lede: "A patient sees one hospital. An agent sees the emergency department, the surgical schedule, the lab, and discharge, each with its own rules and its own phone number.",
  blocks: [
    {
      type: "paragraph",
      text: "Walk into a hospital and you see one building. Patients experience many doors: the emergency department, the referral line, the surgical schedule, the imaging desk, the discharge lounge. Each has its own rules, its own number, and its own staff trying to keep up.",
    },
    { type: "heading", text: "The hospital is a network of rules." },
    {
      type: "paragraph",
      text: "A personal agent helping a patient through that network has to know which door to use. Which surgeon operates on which campus. Which steps must happen before a date can be held. Which imaging is in network under a given plan. Today that knowledge lives in the heads of schedulers and in binders behind the desk.",
    },
    { type: "heading", text: "Write it once, for every door." },
    {
      type: "paragraph",
      text: "Doe gives a hospital the same machine-readable index it gives a clinic: services, providers, coverage, availability, and rules, organized by campus and department. The agent reads it and sends each request to the right place.",
    },
    {
      type: "list",
      items: [
        {
          lead: "Campuses",
          text: "where each service happens and how to reach the team that runs it.",
        },
        {
          lead: "Surgical scheduling",
          text: "which procedures book directly, which need a consult first, and what has to happen before a date is held.",
        },
        {
          lead: "Discharge",
          text: "follow-up visits, medication pickup, and home care handoffs, arranged before the patient leaves.",
        },
        {
          lead: "Coverage",
          text: "in-network status by plan, referral and authorization rules, and estimates the patient can see before they arrive.",
        },
      ],
    },
    {
      type: "figure",
      tone: "sand",
      caption: "A hospital's index routes a request to the right campus, team, and step, instead of the right phone extension.",
    },
    {
      type: "paragraph",
      text: "The result is fewer handoffs that disappear. A patient's agent can see that a knee replacement needs a pre-op visit, book it at the right campus, confirm the authorization, and hold the surgery date, while the hospital's own agent keeps the schedule honest.",
    },
    {
      type: "quote",
      text: "A hospital should be as easy to find as a restaurant, and as clear about what it can do for you.",
    },
    { type: "heading", text: "The hospital keeps the keys." },
    {
      type: "paragraph",
      text: "Hospitals set the rules. They decide what an agent can book, what needs a person to approve, and what is never offered automatically. Clinical leaders review the index, change it when a service moves, and see every action an agent took on a patient's behalf.",
    },
  ],
};

const CLAIMS_WITHOUT_HOLD_MUSIC: DoeHealthBlogArticle = {
  slug: "claims-without-the-hold-music",
  wave: { top: 0.41, amp: 75, phase: 4.4, scale: 1.3 },
  eyebrow: "For Insurance",
  title: ["Claims Without", "the Hold Music"],
  author: "Matthew Lisondra",
  date: "October 15, 2026",
  excerpt:
    "Most of the hours patients lose to insurance are spent waiting. An agent that can read the plan and the practice can do most of that work in seconds.",
  heroTone: "gold",
  lede: "The premium is not what patients dread most. It is the call that goes nowhere, the claim denied for a missing code, and the bill that arrives after the visit.",
  blocks: [
    {
      type: "paragraph",
      text: "Ask a patient what frustrates them most about their insurance, and the answer is rarely the premium. It is the wait. The call that loops back to the start, the prior authorization that took three weeks, the claim that was denied for a reason nobody can explain.",
    },
    { type: "heading", text: "Coverage should be a question, not a phone call." },
    {
      type: "paragraph",
      text: "A personal agent can ask coverage questions the way patients do: will this plan pay for this visit, with this provider, at this location, and what will I owe? To answer accurately, it needs the plan's rules and the practice's coverage index, both written in a form it can read.",
    },
    {
      type: "list",
      items: [
        {
          lead: "Eligibility",
          text: "whether the plan is active and which benefits apply, checked before a visit is booked.",
        },
        {
          lead: "Authorization",
          text: "which services need approval, what the request has to include, and when it can be sent.",
        },
        {
          lead: "Claims",
          text: "checked against the estimate and the plan's rules before a bill is paid, so errors show up early.",
        },
        {
          lead: "Appeals",
          text: "the denial reason, the records that answer it, and the next step, drafted for a person to review.",
        },
      ],
    },
    {
      type: "figure",
      tone: "gold",
      caption: "The denial reason, the notes that answer it, and a draft appeal, ready for a family to approve before anything is sent.",
    },
    {
      type: "paragraph",
      text: "When a claim is denied, the agent does not sit on hold. It reads the reason, finds the notes that answer it, drafts the appeal, and asks the family before anything goes out.",
    },
    {
      type: "quote",
      text: "The best claim is the one that never needed an appeal.",
    },
    { type: "heading", text: "Insurers and practices get a clear record." },
    {
      type: "paragraph",
      text: "Insurers benefit too. When a practice's agent and a patient's agent exchange structured answers, fewer requests bounce back for missing details, and fewer disputes start from a misunderstanding. Every exchange leaves a record both sides can read.",
    },
    {
      type: "paragraph",
      text: "Doe's job is to make those answers readable. Then the phone call becomes the exception, and the hold music can finally stop.",
    },
  ],
};

export const DOEHEALTH_BLOG_ARTICLES = [
  PERSONAL_AGENTS,
  PERSONAL_AGENTS_FOR_PRACTICE,
  HOSPITALS_SPEAK_AGENT,
  CLAIMS_WITHOUT_HOLD_MUSIC,
  DOCTOR_LED_DESIGN,
  ONE_PRICE,
] as const;

/** /news/[slug] renders this article directly. */
export const DOEHEALTH_BLOG_FEATURED = PERSONAL_AGENTS;

export function doehealthBlogArticlePath(slug: string) {
  return `${DOEHEALTH_BLOG_PATH}/${slug}`;
}

export function doehealthBlogArticle(slug: string) {
  return DOEHEALTH_BLOG_ARTICLES.find((article) => article.slug === slug);
}

export function doehealthBlogOtherArticles(slug: string) {
  return DOEHEALTH_BLOG_ARTICLES.filter((article) => article.slug !== slug);
}

export function doehealthBlogTitle(article: DoeHealthBlogArticle) {
  return article.title.join(" ");
}
