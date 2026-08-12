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
    "Doe began with a question my brother Matthew and I could not stop returning to: what would it look like if the people closest to healthcare had intelligent tools that actually reflected the work in front of them?",
  openingLedeContinuation:
    "Doe is built with a long view. We are a focused company led by two brothers whose paths through medicine, design, engineering, and research eventually led back to the same table.",
  byline: "By James Lisondra",
  date: "August 12, 2026",
  heroBackdrop: ABOUT_PAGE_HERO_BACKDROP,
  contentBlocks: [
    {
      type: "goldParagraph",
      text: "This is the story of why we started, how we work, and the principles we intend to preserve as Doe grows.",
    },
    {
      type: "subheading",
      text: "The company we are building",
    },
    {
      type: "paragraph",
      text: "Doe is a healthcare technology company built around a straightforward conviction: the future of care should not be shaped only by people far from the exam room, clinic, classroom, or care team. The people who understand the work should have a meaningful role in shaping the tools that support it.",
    },
    {
      type: "paragraph",
      text: "That conviction gives us a standard. We want Doe to be useful, legible, and grounded in the realities of healthcare. Our work is guided by close listening, deliberate building, and a clear understanding of what people need from the tools they trust.",
    },
    {
      type: "paragraph",
      text: "A company is defined as much by its habits as its roadmap. The choices are small but consequential: what gets built first, who gets heard first, where the team spends time, and what it refuses to rush. Those are the choices we are making now.",
    },
    {
      type: "quote",
      id: "founder-story-organization-quote",
      lead: "We want Doe to grow without becoming distant from the people it is meant to serve",
      continuation:
        "Scale matters only if it protects the quality of the work. **The real goal is to build tools that people in healthcare choose to return to.**",
    },
    {
      type: "subheading",
      text: "Before there was Doe",
    },
    {
      type: "paragraph",
      text: "Matthew and I have been close collaborators since long before Doe had a name. Growing up, we were drawn to different problems, but we shared a habit of taking ideas apart and trying to build them back better. That instinct followed us into adulthood, even as our professional paths began to diverge.",
    },
    {
      type: "paragraph",
      text: "I moved toward medicine. Along the way, I became increasingly interested in the systems surrounding care: the information people carry between appointments, the software teams work around, and the quiet friction that accumulates when a tool does not fit the people using it. I also found a home in product and graphic design, where the question is often the same: can a complex idea become clear enough for someone to trust and use?",
    },
    {
      type: "paragraph",
      text: "Matthew moved deeply into engineering, computer science, robotics, physics, and research. His work trained him to think in systems, constraints, interfaces, and reliability. Where I tended to begin with the person in front of the product, he could trace what would need to happen underneath it for the product to be real.",
    },
    {
      type: "paragraph",
      text: "For years, our paths looked parallel. They were not. They were slowly converging. As AI began to reshape what software could do, the distance between healthcare problems and technical possibility narrowed. Doe became the place where the two perspectives could meet.",
    },
    {
      type: "shader",
      id: "founder-story-paths-shader",
      shaderVariant: "looking-ahead",
      caption:
        "Two paths came together around one shared question: how can technology serve healthcare with more care and more intention?",
    },
    {
      type: "subheading",
      text: "The decision to build together",
    },
    {
      type: "paragraph",
      text: "Starting a company with a sibling is not simply a story about family. It is a practical decision rooted in trust. Matthew and I have years of shared context. We know how the other person thinks under pressure, how to disagree without losing momentum, and when to push an idea further versus when to let it go.",
    },
    {
      type: "paragraph",
      text: "That history gives Doe an unusual operating rhythm. Conversations can be direct. Decisions can be made without lengthy translation. A product idea can move from a sketch, to an engineering discussion, to a working internal version in a much shorter loop. The trust was built before the company, which lets us focus more of our energy on the work itself.",
    },
    {
      type: "goldParagraph",
      text: "Doe is built on a shared vision, but it is made stronger by two distinct ways of seeing the same problem.",
    },
    {
      type: "bullets",
      id: "founder-story-james-scope",
      items: [
        "**Product and graphic design:** I shape how Doe looks, reads, and feels, from the first idea through the iPhone and desktop experiences people encounter.",
        "**Healthcare distribution:** I spend time with providers, health trainees, partners, and organizations to understand where Doe can earn a place in their work.",
        "**Capital and partnerships:** I lead many of the conversations that help secure the resources, relationships, and alignment needed to build responsibly.",
        "**Recruiting and operations:** I help keep the company organized, focused, and prepared for the next stage of its development.",
      ],
    },
    {
      type: "bullets",
      id: "founder-story-matthew-scope",
      items: [
        "**Technical direction:** Matthew leads the systems thinking behind Doe, from the architecture of our products to the technical decisions that make them dependable.",
        "**Engineering execution:** He builds, tests, and refines the software that turns our ideas into real working tools.",
        "**Internal infrastructure:** He develops the foundations that help a small team move quickly while preserving rigor, security, and maintainability.",
      ],
    },
    {
      type: "quote",
      id: "founder-story-complement-quote",
      lead: "Our responsibilities are different, but our standard is shared",
      continuation:
        "A good company needs both proximity to the user and depth in the system. **Doe brings both into the same room.**",
    },
    {
      type: "subheading",
      text: "Why we are staying lean",
    },
    {
      type: "paragraph",
      text: "It is tempting for a growing company to treat headcount as progress. We see it differently. A larger organization can be valuable when the work calls for it, but hiring ahead of clarity creates distance between a company and the reason it exists. In healthcare, where trust and context matter deeply, that distance can become expensive.",
    },
    {
      type: "paragraph",
      text: "For now, being lean means remaining close to product decisions, customer conversations, engineering tradeoffs, and the ordinary operational work of running Doe. It means we can change course when we learn something important. It means the person making a decision can still see the consequence of it.",
    },
    {
      type: "paragraph",
      text: "This is not an argument against growth. It is an argument for earned growth. We expect Doe to bring in more people when the mission requires expertise we do not have, capacity we cannot create alone, or a perspective that makes the company better. Until then, we would rather build a strong foundation than a large org chart.",
    },
    {
      type: "goldParagraph",
      text: "We will grow when the work demands it, not when growth becomes a substitute for focus.",
    },
    {
      type: "subheading",
      text: "We build for ourselves first",
    },
    {
      type: "paragraph",
      text: "One of the most important things we are doing at Doe is less visible from the outside. We are building internal tools for the work of building the company itself. Recruiting, outreach, coordination, research, design feedback, and operations all create small burdens that compound quickly for a lean team.",
    },
    {
      type: "paragraph",
      text: "Proto is an expression of this approach. It is our automated recruiting and internal operations system, created to help us organize potential collaborators, run thoughtful outreach, retain context, and follow through without reducing people to rows in a spreadsheet. It is not meant to replace human judgment. It is meant to give that judgment more room.",
    },
    {
      type: "paragraph",
      text: "We are designing Proto for both iPhone and desktop because our work does not happen in one place. Some decisions happen at a desk with a full working surface. Others happen between meetings, on the way home, or in a few spare minutes. The best internal tools should respect that reality instead of asking people to reshape their lives around a single screen.",
    },
    {
      type: "bullets",
      id: "founder-story-proto-bullets",
      items: [
        "**Thoughtful recruiting:** Proto helps us manage outreach, context, and follow-through while keeping each relationship human.",
        "**Operational memory:** Internal systems help the team retain decisions and next steps so important work is not lost between conversations.",
        "**iPhone and desktop:** We build for the environments where our team actually works, not just the environment that is easiest to demo.",
        "**Use before scale:** We rely on our own systems first, learn where they fail, and improve them before asking anyone else to trust them.",
      ],
    },
    {
      type: "shader",
      id: "founder-story-proto-shader",
      shaderVariant: "meet-proto-stack-1",
      caption:
        "Proto is one part of a broader internal toolkit that helps a small team recruit thoughtfully, organize work, and keep moving.",
    },
    {
      type: "subheading",
      text: "What we want to protect",
    },
    {
      type: "paragraph",
      text: "As Doe grows, there are a few things we want to protect: the directness of our partnership, the humility to learn from people who understand healthcare better than we do, and the patience to build systems that deserve to last. Those principles will matter more than any one release or announcement.",
    },
    {
      type: "paragraph",
      text: "We will keep sharing our direction as it becomes clearer. That includes our work with pre-health students, future professional school programs, provider communities, and the intelligent tools we are preparing for the next stage of Doe. Some details will stay intentionally private while they are still taking shape. The intention behind them will not.",
    },
    {
      type: "quote",
      id: "founder-story-closing-quote",
      lead: "Doe is being built with intention",
      continuation:
        "It is being built by two brothers who brought their paths back together around a shared vision for healthcare. **We are grateful to everyone who chooses to follow the story as it unfolds.**",
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
    "If you would like to learn more about Doe, our founders, or the work ahead, we would welcome the conversation.",
  emailInviteHeadline: "We'd love to chat.",
  emailInviteLabel: "Email James",
} satisfies AboutStyleLongformArticle;

export const OUR_FOUNDER_STORY_TITLE = OUR_FOUNDER_STORY_ARTICLE.title;

export const OUR_FOUNDER_STORY_EXCERPT = OUR_FOUNDER_STORY_ARTICLE.excerpt;
