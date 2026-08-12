import { ABOUT_PAGE_HERO_BACKDROP } from "@/lib/about/about-page-article";
import type { AboutStyleLongformArticle } from "@/lib/blog/about-style-longform-article";

export const OUR_FOUNDER_STORY_SLUG = "our-founder-story";

export const OUR_FOUNDER_STORY_PATH = `/blog/${OUR_FOUNDER_STORY_SLUG}`;

export const OUR_FOUNDER_STORY_ARTICLE = {
  slug: OUR_FOUNDER_STORY_SLUG,
  path: OUR_FOUNDER_STORY_PATH,
  title: "Our Founder Story",
  excerpt:
    "Learn more about Doe's founders, company structure, and early-stage plan.",
  subheading: "Learn more about Doe's founders, company structure,",
  subheadingLine2: "early-stage plan",
  openingLede:
    "Doe is a healthcare technology organization built around a simple belief: the people closest to care should help shape the intelligent tools that support it.",
  openingLedeContinuation:
    "We are still in our early stages, and we are being deliberate about how the company is structured, how we work together, and what we choose to build first. This article shares how my brother Matthew and I came to build Doe, how our paths converged, and how we plan to stay lean as we grow.",
  byline: "By James Lisondra",
  date: "August 12, 2026",
  heroBackdrop: ABOUT_PAGE_HERO_BACKDROP,
  contentBlocks: [
    {
      type: "goldParagraph",
      text: "Doe is organized to move carefully in the near term and build with conviction over the long term. We are not trying to sound larger than we are. We are trying to build something durable.",
    },
    {
      type: "subheading",
      text: "What Doe is, at this stage",
    },
    {
      type: "paragraph",
      text: "At its core, Doe is a company focused on intelligent tools for healthcare. We care about how providers, clinics, and the people preparing to enter health professions experience software that is meant to support real work. We are building in public stages, sharing direction before every detail is finalized, and learning from the providers and partners who engage with us early.",
    },
    {
      type: "paragraph",
      text: "Our organization is intentionally small. We believe clarity comes from staying close to the work: product decisions, design, engineering, distribution, and the day-to-day operations that keep a young company moving. That closeness is part of how we plan to earn trust during these first chapters.",
    },
    {
      type: "quote",
      id: "founder-story-organization-quote",
      lead: "We are building Doe as an organization that can grow without losing the thread",
      continuation:
        "The goal is not to expand for its own sake. **The goal is to build tools that providers and health trainees actually want to use.**",
    },
    {
      type: "subheading",
      text: "Two paths that converged",
    },
    {
      type: "paragraph",
      text: "Matthew and I have been building together in one form or another since we were younger. We did not follow identical paths, and that difference has become one of Doe's strengths. I moved toward medicine, design, and the problem of how intelligent tools reach the people who deliver care. Matthew moved toward engineering, research, and the technical systems required to make those tools reliable.",
    },
    {
      type: "paragraph",
      text: "For a time, those paths looked separate. I was deepening my understanding of healthcare, communication, and what providers need from the products they adopt. Matthew was deepening his understanding of how complex systems are designed, implemented, and maintained. When we came back together around Doe, it was not because we had drifted apart. It was because both paths had matured toward the same question: how should intelligent tools be built for healthcare?",
    },
    {
      type: "shader",
      id: "founder-story-paths-shader",
      shaderVariant: "looking-ahead",
      caption:
        "Two disciplines, one direction: product and distribution on one side, engineering and systems on the other.",
    },
    {
      type: "subheading",
      text: "Complementary by design",
    },
    {
      type: "paragraph",
      text: "Between the two of us, we cover much of what it takes to run an early-stage company. That is not a claim that we do everything perfectly. It is a statement about how we have chosen to work.",
    },
    {
      type: "bullets",
      id: "founder-story-james-scope",
      items: [
        "**Product and graphic design:** shaping how Doe looks, reads, and feels across iPhone and desktop experiences.",
        "**Distribution to health providers:** building relationships with the clinicians, trainees, and organizations we hope to serve.",
        "**Capital and partnerships:** securing the resources and conversations required to build responsibly in early stages.",
        "**Recruiting and operations:** keeping the company organized, intentional, and ready for the next phase of work.",
      ],
    },
    {
      type: "bullets",
      id: "founder-story-matthew-scope",
      items: [
        "**Technical architecture:** designing the systems that power Doe's intelligent tools.",
        "**Engineering execution:** building, testing, and maintaining the product with rigor.",
        "**Internal tooling:** creating the technical foundation that lets a small team move quickly without cutting corners.",
      ],
    },
    {
      type: "quote",
      id: "founder-story-complement-quote",
      lead: "We do not need a large team to cover the first principles of the company",
      continuation:
        "What we need is overlap where it matters and separation where expertise should stay sharp. **That is how we work today.**",
    },
    {
      type: "subheading",
      text: "Staying lean on purpose",
    },
    {
      type: "paragraph",
      text: "Matthew and I are brothers, which gives us a working relationship built on years of trust, direct communication, and shared standards. That pairing lets Doe stay lean in a way many startups cannot. We can move from conversation to decision quickly. We can cover product, design, engineering, and operations without layers of coordination that slow early work down.",
    },
    {
      type: "paragraph",
      text: "Staying lean is not about avoiding growth forever. It is about preserving judgment while the company is still defining itself. We would rather build fewer things well than spread attention across too many directions at once.",
    },
    {
      type: "goldParagraph",
      text: "Our plan is to grow the organization when the work truly requires it, not because a chart says we should.",
    },
    {
      type: "subheading",
      text: "Building our own internal tools",
    },
    {
      type: "paragraph",
      text: "One of the less visible parts of Doe is how much we build for ourselves first. We are developing internal systems that help us recruit, organize work, and move faster as a small team. These tools are not side projects. They are part of how we plan to operate.",
    },
    {
      type: "paragraph",
      text: "Proto is one example. It is our automated approach to recruiting and related workflows, designed to reduce repetitive work and keep hiring thoughtful as the company grows. We use it across iPhone and desktop because our own work happens in both environments. Building internally gives us a clear test case before we ask anyone else to rely on a workflow.",
    },
    {
      type: "bullets",
      id: "founder-story-proto-bullets",
      items: [
        "**Recruiting automation:** Proto helps us manage outreach, organization, and follow-through without losing the human part of hiring.",
        "**Cross-device by default:** The same internal tools are designed for phone and desktop because that is how we actually work.",
        "**Built before scaled:** We use our own systems first so we understand what is useful before we generalize it.",
      ],
    },
    {
      type: "shader",
      id: "founder-story-proto-shader",
      shaderVariant: "meet-proto-stack-1",
      caption:
        "Proto and our other internal tools are part of how a lean team covers recruiting, operations, and product velocity.",
    },
    {
      type: "subheading",
      text: "What comes next",
    },
    {
      type: "paragraph",
      text: "We will continue sharing more about Doe's direction, our programs for health trainees and partners, and the intelligent tools we are preparing for launch. For now, this is the shape of the company: two founders with complementary paths, a lean structure, and a bias toward building carefully.",
    },
    {
      type: "quote",
      id: "founder-story-closing-quote",
      lead: "We are early, and we mean that honestly",
      continuation:
        "Doe is being built by two brothers who chose to bring their paths back together around a shared vision for healthcare. **We welcome the people who want to follow along as that story unfolds.**",
    },
  ],
  bodyParagraphs: [],
  proposalHighlightLead: "",
  proposalHighlightContinuation: "",
  proposalClosing: "",
  thesisSectionHeadline: "",
  thesisIntro: "",
  thesisPoints: [],
  closing: "",
  finalParagraph:
    "If you would like to learn more about Doe, our founders, or our early-stage plans, we would welcome the conversation.",
  emailInviteHeadline: "We'd love to chat.",
  emailInviteLabel: "Email James",
} satisfies AboutStyleLongformArticle;

export const OUR_FOUNDER_STORY_TITLE = OUR_FOUNDER_STORY_ARTICLE.title;

export const OUR_FOUNDER_STORY_EXCERPT = OUR_FOUNDER_STORY_ARTICLE.excerpt;
