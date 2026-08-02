import { ABOUT_PAGE_HERO_BACKDROP } from "@/lib/about/about-page-article";
import { ABOUT_PATH } from "@/lib/site-domains";

export const BROADER_DOE_VISION_SLUG = "the-broader-doe-vision";

/** Primary route — Broader Doe Vision lives at /about. */
export const BROADER_DOE_VISION_PATH = ABOUT_PATH;

export const BROADER_DOE_VISION_TITLE = "The Broader Doe Vision";

export const BROADER_DOE_VISION_SUBHEADING =
  "We believe intelligent tools in healthcare should be built by the providers themselves.";

export const BROADER_DOE_VISION_OPENING_LEDE =
  "I strongly believe that within the next few years, intelligence in medicine will undergo a rapid transformation, completely detached from today's landscape.";

export const BROADER_DOE_VISION_BYLINE = "By James Lisondra";

export const BROADER_DOE_VISION_DATE = "August 2, 2026";

export const BROADER_DOE_VISION_HERO_BACKDROP = ABOUT_PAGE_HERO_BACKDROP;

export const BROADER_DOE_VISION_BODY_PARAGRAPHS = [
  "Over the last few weeks, we have been slowly introducing parts of Doe's vision to the world. We have been sharing our belief that when providers lead the design of their own intelligent tools, we strengthen AI's ability to redefine care.",
  "We are grateful for the immense response to our company's vision and look forward to meeting every physician, hospital administrator, and investor who has reached out. While spots are filing fast, we are expanding availability over the next few weeks to accommodate those who look to discuss Doe's future further.",
  "Current AI tools in healthcare promise to automate various touchpoints of a patient's care journey. However, a majority of those tools appear to pull from the same playbook: give large language models access to sensitive patient data and rely on a generalist model's ability to provide a sufficient response. That response is dependent on what data that model was fed, and whether that model is hosted on compute large enough to handle the complexity of the task.",
  "There exist multiple nuances in the delivery of care, whether between providers, clinics and hospitals, or even horizontally between specialties and more niche provider workflows. These nuances are largely divided geographically, often influenced by local and institutional regulation, and years of cultivating a workplace culture that only it's workers understand.",
  "Yet, these nuances are often unstructured and driven by human intent and emotion, not as easily understood by a generalist playbook.",
] as const;

/** Body paragraph index — AI playbook section with inline bold emphasis. */
export const BROADER_DOE_VISION_AI_PLAYBOOK_PARAGRAPH_INDEX = 2;

export const BROADER_DOE_VISION_AI_PLAYBOOK_PARAGRAPH = {
  before:
    "Current AI tools in healthcare promise to automate various touchpoints of a patient's care journey. However, a majority of those tools appear to pull from the same playbook: ",
  bold:
    "give large language models access to sensitive patient data and rely on a generalist model's ability to provide a sufficient response",
  after:
    ". That response is dependent on what data that model was fed, and whether that model is hosted on compute large enough to handle the complexity of the task.",
} as const;

export const BROADER_DOE_VISION_PROPOSAL_HIGHLIGHT_LEAD =
  "We propose that in the years to come, every provider, every clinic, every hospital and even deeper, every specialty, every small action in healthcare, will be powered by their own intelligence stack.";

export const BROADER_DOE_VISION_PROPOSAL_HIGHLIGHT_CONTINUATION =
  "This stack will be built on top of open-weight models, fortified by frontier tools, and hosted on private cloud compute.";

export const BROADER_DOE_VISION_PROPOSAL_CLOSING =
  "This blend of intelligence is the only path to guaranteeing AI can effectively meet the challenges of a healthcare industry being rapidly redefined by technology every second.";

export const BROADER_DOE_VISION_THESIS_SECTION_HEADLINE = "Doe's Guiding Beliefs";

export const BROADER_DOE_VISION_THESIS_INTRO =
  "Within my broader vision for Doe exists my even more robust enthusiasm in the progression of vertical AI within the next few years:";

export const BROADER_DOE_VISION_THESIS_POINTS = [
  "Professions will increasingly seek intelligence that is personalized and customizable. The tools that power workflows in sectors such as medicine, law, finance, and more will be designed by the professionals themselves.",
  "Professions will rapidly decrease their reliance on frontier AI models, looking to local pipelines involving open-weight models, reinforcement learning, and cloud compute to power their own workflows.",
  "Professions will no longer accept multiple intelligence tools to complete their tasks, often resulting in high costs and degraded output, and turn towards a unified operating system.",
] as const;

export const BROADER_DOE_VISION_CLOSING =
  "These three points form the thesis of our organization and will guide Doe through our early-stages, and in the years to come.";

export const BROADER_DOE_VISION_FINAL_PARAGRAPH =
  "If this vision resonates with you, whether you are a provider, investor, or patient, I'd welcome the chance to connect.";

export const BROADER_DOE_VISION_EMAIL_INVITE_HEADLINE = "We'd love to chat.";

export const BROADER_DOE_VISION_EMAIL_INVITE_LABEL = "Email James";

/** Paragraph index in BROADER_DOE_VISION_BODY_PARAGRAPHS that ends with the contact CTA. */
export const BROADER_DOE_VISION_CONTACT_PARAGRAPH_INDEX = 1;
