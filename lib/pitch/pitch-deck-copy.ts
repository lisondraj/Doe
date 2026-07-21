import {
  ABOUT_MOBILE_TAM_CHART,
} from "@/lib/about/about-page-article";
import {
  DESIGNERS_PRODUCT_LEAD,
  DESIGNERS_PRODUCT_NEXT_BODY,
  DESIGNERS_PRODUCT_NEXT_HEADLINE,
  DESIGNERS_PRODUCT_VOICE_FEATURES,
  DESIGNERS_PRODUCT_VOICE_LEAD,
} from "@/lib/designers/designers-product-copy";
import { DOEHEALTH_CLOSING_LABEL_CAROUSEL_ITEMS } from "@/lib/doehealth/doehealth-closing-label-carousel";
import { DOEHEALTH_HERO_HEADLINE } from "@/lib/doehealth/doehealth-hero-copy";
import { DOEHEALTH_INTRO_COPY } from "@/lib/doehealth/doehealth-intro-copy";
import { DOEHEALTH_VOICE_ROADMAP } from "@/lib/doehealth/doehealth-voice-roadmap";
import { JOIN_HERO_EXTRA_BANDS } from "@/lib/join/join-hero-backdrops";
import {
  PRODUCT_LANDING_DAY_SUMMARY,
} from "@/lib/product/product-copy";

const missionBand = JOIN_HERO_EXTRA_BANDS.find((band) => band.id === "incoming");
const integrateBand = JOIN_HERO_EXTRA_BANDS.find((band) => band.id === "integrate");

export const PITCH_WELCOME = {
  eyebrow: "Pitch deck",
  headline: [DOEHEALTH_HERO_HEADLINE.line1, DOEHEALTH_HERO_HEADLINE.line2] as const,
  subhead: DESIGNERS_PRODUCT_LEAD,
  tagline: DOEHEALTH_INTRO_COPY.title.line2,
};

export const PITCH_PROBLEM = {
  headline: ["We entered medicine", "to care for people."],
};

export const PITCH_SOLUTION = {
  headline: ["Built by clinicians,", "for clinicians."],
};

export const PITCH_TEAM = {
  headline: "Building together.",
  founders: [
    {
      lines: ["James", "Lisondra"] as const,
      placement: "top-left" as const,
      roleLabel: "Founder",
      roleLabelPlacement: "below-name" as const,
      credentials: ["Medical Student,", "University of Ottawa"] as const,
      credentialsPlacement: "bottom-right" as const,
      tags: ["Product Design", "Operations", "Go To Market"] as const,
      tagsPlacement: "bottom-left" as const,
    },
    {
      lines: ["Matthew", "Lisondra"] as const,
      placement: "bottom-right" as const,
      roleLabel: "Founding Engineer",
      roleLabelPlacement: "above-name" as const,
      credentials: [
        "Robotics & Computer Engineering",
        "PhD Candidate,",
        "University of Toronto",
      ] as const,
      credentialsPlacement: "top-left" as const,
      tags: ["Machine Learning", "AI Systems", "Infrastructure"] as const,
      tagsPlacement: "top-right" as const,
    },
  ],
};

export const PITCH_MARKET = {
  eyebrow: "Market",
  headline: ["Validation &", "market size."],
  intro: ABOUT_MOBILE_TAM_CHART.caption,
  tamHeadline: ABOUT_MOBILE_TAM_CHART.highlight.headline,
  tamValue: `$${ABOUT_MOBILE_TAM_CHART.highlight.valueB}B USD`,
  tamLabel: ABOUT_MOBILE_TAM_CHART.highlight.tamLabel,
  bars: ABOUT_MOBILE_TAM_CHART.bars,
  gtm: missionBand?.description?.[1] ?? "",
};

export const PITCH_PRODUCT_VOICE = {
  eyebrow: "Product 1",
  headline: ["Voice agents,", "live today."],
  lead: DESIGNERS_PRODUCT_VOICE_LEAD,
  stats: {
    calls: PRODUCT_LANDING_DAY_SUMMARY.last24h.totalCalls,
    resolved: `${PRODUCT_LANDING_DAY_SUMMARY.last24h.resolvedPct}%`,
    overnight: PRODUCT_LANDING_DAY_SUMMARY.last24h.overnightCalls,
  },
  features: DESIGNERS_PRODUCT_VOICE_FEATURES,
} as const;

export const PITCH_PRODUCT_ROADMAP = {
  eyebrow: "Product 2",
  headline: [DESIGNERS_PRODUCT_NEXT_HEADLINE.replace(".", ""), "the full journey."],
  body: DESIGNERS_PRODUCT_NEXT_BODY,
  focus: DOEHEALTH_VOICE_ROADMAP.focus,
  rows: DOEHEALTH_VOICE_ROADMAP.nextRows,
};

export const PITCH_ASK = {
  eyebrow: "The ask",
  headline: ["Partner with us."],
  body:
    integrateBand?.description?.[1] ??
    "We are currently fundraising with US and Canadian backers who share our belief that better clinical communication starts with software providers can shape themselves.",
  points: [
    "Validate in the Canadian healthcare market, then expand to the US.",
    "Building the team — technical talent who care about healthcare and AI.",
    "Delaware corporation · physicians first, then broader clinical teams.",
  ],
};

export const PITCH_CLOSING = {
  eyebrow: "Thank you",
  headline: ["Built by doctors,", "for doctors."],
  wordmark: "Doe",
  pills: DOEHEALTH_CLOSING_LABEL_CAROUSEL_ITEMS,
  contact: "james@doe.care",
};
