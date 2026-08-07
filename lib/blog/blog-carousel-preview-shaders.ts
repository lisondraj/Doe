import type { ProtoGrainGradientVariant } from "@/lib/proto/proto-grain-gradient";

/** Frozen shader flows for the related-post carousel — all unique, no truchet (worm). */
export const BLOG_CAROUSEL_PREVIEW_SHADERS: Record<string, ProtoGrainGradientVariant> = {
  "pulse-call-history": "integrate",
  "pulse-ambient": "validate",
  "introducing-pulse": "looking-ahead",
  "introducing-fabric": "meet-proto",
  "introducing-float": "prototype",
  "intelligence-for-every-clinic": "meet-proto-stack-1",
  "introducing-genome": "build-hero",
  "genome-is-built-for-you": "meet-proto",
  "the-broader-doe-vision": "build-hero",
};

export function blogCarouselPreviewShader(slug: string): ProtoGrainGradientVariant {
  return BLOG_CAROUSEL_PREVIEW_SHADERS[slug] ?? "agents";
}
