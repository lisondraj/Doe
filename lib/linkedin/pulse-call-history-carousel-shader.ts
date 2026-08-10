import { blogCarouselPreviewShader } from "@/lib/blog/blog-carousel-preview-shaders";
import { blogPreviewShaderSurface } from "@/lib/blog/blog-preview-shader-surface";
import { PULSE_CALL_HISTORY_SLUG } from "@/lib/blog/pulse-call-history-article";

/** Same frozen flow + palette as the Pulse Call History blog carousel card. */
export function pulseCallHistoryCarouselShaderSurface() {
  return blogPreviewShaderSurface(blogCarouselPreviewShader(PULSE_CALL_HISTORY_SLUG));
}
