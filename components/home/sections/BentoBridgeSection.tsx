"use client";

import { inter, lora } from "@/lib/home/fonts";
import { narrowHorizontalInset } from "@/lib/home/hero-constants";
import {
  VBENTO_BRIDGE_TESTIMONIALS,
  vbBridgeGraphemeLen,
  vbBridgeSliceGraphemes,
} from "@/lib/home/vertical-bento";
import type { BentoBridgeSectionProps } from "@/components/home/PhoneHomeTypes";

export function BentoBridgeSection(props: BentoBridgeSectionProps) {
  const {
    bentoBridgeSectionRef,
    bentoBridgeSectionEntered,
    bentoBridgeStage,
    bentoBridgeContentFade,
    bentoBridgeTypedLen,
    bentoBridgeCardIndex,
    bentoBridgeCard,
    setBentoBridgeCardIndex,
    setBentoBridgeTypedLen,
    setBentoBridgeTypewriterOn,
    setBentoBridgeContentFade,
    setBentoBridgeTwEpoch,
  } = props;

  return (
    <>
      {/* Bridge between vertical bento and Built for you — tall testimonial band + patient-care grey grid */}
      <section
        ref={bentoBridgeSectionRef}
        className="relative z-10 w-full shrink-0 overflow-hidden bg-[#F7F6F3]"
        aria-labelledby="vbento-bridge-quote"
        style={{ minHeight: "clamp(56rem, 132vh, 112rem)" }}
      >
        <div className="pointer-events-none absolute inset-0 z-0 min-h-full" aria-hidden>
          <svg
            className="pointer-events-none absolute inset-0 h-full min-h-full w-full"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <defs>
              <pattern
                id="vbentoBuiltBridgeGrid"
                x="0"
                y="0"
                width="80"
                height="80"
                patternUnits="userSpaceOnUse"
              >
                <path d="M 0 0 L 80 0 M 0 0 L 0 80" fill="none" stroke="#999999" strokeWidth="0.5" opacity="0.28" />
                <circle cx="0" cy="0" r="1" fill="#999999" opacity="0.35" />
                <circle cx="80" cy="0" r="1" fill="#999999" opacity="0.35" />
                <circle cx="0" cy="80" r="1" fill="#999999" opacity="0.35" />
                <circle cx="80" cy="80" r="1" fill="#999999" opacity="0.35" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#vbentoBuiltBridgeGrid)" />
          </svg>
          <div
            className="absolute inset-x-0 top-0 z-[1] h-[min(6rem,14vw)] bg-gradient-to-b from-[#F7F6F3] to-transparent"
            aria-hidden
          />
          <div
            className="absolute inset-x-0 bottom-0 z-[1] h-[min(6rem,14vw)] bg-gradient-to-t from-[#F7F6F3] to-transparent"
            aria-hidden
          />
        </div>
        <div
          className={`relative z-[2] mx-auto flex w-full max-w-[min(100%,40rem)] flex-col items-start justify-center px-4 pt-[clamp(4.25rem,11vh,7rem)] pb-[clamp(4.5rem,12vh,9rem)] iphone-page:pl-[max(1.5rem,env(safe-area-inset-left,0px))] iphone-page:pr-[max(1.5rem,env(safe-area-inset-right,0px))] md:pt-[clamp(5.25rem,12vh,8rem)] md:pb-[clamp(5.5rem,14vh,11rem)] ${narrowHorizontalInset} transition-[opacity,transform] duration-[820ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:duration-300 ${
            bentoBridgeSectionEntered ? "translate-y-0 opacity-100" : "translate-y-7 opacity-0"
          }`}
          style={{ minHeight: "clamp(56rem, 132vh, 112rem)" }}
        >
          {/** Medallion — same radial + grain + polar grid as orange “Built for you” panel */}
          <div
            className={`mb-[clamp(2.75rem,6.5vh,4.75rem)] flex w-full justify-start transition-[opacity,transform] duration-[920ms] ease-out motion-reduce:duration-300 ${
              bentoBridgeStage >= 1 ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
            aria-hidden
          >
            <div
              className={`bento-bridge-disk relative shrink-0 overflow-hidden rounded-full shadow-[0_20px_56px_rgba(0,0,0,0.14)] ring-1 ring-black/[0.06] motion-reduce:animate-none pointer-events-auto ${
                bentoBridgeStage < 1 ? "[animation-play-state:paused]" : ""
              }`}
              style={{
                width: "clamp(13.5rem, 36vmin, 22.5rem)",
                height: "clamp(13.5rem, 36vmin, 22.5rem)",
                background:
                  "radial-gradient(circle at 50% 36%, #E7A944 0%, #D49D4F 40%, #D2774C 70%, #1E343A 100%)",
              }}
            >
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`,
                  backgroundSize: "200px 200px",
                  opacity: 1,
                  mixBlendMode: "overlay",
                }}
              />
              <svg
                className="pointer-events-none absolute left-1/2 top-1/2 h-[118%] w-[118%] max-w-none -translate-x-1/2 -translate-y-1/2"
                style={{ marginTop: "-4%" }}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1000 1000"
                preserveAspectRatio="xMidYMid meet"
                aria-hidden
              >
                {Array.from({ length: 8 }, (_, j) => {
                  const angle = j * 45;
                  const radius = 500;
                  return (
                    <path
                      key={`vb-bridge-rad-${j}`}
                      d={`M 500 500 L ${500 + Math.cos((angle * Math.PI) / 180) * radius} ${500 + Math.sin((angle * Math.PI) / 180) * radius}`}
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.16)"
                      strokeWidth="0.85"
                    />
                  );
                })}
                {Array.from({ length: 6 }, (_, j) => {
                  const r = (j + 1) * 150;
                  return (
                    <circle
                      key={`vb-bridge-con-${j}`}
                      cx="500"
                      cy="500"
                      r={r}
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.14)"
                      strokeWidth="0.85"
                    />
                  );
                })}
              </svg>
            </div>
          </div>

          <div
            className={`w-full transition-[opacity,transform] duration-[820ms] ease-out motion-reduce:duration-300 ${
              bentoBridgeStage >= 2 ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <div
              style={{
                opacity: bentoBridgeStage >= 2 ? bentoBridgeContentFade : 0,
                transition: "opacity 0.48s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              <blockquote className="m-0 w-full text-left" aria-live="polite">
                <span id="vbento-bridge-quote" className="sr-only">
                  {bentoBridgeCard.quote}
                </span>
                {/** Ghost reserves height; gradient applies only to typed span so the caret can sit inline at the insertion point. */}
                <div
                  className="relative w-full"
                  style={{ isolation: "isolate", backfaceVisibility: "hidden", contain: "layout paint" }}
                >
                  <p
                    className={`pointer-events-none m-0 select-none text-left font-normal tracking-[-0.02em] invisible ${lora.className}`}
                    style={{
                      fontSize: "clamp(2.72rem, 6.75vw, 5.2rem)",
                      lineHeight: 1.26,
                    }}
                    aria-hidden
                  >
                    {bentoBridgeCard.quote}
                  </p>
                  <p
                    className={`absolute inset-0 m-0 text-left font-normal tracking-[-0.02em] ${lora.className}`}
                    style={{
                      fontSize: "clamp(2.72rem, 6.75vw, 5.2rem)",
                      lineHeight: 1.26,
                      textRendering: "geometricPrecision",
                    }}
                    aria-hidden="true"
                  >
                    <span
                      style={{
                        backgroundImage:
                          "linear-gradient(168deg, #6e635e 0%, #887056 16%, #9c7d5c 34%, #b08f68 50%, #9a7b5e 68%, #7d6656 84%, #6a5c54 100%)",
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        color: "transparent",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {vbBridgeSliceGraphemes(bentoBridgeCard.quote, bentoBridgeTypedLen)}
                    </span>
                    {bentoBridgeTypedLen < vbBridgeGraphemeLen(bentoBridgeCard.quote) ? (
                      <span
                        className="bento-bridge-caret motion-reduce:animate-none inline-block align-baseline"
                        style={{
                          width: 3,
                          height: "0.68em",
                          marginLeft: "0.04em",
                          verticalAlign: "-0.07em",
                        }}
                      />
                    ) : null}
                  </p>
                </div>
              </blockquote>
            </div>

            <div
              className={`mt-[clamp(2.5rem,5.5vh,4.25rem)] flex w-full flex-col items-start justify-start gap-5 transition-[opacity,transform] duration-[820ms] ease-out motion-reduce:duration-300 ${
                bentoBridgeStage >= 3 ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              } ${inter.className}`}
            >
              <div
                style={{
                  opacity: bentoBridgeStage >= 3 ? bentoBridgeContentFade : 0,
                  transition: "opacity 0.48s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                <div className="flex w-full max-w-full flex-row items-start justify-start gap-5">
                  <div
                    className="flex h-[clamp(3.5rem,9vw,4.75rem)] w-[clamp(3.5rem,9vw,4.75rem)] shrink-0 items-center justify-center rounded-full bg-[#5a5a5a] text-[clamp(1rem,2.35vw,1.2rem)] font-semibold tracking-tight text-white/95"
                    aria-hidden
                  >
                    {bentoBridgeCard.initials}
                  </div>
                  <div className="min-h-[5.5rem] min-w-0 flex-1 pl-0.5 text-left">
                    <p className="m-0 text-[clamp(1.55rem,3.55vw,2.05rem)] font-semibold leading-snug tracking-tight text-gray-900">
                      {bentoBridgeCard.name}
                    </p>
                    <p className="mt-2 m-0 text-[clamp(1.2rem,2.75vw,1.55rem)] font-medium leading-snug tracking-tight text-gray-600">
                      {bentoBridgeCard.meta}
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="mt-2.5 flex w-full items-center justify-start gap-5 pt-1.5"
                role="group"
                aria-label="Choose testimonial"
              >
                {VBENTO_BRIDGE_TESTIMONIALS.map((_, i) => {
                  const active = i === bentoBridgeCardIndex;
                  return (
                    <button
                      key={i}
                      type="button"
                      aria-label={`Testimonial ${i + 1} of ${VBENTO_BRIDGE_TESTIMONIALS.length}`}
                      aria-current={active ? "true" : undefined}
                      className={`h-4 w-4 shrink-0 touch-manipulation rounded-full border-0 p-0 outline-none transition-opacity duration-300 ease-out motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-amber-600/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F6F3] ${
                        active ? "opacity-100" : "opacity-45 hover:opacity-80"
                      }`}
                      style={{
                        background: active
                          ? "linear-gradient(145deg, #E7A944 0%, #D49D4F 40%, #D2774C 88%)"
                          : "linear-gradient(180deg, #c9c2bb 0%, #9a928a 100%)",
                      }}
                      onClick={() => {
                        if (i === bentoBridgeCardIndex) return;
                        const prefersReduce =
                          typeof window !== "undefined" &&
                          window.matchMedia("(prefers-reduced-motion: reduce)").matches;
                        if (prefersReduce) {
                          setBentoBridgeCardIndex(i);
                          setBentoBridgeTypedLen(vbBridgeGraphemeLen(VBENTO_BRIDGE_TESTIMONIALS[i].quote));
                          setBentoBridgeTypewriterOn(false);
                          return;
                        }
                        setBentoBridgeContentFade(0);
                        window.setTimeout(() => {
                          setBentoBridgeCardIndex(i);
                          setBentoBridgeTypedLen(0);
                          setBentoBridgeTwEpoch((e) => e + 1);
                          setBentoBridgeTypewriterOn(true);
                          setBentoBridgeContentFade(1);
                        }, 400);
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
