import type { ProtoGrainGradientVariant } from "@/lib/proto/proto-grain-gradient";

/**
 * Frozen shader flows for the related-post carousel — all unique, no truchet (worm).
 *
 * Never use "build-hero" here: its blob shape renders as a flat, unbroken colorBack fill
 * (no visible gradient) at every size/palette/animation state we've tried — a shape bug in
 * the pinned @paper-design/shaders-react "blob" preset, not a WebGL budget/mount issue. The
 * home carousel (blog-home-carousel-preview-shaders.ts) already avoids it for this reason.
 */
export const BLOG_CAROUSEL_PREVIEW_SHADERS: Record<string, ProtoGrainGradientVariant> = {
  "pulse-call-history": "integrate",
  "pulse-ambient": "meet-proto-stack-2",
  "introducing-pulse": "looking-ahead",
  "introducing-fabric": "meet-proto",
  "introducing-float": "prototype",
  "intelligence-for-every-clinic": "meet-proto-stack-1",
  "introducing-genome": "shortlist",
  "blended-intelligence": "meet-proto-stack-1",
  "genome-is-built-for-you": "meet-proto",
  "the-broader-doe-vision": "home-integrations",
};

export function blogCarouselPreviewShader(slug: string): ProtoGrainGradientVariant {
  return BLOG_CAROUSEL_PREVIEW_SHADERS[slug] ?? "agents";
}
