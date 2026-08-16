import { DESIGNERS_PRODUCT_NEXT_BODY, DESIGNERS_PRODUCT_NEXT_HEADLINE } from "@/lib/designers/designers-product-copy";
import { DOEHEALTH_VOICE_ROADMAP } from "@/lib/doehealth/doehealth-voice-roadmap";

export const STORY_ROADMAP_HEADLINE = DESIGNERS_PRODUCT_NEXT_HEADLINE;

export const STORY_ROADMAP_BODY = DESIGNERS_PRODUCT_NEXT_BODY;

export const STORY_ROADMAP_FOCUS_LABEL = "Live today";

export const STORY_ROADMAP_FOCUS = DOEHEALTH_VOICE_ROADMAP.focus;

export const STORY_ROADMAP_AGENT_ROWS = DOEHEALTH_VOICE_ROADMAP.nextRows;

export const STORY_ROADMAP_PRODUCT_EYEBROW = "Product";

export const STORY_GTM_EYEBROW = "Go-to-market";

export const STORY_GTM_HEADLINE = "Canada first, then the US.";

export const STORY_GTM_POINTS: readonly string[] = [
  "Validate with Canadian healthcare clinics, then expand to California and New York City.",
  "Physicians first — then nurse practitioners, PAs, nurses, and allied health teams.",
  "Delaware corporation; fundraising with US and Canadian backers who share our belief.",
] as const;
