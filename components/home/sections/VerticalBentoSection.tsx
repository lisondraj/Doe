"use client";

import { lora } from "@/lib/home/fonts";
import { narrowHorizontalInset, VBENTO_CANVAS_PADDING } from "@/lib/home/hero-constants";
import { WORKFLOW_CAROUSEL_GRAIN_STYLE } from "@/lib/workflow-carousel-design-backdrops";
import {
  VBENTO_WORKFLOW_GRADIENTS,
  vbDeriveRails,
  vbDominantRailIndex,
  vbPhaseLocalProgress,
  vbRailHeightPx,
  vbRailsInterGapPx,
  vbSmoothstep01,
} from "@/lib/home/vertical-bento";
import type { VerticalBentoSectionProps } from "@/components/home/PhoneHomeTypes";

export function VerticalBentoSection(props: VerticalBentoSectionProps) {
  const {
    verticalBentoSectionRef,
    verticalBentoHeadlineRef,
    vbMetrics,
    verticalBentoU,
    verticalBentoTitleOpacity,
    verticalBentoTitleTranslateY,
    verticalBentoRailsOpacity,
    verticalBentoRailsTranslateY,
  } = props;

  return (
    <>
      {/* Vertical bento rails — pinned stack + scrub */}
      <section
        ref={verticalBentoSectionRef}
        aria-label="Scroll-driven vertical bento: three workflow panels"
        className={`relative z-10 w-full bg-[#F7F6F3] mt-[clamp(3.75rem,10.5vw,7.75rem)] pt-11 pb-8 md:pt-9 md:pb-6 max-md:pt-11 max-md:pb-12 iphone-page:mt-[clamp(3.25rem,9vw,6.75rem)] iphone-page:pt-12 iphone-page:pb-12 ${VBENTO_CANVAS_PADDING}`}
        style={{ minHeight: vbMetrics.sectionMinPx }}
      >
        <div
          ref={verticalBentoHeadlineRef}
          className={`flex flex-col items-center w-full shrink-0 px-4 ${narrowHorizontalInset} pb-4 max-md:pb-5 iphone-page:pb-6 md:pb-5`}
        >
          <h2
            className={`flex flex-col items-center gap-1 text-center text-gray-900 w-full max-w-[min(100%,42rem)] font-normal tracking-tight leading-[1.06] ${lora.className}`}
            style={{
              paddingTop: "clamp(0.2rem, 1vw, 0.75rem)",
              paddingBottom: "clamp(0.45rem, 1.8vw, 1rem)",
              overflow: "visible",
              textWrap: "balance",
              opacity: verticalBentoTitleOpacity,
              transform: `translateY(${verticalBentoTitleTranslateY}px)`,
              transition: "opacity 1.2s ease-out, transform 1.2s ease-out",
            }}
          >
            <span className="block text-[clamp(2.65rem,11.5vw,4rem)] iphone-page:text-[clamp(1.48rem,6.25vw,4rem)] iphone-page:whitespace-nowrap">
              So you can do
            </span>
            <span className="block text-[clamp(2.65rem,11.5vw,4rem)] iphone-page:text-[clamp(1.48rem,6.25vw,4rem)] iphone-page:whitespace-nowrap">
              Doctor better.
            </span>
          </h2>
        </div>
        <div className="sticky top-[max(5.75rem,calc(env(safe-area-inset-top,0px)+4.5rem))] z-[5] pt-6 pb-6 md:pt-6 md:pb-6 max-md:pt-10 max-md:pb-10 iphone-page:pt-[max(2.75rem,env(safe-area-inset-top,0px))] iphone-page:pb-[max(2.75rem,env(safe-area-inset-bottom,0px))]">
          <div
            className="relative mx-auto w-full max-w-full shrink-0"
            style={{
              opacity: verticalBentoRailsOpacity,
              transform: `translate3d(0, ${verticalBentoRailsTranslateY}px, 0)`,
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              isolation: "isolate",
              transition: "opacity 1.2s ease-out, transform 1.2s ease-out",
            }}
          >
              {(() => {
                const ms = vbMetrics.milestones;
                const { expand, opacity } = vbDeriveRails(verticalBentoU, ms);
                const gapPx = vbRailsInterGapPx();
                const railGapsPx = gapPx * 2;
                let usable = Math.max(vbMetrics.stickyColumnH - railGapsPx, 220);
                let collapsedPx = Math.max(48, Math.min(90, Math.round(usable * 0.108)));
                let expandedMax = usable - 2 * collapsedPx;
                while (expandedMax < collapsedPx + 40 && collapsedPx > 40) {
                  collapsedPx -= 2;
                  expandedMax = usable - 2 * collapsedPx;
                }
                collapsedPx = Math.max(40, collapsedPx);
                expandedMax = Math.max(collapsedPx + 4, usable - 2 * collapsedPx);
                const localBar = vbPhaseLocalProgress(verticalBentoU, ms);
                const barRail = vbDominantRailIndex(expand);
                const dominantOpenT = vbSmoothstep01((expand[barRail] - 0.982) / (1 - 0.982));
                const barGate = dominantOpenT;
                const showProgressBar =
                  dominantOpenT > 0.04 && verticalBentoU >= ms.uOpenEnd && verticalBentoRailsOpacity * barGate > 0.06;

                return (
                  <div className="relative w-full overflow-visible" style={{ height: vbMetrics.stickyColumnH }}>
                    <div
                      className="relative z-[3] flex min-h-0 w-full flex-col gap-4 iphone-page:gap-3.5"
                      style={{ height: vbMetrics.stickyColumnH }}
                    >
                      {([0, 1, 2] as const).map((i) => {
                        const h = vbRailHeightPx(expand[i], collapsedPx, expandedMax);
                        const flexGrow = Math.max(8, Math.round(h * 48));
                        const trackOpacity =
                          dominantOpenT > 0.12 ? verticalBentoRailsOpacity * barGate * opacity[i] : 0;

                        return (
                          <div
                            key={i}
                            aria-hidden
                            className={
                              i === 1
                                ? "relative flex min-h-0 w-full overflow-hidden rounded-2xl ring-1 ring-black/[0.06]"
                                : "relative flex min-h-0 w-full overflow-hidden rounded-2xl py-3 iphone-page:py-3.5 ring-1 ring-black/[0.06]"
                            }
                            style={{
                              flexGrow,
                              flexShrink: 1,
                              flexBasis: 0,
                              minHeight: 0,
                              opacity: opacity[i],
                            }}
                          >
                            <div className="absolute inset-0 z-[1] rounded-2xl" style={{ background: VBENTO_WORKFLOW_GRADIENTS[i] }} />
                            <div
                              className="absolute inset-0 z-[1] pointer-events-none rounded-2xl"
                              style={WORKFLOW_CAROUSEL_GRAIN_STYLE}
                            />
                            <div className="absolute inset-0 z-[1] pointer-events-none rounded-2xl overflow-hidden">
                            {i === 0 ? (
                              <svg
                                className="absolute inset-0 h-full w-full"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 700 700"
                                preserveAspectRatio="none"
                                aria-hidden
                              >
                                <defs>
                                  <pattern
                                    id="vbBentoDiagRail"
                                    x="0"
                                    y="0"
                                    width="60"
                                    height="60"
                                    patternUnits="userSpaceOnUse"
                                    patternTransform="rotate(45)"
                                  >
                                    <path d="M 0 0 L 60 0 M 0 0 L 0 60" fill="none" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="0.8" />
                                  </pattern>
                                </defs>
                                <rect width="100%" height="100%" fill="url(#vbBentoDiagRail)" />
                              </svg>
                            ) : null}
                            {i === 1 ? (
                              <svg
                                className="absolute inset-0 h-full w-full"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 700 700"
                                preserveAspectRatio="none"
                                aria-hidden
                              >
                                <defs>
                                  <pattern id="vbBentoHexRail" x="0" y="0" width="80" height="69.28" patternUnits="userSpaceOnUse">
                                    <path
                                      d="M 40 0 L 80 17.32 L 80 51.96 L 40 69.28 L 0 51.96 L 0 17.32 Z"
                                      fill="none"
                                      stroke="rgba(255, 255, 255, 0.1)"
                                      strokeWidth="0.8"
                                    />
                                  </pattern>
                                </defs>
                                <rect width="100%" height="100%" fill="url(#vbBentoHexRail)" />
                              </svg>
                            ) : null}
                            {i === 2 ? (
                              <svg
                                className="absolute inset-0 h-full w-full"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 700 700"
                                preserveAspectRatio="none"
                                aria-hidden
                              >
                                {Array.from({ length: 12 }, (_, w) => (
                                  <path
                                    key={`vb-bento-wave-${w}`}
                                    d={`M -40 ${60 + w * 58} Q 175 ${20 + w * 58} 350 ${60 + w * 58} T 740 ${60 + w * 58}`}
                                    fill="none"
                                    stroke="rgba(255, 255, 255, 0.12)"
                                    strokeWidth="1"
                                  />
                                ))}
                              </svg>
                            ) : null}
                          </div>
                            {i === barRail ? (
                              <div
                                className={`pointer-events-none absolute left-5 top-7 bottom-7 z-[8] w-[3px] rounded-full bg-white/30 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.2)]`}
                                style={{
                                  opacity: trackOpacity,
                                  transition:
                                    "opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                                  transform: dominantOpenT < 0.02 ? "scaleY(0.02)" : "scaleY(1)",
                                  transformOrigin: "top center",
                                }}
                                {...(showProgressBar && dominantOpenT > 0.12
                                  ? ({
                                      role: "progressbar",
                                      "aria-valuemin": 0,
                                      "aria-valuemax": 100,
                                      "aria-valuenow": Math.round(localBar * 100),
                                      "aria-label": "Progress within the current bento step",
                                    } as const)
                                  : { "aria-hidden": true })}
                              >
                                {dominantOpenT > 0.1 ? (
                                  <div className="absolute inset-0 overflow-hidden rounded-full">
                                    <div
                                      className="absolute left-0 right-0 top-0 rounded-full bg-white/75"
                                      style={{ height: `${Math.max(0, Math.min(1, localBar)) * 100}%` }}
                                    />
                                  </div>
                                ) : null}
                              </div>
                            ) : null}
                        </div>
                      );
                    })}
                    </div>
                  </div>
                );
              })()}
          </div>
        </div>
      </section>
    </>
  );
}
