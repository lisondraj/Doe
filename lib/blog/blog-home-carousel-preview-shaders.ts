import type { ProtoGrainGradientVariant } from "@/lib/proto/proto-grain-gradient";

/** Home main-page carousel only — seven unique flows; never build-hero (Broader Doe Vision). */
export const BLOG_HOME_CAROUSEL_PREVIEW_SHADERS: Record<string, ProtoGrainGradientVariant> = {
  "the-broader-doe-vision": "shortlist",
  "introducing-fabric": "front-desk-band",
  "introducing-pulse": "customize-agents-band",
  "pulse-ambient": "ambient-band",
  "pulse-call-history": "integrate",
  "introducing-float": "agents",
  "intelligence-for-every-clinic": "meet-proto-stack-2",
};

export function blogHomeCarouselPreviewShader(slug: string): ProtoGrainGradientVariant {
  return BLOG_HOME_CAROUSEL_PREVIEW_SHADERS[slug] ?? "billing";
}
